use codec::{Decode, DecodeWithMemTracking, Encode, MaxEncodedLen};
use scale_info::TypeInfo;

pub const COLUMNS: usize = 6;
pub const ROWS: usize = 6;
pub const BOARD_SIZE: usize = COLUMNS * ROWS;
pub const MAX_CARD_VALUE: u8 = 9;
pub const INITIAL_ENERGY: u32 = 100;
pub const MOVE_COST: u32 = 10;
pub const RULES_VERSION: u16 = 1;

const RANDOM_MULTIPLIER: u128 = 16_807;
const RANDOM_INCREMENT: u128 = 19_487_171;
const RANDOM_MODULUS: u128 = 2_147_483_647;
const EMPTY_INDEX: u8 = u8::MAX;

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Default,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub struct Card {
    /// Vertical position. The stable card index determines its column.
    pub y: u8,
    pub value: u8,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub enum Phase {
    Preparing,
    Ready,
    Resolving { depth: u32, combo: u128 },
    Finished,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub enum FinishReason {
    EnergyDepleted,
    MoveLimit,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub enum AdvanceStatus {
    Pending,
    Ready,
    Finished(FinishReason),
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub struct AdvanceReport {
    pub steps: u32,
    pub status: AdvanceStatus,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub struct RulesLimits {
    pub max_moves: u32,
    pub max_transitions: u32,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub enum EngineError {
    ArithmeticOverflow,
    BoardInvariant,
    InvalidCard,
    MoveLimitReached,
    NoEnergy,
    TransitionLimitReached,
    WrongPhase,
    ZeroStepBudget,
}

#[derive(
    Clone,
    Copy,
    Debug,
    Decode,
    DecodeWithMemTracking,
    Encode,
    Eq,
    MaxEncodedLen,
    PartialEq,
    TypeInfo,
)]
pub struct MatchSet {
    pub mask: u64,
    pub groups: u32,
    pub sum: u32,
}

impl MatchSet {
    pub fn is_empty(&self) -> bool {
        self.mask == 0
    }
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub struct Game {
    pub rules_version: u16,
    pub board: [Card; BOARD_SIZE],
    pub rng: [u32; COLUMNS],
    pub energy: u32,
    pub score: u128,
    pub high_combo: u128,
    pub move_count: u32,
    pub transition_count: u32,
    pub phase: Phase,
}

impl Game {
    /// Create a version-one integer game. Large seeds are reduced before the LCG step; this is an
    /// intentional chain-native rule and does not emulate JavaScript floating-point rounding.
    pub fn from_seed(seed: u64) -> Self {
        let mut rng = [0; COLUMNS];
        rng[0] = next_random(seed);
        for column in 1..COLUMNS {
            rng[column] = next_random(u64::from(rng[column - 1]) * 2);
        }
        let mut game = Self {
            rules_version: RULES_VERSION,
            board: [Card::default(); BOARD_SIZE],
            rng,
            energy: INITIAL_ENERGY,
            score: 0,
            high_combo: 0,
            move_count: 0,
            transition_count: 0,
            phase: Phase::Preparing,
        };
        for index in 0..BOARD_SIZE {
            let column = index / ROWS;
            game.board[index] = Card {
                y: (index % ROWS) as u8,
                value: game.draw(column),
            };
        }
        game
    }

    pub fn play(
        &mut self,
        card_index: u8,
        step_budget: u32,
        limits: RulesLimits,
    ) -> Result<AdvanceReport, EngineError> {
        let previous = self.clone();
        let result = self.play_inner(card_index, step_budget, limits);
        if result.is_err() {
            *self = previous;
        }
        result
    }

    pub fn advance(
        &mut self,
        step_budget: u32,
        limits: RulesLimits,
    ) -> Result<AdvanceReport, EngineError> {
        let previous = self.clone();
        let result = self.advance_inner(step_budget, limits);
        if result.is_err() {
            *self = previous;
        }
        result
    }

    pub fn matches(&self) -> Result<MatchSet, EngineError> {
        let field = self.field()?;
        let mut visited = 0u64;
        let mut matched = 0u64;
        let mut groups = 0u32;
        for start in 0..BOARD_SIZE {
            let start_bit = 1u64 << start;
            if visited & start_bit != 0 {
                continue;
            }
            let value = self.board[start].value;
            let mut group = start_bit;
            let mut stack = [0u8; BOARD_SIZE];
            let mut stack_len = 1usize;
            stack[0] = start as u8;
            visited |= start_bit;
            while stack_len > 0 {
                stack_len -= 1;
                let index = stack[stack_len] as usize;
                let column = index / ROWS;
                let y = self.board[index].y as usize;
                let mut neighbors = [EMPTY_INDEX; 4];
                if y + 1 < ROWS {
                    neighbors[0] = field[column * ROWS + y + 1];
                }
                if column + 1 < COLUMNS {
                    neighbors[1] = field[(column + 1) * ROWS + y];
                }
                if y > 0 {
                    neighbors[2] = field[column * ROWS + y - 1];
                }
                if column > 0 {
                    neighbors[3] = field[(column - 1) * ROWS + y];
                }
                for neighbor in neighbors {
                    if neighbor == EMPTY_INDEX {
                        continue;
                    }
                    let neighbor = neighbor as usize;
                    let bit = 1u64 << neighbor;
                    if visited & bit != 0 || self.board[neighbor].value != value {
                        continue;
                    }
                    visited |= bit;
                    group |= bit;
                    stack[stack_len] = neighbor as u8;
                    stack_len += 1;
                }
            }
            if value != 0 && u32::from(value) == group.count_ones() {
                matched |= group;
                groups = groups
                    .checked_add(1)
                    .ok_or(EngineError::ArithmeticOverflow)?;
            }
        }
        let mut sum = 0u32;
        for index in 0..BOARD_SIZE {
            if matched & (1u64 << index) != 0 {
                sum = sum
                    .checked_add(u32::from(self.board[index].value))
                    .ok_or(EngineError::ArithmeticOverflow)?;
            }
        }
        Ok(MatchSet {
            mask: matched,
            groups,
            sum,
        })
    }

    pub fn validate_board(&self) -> Result<(), EngineError> {
        self.field().map(|_| ())
    }

    fn play_inner(
        &mut self,
        card_index: u8,
        step_budget: u32,
        limits: RulesLimits,
    ) -> Result<AdvanceReport, EngineError> {
        if step_budget == 0 {
            return Err(EngineError::ZeroStepBudget);
        }
        if self.phase != Phase::Ready {
            return Err(EngineError::WrongPhase);
        }
        let index = card_index as usize;
        if index >= BOARD_SIZE {
            return Err(EngineError::InvalidCard);
        }
        if self.energy < MOVE_COST {
            return Err(EngineError::NoEnergy);
        }
        if self.move_count >= limits.max_moves {
            return Err(EngineError::MoveLimitReached);
        }
        self.energy -= MOVE_COST;
        self.move_count = self
            .move_count
            .checked_add(1)
            .ok_or(EngineError::ArithmeticOverflow)?;
        self.board[index].value = next_card_value(self.board[index].value);
        self.phase = Phase::Resolving { depth: 1, combo: 0 };
        self.advance_inner(step_budget, limits)
    }

    fn advance_inner(
        &mut self,
        step_budget: u32,
        limits: RulesLimits,
    ) -> Result<AdvanceReport, EngineError> {
        if step_budget == 0 {
            return Err(EngineError::ZeroStepBudget);
        }
        if matches!(self.phase, Phase::Ready | Phase::Finished) {
            return Err(EngineError::WrongPhase);
        }
        let mut steps = 0u32;
        while steps < step_budget {
            match self.phase {
                Phase::Preparing => {
                    let matches = self.matches()?;
                    steps = checked_increment(steps)?;
                    if matches.is_empty() {
                        self.phase = Phase::Ready;
                        return Ok(AdvanceReport {
                            steps,
                            status: AdvanceStatus::Ready,
                        });
                    }
                    self.consume_transition(limits.max_transitions)?;
                    self.replace_and_fall(matches.mask)?;
                }
                Phase::Resolving { depth, combo } => {
                    let matches = self.matches()?;
                    steps = checked_increment(steps)?;
                    if !matches.is_empty() {
                        self.consume_transition(limits.max_transitions)?;
                        self.energy = self
                            .energy
                            .checked_add(matches.sum)
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        let contribution = u128::from(depth)
                            .checked_mul(u128::from(matches.sum))
                            .and_then(|value| value.checked_mul(u128::from(matches.groups)))
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        let combo = combo
                            .checked_add(contribution)
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        self.replace_and_fall(matches.mask)?;
                        self.phase = Phase::Resolving {
                            depth: checked_increment(depth)?,
                            combo,
                        };
                        continue;
                    }
                    let mut combo = combo;
                    if self.energy > INITIAL_ENERGY {
                        let extra = u128::from(depth)
                            .checked_mul(u128::from(self.energy))
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        combo = combo
                            .checked_add(extra)
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        self.energy = INITIAL_ENERGY;
                    }
                    self.score = self
                        .score
                        .checked_add(combo)
                        .ok_or(EngineError::ArithmeticOverflow)?;
                    self.high_combo = self.high_combo.max(combo);
                    let reason = if self.energy < MOVE_COST {
                        Some(FinishReason::EnergyDepleted)
                    } else if self.move_count >= limits.max_moves {
                        Some(FinishReason::MoveLimit)
                    } else {
                        None
                    };
                    if let Some(reason) = reason {
                        self.score = self
                            .score
                            .checked_add(u128::from(self.energy))
                            .ok_or(EngineError::ArithmeticOverflow)?;
                        self.energy = 0;
                        self.phase = Phase::Finished;
                        return Ok(AdvanceReport {
                            steps,
                            status: AdvanceStatus::Finished(reason),
                        });
                    }
                    self.phase = Phase::Ready;
                    return Ok(AdvanceReport {
                        steps,
                        status: AdvanceStatus::Ready,
                    });
                }
                Phase::Ready | Phase::Finished => return Err(EngineError::WrongPhase),
            }
        }
        Ok(AdvanceReport {
            steps,
            status: AdvanceStatus::Pending,
        })
    }

    fn consume_transition(&mut self, max_transitions: u32) -> Result<(), EngineError> {
        if self.transition_count >= max_transitions {
            return Err(EngineError::TransitionLimitReached);
        }
        self.transition_count = checked_increment(self.transition_count)?;
        Ok(())
    }

    fn draw(&mut self, column: usize) -> u8 {
        let value = self.rng[column];
        self.rng[column] = next_random(u64::from(value));
        (value % 10) as u8
    }

    fn field(&self) -> Result<[u8; BOARD_SIZE], EngineError> {
        let mut field = [EMPTY_INDEX; BOARD_SIZE];
        for index in 0..BOARD_SIZE {
            let column = index / ROWS;
            let y = self.board[index].y as usize;
            if y >= ROWS {
                return Err(EngineError::BoardInvariant);
            }
            let position = column * ROWS + y;
            if field[position] != EMPTY_INDEX {
                return Err(EngineError::BoardInvariant);
            }
            field[position] = index as u8;
        }
        if field.contains(&EMPTY_INDEX) {
            return Err(EngineError::BoardInvariant);
        }
        Ok(field)
    }

    fn replace_and_fall(&mut self, mask: u64) -> Result<(), EngineError> {
        let mut spawned = [0u8; COLUMNS];
        for index in 0..BOARD_SIZE {
            if mask & (1u64 << index) == 0 {
                continue;
            }
            let column = index / ROWS;
            self.board[index].y = ROWS as u8 + spawned[column];
            spawned[column] = spawned[column]
                .checked_add(1)
                .ok_or(EngineError::ArithmeticOverflow)?;
            self.board[index].value = self.draw(column);
        }
        for column in 0..COLUMNS {
            let mut order = [EMPTY_INDEX; ROWS];
            let mut order_len = 0usize;
            for y in 0..(ROWS * 2) {
                for index in (column * ROWS)..((column + 1) * ROWS) {
                    if self.board[index].y as usize != y {
                        continue;
                    }
                    if order_len >= ROWS {
                        return Err(EngineError::BoardInvariant);
                    }
                    order[order_len] = index as u8;
                    order_len += 1;
                }
            }
            if order_len != ROWS {
                return Err(EngineError::BoardInvariant);
            }
            for (y, index) in order.into_iter().enumerate() {
                self.board[index as usize].y = y as u8;
            }
        }
        self.validate_board()
    }
}

pub fn next_card_value(value: u8) -> u8 {
    if value < MAX_CARD_VALUE { value + 1 } else { 0 }
}

pub fn next_random(previous: u64) -> u32 {
    let previous = u128::from(previous) % RANDOM_MODULUS;
    ((previous * RANDOM_MULTIPLIER + RANDOM_INCREMENT) % RANDOM_MODULUS) as u32
}

fn checked_increment(value: u32) -> Result<u32, EngineError> {
    value.checked_add(1).ok_or(EngineError::ArithmeticOverflow)
}

#[cfg(test)]
mod tests {
    use super::*;

    const LIMITS: RulesLimits = RulesLimits {
        max_moves: 40_000,
        max_transitions: 10_000,
    };

    fn settled_game(board: [Card; BOARD_SIZE]) -> Game {
        Game {
            rules_version: RULES_VERSION,
            board,
            rng: [3, 4, 5, 6, 7, 8],
            energy: INITIAL_ENERGY,
            score: 0,
            high_combo: 0,
            move_count: 0,
            transition_count: 0,
            phase: Phase::Ready,
        }
    }

    fn uniform_board(value: u8) -> [Card; BOARD_SIZE] {
        let mut board = [Card::default(); BOARD_SIZE];
        for (index, card) in board.iter_mut().enumerate() {
            *card = Card {
                y: (index % ROWS) as u8,
                value,
            };
        }
        board
    }

    #[test]
    fn integer_rng_has_stable_vectors() {
        assert_eq!(next_random(0), 19_487_171);
        assert_eq!(next_random(7), 19_604_820);
        assert_eq!(next_random(19_604_820), 952_698_920);
        assert_eq!(next_random(u64::MAX), 19_537_592);
    }

    #[test]
    fn matches_only_exact_orthogonal_group_sizes() {
        let mut board = uniform_board(0);
        board[0].value = 2;
        board[1].value = 2;
        board[6].value = 3;
        board[7].value = 3;
        let game = settled_game(board);
        let matches = game.matches().unwrap();
        assert_eq!(matches.mask, (1u64 << 0) | (1u64 << 1));
        assert_eq!(matches.groups, 1);
        assert_eq!(matches.sum, 4);
    }

    #[test]
    fn preparation_is_resumable_and_settles_without_scoring() {
        let mut game = Game::from_seed(7);
        let first = game.advance(1, LIMITS).unwrap();
        assert_eq!(first.steps, 1);
        assert_eq!(first.status, AdvanceStatus::Pending);
        assert_eq!(game.score, 0);
        while game.phase == Phase::Preparing {
            game.advance(1, LIMITS).unwrap();
        }
        assert_eq!(game.phase, Phase::Ready);
        assert!(game.matches().unwrap().is_empty());
        assert_eq!(game.energy, INITIAL_ENERGY);
        assert_eq!(game.score, 0);
    }

    #[test]
    fn move_resolves_match_energy_and_combo() {
        let mut board = uniform_board(0);
        board[0].value = 1;
        board[6].value = 2;
        let mut game = settled_game(board);
        let report = game.play(0, 8, LIMITS).unwrap();
        assert_eq!(report.status, AdvanceStatus::Ready);
        assert_eq!(game.energy, 94);
        assert_eq!(game.score, 4);
        assert_eq!(game.high_combo, 4);
        assert_eq!(game.move_count, 1);
        assert!(game.matches().unwrap().is_empty());
    }

    #[test]
    fn overflow_combo_uses_full_pre_clamp_energy() {
        let mut game = settled_game(uniform_board(0));
        game.energy = 120;
        game.phase = Phase::Resolving {
            depth: 2,
            combo: 10,
        };
        let report = game.advance(1, LIMITS).unwrap();
        assert_eq!(report.status, AdvanceStatus::Ready);
        assert_eq!(game.energy, 100);
        assert_eq!(game.score, 250);
        assert_eq!(game.high_combo, 250);
    }

    #[test]
    fn energy_exhaustion_finishes_and_moves_remainder_into_score() {
        let mut board = uniform_board(0);
        board[0].value = 1;
        let mut game = settled_game(board);
        game.energy = 12;
        game.score = 5;
        let report = game.play(0, 2, LIMITS).unwrap();
        assert_eq!(
            report.status,
            AdvanceStatus::Finished(FinishReason::EnergyDepleted)
        );
        assert_eq!(game.energy, 0);
        assert_eq!(game.score, 7);
        assert_eq!(game.phase, Phase::Finished);
    }

    #[test]
    fn move_limit_finishes_even_when_energy_remains() {
        let mut board = uniform_board(0);
        board[0].value = 1;
        let mut game = settled_game(board);
        let limits = RulesLimits {
            max_moves: 1,
            max_transitions: 10,
        };
        let report = game.play(0, 2, limits).unwrap();
        assert_eq!(
            report.status,
            AdvanceStatus::Finished(FinishReason::MoveLimit)
        );
        assert_eq!(game.energy, 0);
        assert_eq!(game.score, 90);
    }

    #[test]
    fn transition_limit_rolls_back_the_call() {
        let mut board = uniform_board(0);
        board[0].value = 1;
        board[6].value = 2;
        let mut game = settled_game(board);
        let before = game.clone();
        let error = game
            .play(
                0,
                2,
                RulesLimits {
                    max_moves: 10,
                    max_transitions: 0,
                },
            )
            .unwrap_err();
        assert_eq!(error, EngineError::TransitionLimitReached);
        assert_eq!(game, before);
    }

    #[test]
    fn version_one_matches_javascript_seed_seven_vector() {
        let expected_initial = [
            (0, 0),
            (1, 0),
            (2, 9),
            (4, 9),
            (3, 5),
            (5, 4),
            (0, 9),
            (5, 7),
            (1, 9),
            (2, 4),
            (3, 9),
            (4, 4),
            (0, 4),
            (1, 4),
            (2, 8),
            (3, 2),
            (4, 5),
            (5, 0),
            (0, 0),
            (1, 9),
            (5, 3),
            (2, 7),
            (3, 0),
            (4, 4),
            (0, 0),
            (1, 8),
            (2, 4),
            (3, 4),
            (4, 5),
            (5, 2),
            (0, 8),
            (1, 4),
            (2, 8),
            (3, 7),
            (5, 4),
            (4, 5),
        ];
        let expected_final = [
            (5, 3),
            (0, 0),
            (1, 9),
            (3, 9),
            (2, 5),
            (4, 5),
            (0, 9),
            (5, 8),
            (1, 9),
            (2, 4),
            (3, 9),
            (4, 5),
            (0, 4),
            (1, 4),
            (2, 9),
            (3, 2),
            (4, 5),
            (5, 4),
            (0, 0),
            (1, 9),
            (5, 3),
            (2, 8),
            (3, 0),
            (4, 5),
            (0, 0),
            (1, 8),
            (2, 4),
            (3, 4),
            (4, 6),
            (5, 2),
            (0, 8),
            (1, 4),
            (2, 8),
            (3, 7),
            (5, 4),
            (4, 6),
        ];
        let mut game = Game::from_seed(7);
        while game.phase == Phase::Preparing {
            game.advance(64, LIMITS).unwrap();
        }
        let initial = core::array::from_fn(|index| (game.board[index].y, game.board[index].value));
        assert_eq!(initial, expected_initial);
        let moves = [0, 7, 14, 21, 28, 35, 5, 11, 17, 23];
        for card in moves {
            game.play(card, 64, LIMITS).unwrap();
        }
        let final_board =
            core::array::from_fn(|index| (game.board[index].y, game.board[index].value));
        assert_eq!(final_board, expected_final);
        assert_eq!(game.energy, 0);
        assert_eq!(game.score, 4);
        assert_eq!(game.high_combo, 1);
        assert_eq!(game.move_count, 10);
        assert_eq!(game.phase, Phase::Finished);
    }

    #[test]
    fn invalid_board_is_rejected() {
        let mut game = settled_game(uniform_board(0));
        game.board[1].y = 0;
        assert_eq!(game.validate_board(), Err(EngineError::BoardInvariant));
    }
}
