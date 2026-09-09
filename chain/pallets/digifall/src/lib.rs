#![cfg_attr(not(feature = "std"), no_std)]

extern crate alloc;

pub mod engine;
pub mod extension;
pub mod weights;

#[cfg(feature = "runtime-benchmarks")]
mod benchmarking;
#[cfg(test)]
mod mock;
#[cfg(test)]
mod tests;

pub use engine::{
    AdvanceReport, AdvanceStatus, BOARD_SIZE, COLUMNS, Card, EngineError, FinishReason, Game,
    INITIAL_ENERGY, MAX_CARD_VALUE, MOVE_COST, MatchSet, Phase, ROWS, RULES_VERSION, RulesLimits,
};
pub use extension::CheckNonceForDigifall;
pub use pallet::*;
pub use weights::WeightInfo;

use codec::{Decode, DecodeWithMemTracking, Encode, MaxEncodedLen};
use scale_info::TypeInfo;

pub trait RewardPolicy<Balance> {
    fn reward(stake: Balance, score: u128) -> Option<Balance>;
}

#[cfg(feature = "runtime-benchmarks")]
pub trait BenchmarkHelper<AccountId> {
    fn prepare_reward_asset(owner: &AccountId);
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub struct PendingGame<AccountId, Balance, BlockNumber> {
    pub game_id: u64,
    pub session: AccountId,
    pub stake: Balance,
    pub committed_at: BlockNumber,
    pub reveal_at: BlockNumber,
    pub seed: SeedStatus,
    pub revision: u32,
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
pub enum SeedStatus {
    Awaiting,
    Ready(u64),
    Unavailable,
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub struct RevealRequest<AccountId> {
    pub owner: AccountId,
    pub game_id: u64,
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub struct ActiveGame<AccountId, Balance> {
    pub game_id: u64,
    pub session: AccountId,
    pub stake: Balance,
    pub revision: u32,
    pub game: Game,
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub enum GameSlot<AccountId, Balance, BlockNumber> {
    Pending(PendingGame<AccountId, Balance, BlockNumber>),
    Active(ActiveGame<AccountId, Balance>),
}

impl<AccountId, Balance, BlockNumber> GameSlot<AccountId, Balance, BlockNumber> {
    pub fn revision(&self) -> u32 {
        match self {
            Self::Pending(game) => game.revision,
            Self::Active(game) => game.revision,
        }
    }

    pub fn session(&self) -> &AccountId {
        match self {
            Self::Pending(game) => &game.session,
            Self::Active(game) => &game.session,
        }
    }
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
pub struct StakeBounds<Balance> {
    pub min: Balance,
    pub max: Balance,
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
pub enum FaultReason {
    ArithmeticOverflow,
    BoardInvariant,
    TransitionLimit,
    RewardCalculation,
    RewardAboveLimit,
    RewardMintFailed,
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
pub enum GameOutcome {
    Cancelled,
    Completed(FinishReason),
    Forfeited,
    Faulted(FaultReason),
}

#[derive(
    Clone, Debug, Decode, DecodeWithMemTracking, Encode, Eq, MaxEncodedLen, PartialEq, TypeInfo,
)]
pub struct GameResult<Balance, BlockNumber> {
    pub game_id: u64,
    pub outcome: GameOutcome,
    pub score: u128,
    pub high_combo: u128,
    pub moves: u32,
    pub stake: Balance,
    pub reward: Balance,
    pub ended_at: BlockNumber,
}

#[frame::pallet]
pub mod pallet {
    use super::*;
    use alloc::vec::Vec;
    use frame::prelude::*;
    use polkadot_sdk::frame_support::{
        PalletId,
        traits::{
            Randomness,
            fungible::{Inspect, Mutate},
            tokens::Preservation,
        },
        transactional,
    };
    use polkadot_sdk::sp_runtime::{
        traits::{AccountIdConversion, CheckedAdd, CheckedSub, Zero},
        transaction_validity::{TransactionLongevity, TransactionPriority},
    };

    pub type BalanceOf<T> =
        <<T as Config>::StakeCurrency as Inspect<<T as frame_system::Config>::AccountId>>::Balance;
    pub type PendingGameOf<T> =
        PendingGame<<T as frame_system::Config>::AccountId, BalanceOf<T>, BlockNumberFor<T>>;
    pub type ActiveGameOf<T> = ActiveGame<<T as frame_system::Config>::AccountId, BalanceOf<T>>;
    pub type GameSlotOf<T> =
        GameSlot<<T as frame_system::Config>::AccountId, BalanceOf<T>, BlockNumberFor<T>>;
    pub type GameResultOf<T> = GameResult<BalanceOf<T>, BlockNumberFor<T>>;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        #[allow(deprecated)]
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;

        /// Asset accepted as the game stake. A runtime may bind native balances or a single
        /// `pallet-assets` item through `fungible::ItemOf`.
        type StakeCurrency: Inspect<Self::AccountId> + Mutate<Self::AccountId>;

        /// Separately configured Digifall reward token.
        type RewardCurrency: Inspect<Self::AccountId, Balance = BalanceOf<Self>>
            + Mutate<Self::AccountId>;

        /// Randomness must become newly determined after the stake commitment.
        type GameRandomness: Randomness<Self::Hash, BlockNumberFor<Self>>;

        type RewardPolicy: RewardPolicy<BalanceOf<Self>>;

        #[cfg(feature = "runtime-benchmarks")]
        type BenchmarkHelper: crate::BenchmarkHelper<Self::AccountId>;

        #[pallet::constant]
        type PalletId: Get<PalletId>;

        #[pallet::constant]
        type DefaultMinStake: Get<BalanceOf<Self>>;

        #[pallet::constant]
        type DefaultMaxStake: Get<BalanceOf<Self>>;

        #[pallet::constant]
        type MaxReward: Get<BalanceOf<Self>>;

        #[pallet::constant]
        type MaxMoves: Get<u32>;

        #[pallet::constant]
        type MaxTransitions: Get<u32>;

        #[pallet::constant]
        type MaxStepsPerCall: Get<u32>;

        /// Number of blocks between commitment and the one fixed randomness sample.
        #[pallet::constant]
        type RandomnessDelay: Get<BlockNumberFor<Self>>;

        /// Bounds the reveal queue and `on_initialize` work for any block.
        #[pallet::constant]
        type MaxRevealsPerBlock: Get<u32>;

        /// Pool priority supplied when payment is skipped for a valid progress call.
        #[pallet::constant]
        type FeelessTransactionPriority: Get<TransactionPriority>;

        /// Short pool lifetime for state-dependent fee-free progress calls.
        #[pallet::constant]
        type FeelessTransactionLongevity: Get<TransactionLongevity>;

        type WeightInfo: WeightInfo;
    }

    const STORAGE_VERSION: StorageVersion = StorageVersion::new(1);

    #[pallet::pallet]
    #[pallet::storage_version(STORAGE_VERSION)]
    pub struct Pallet<T>(_);

    #[pallet::type_value]
    pub fn DefaultStakeBounds<T: Config>() -> StakeBounds<BalanceOf<T>> {
        StakeBounds {
            min: T::DefaultMinStake::get(),
            max: T::DefaultMaxStake::get(),
        }
    }

    #[pallet::storage]
    pub type Games<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, GameSlotOf<T>>;

    #[pallet::storage]
    pub type ScheduledReveals<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        BlockNumberFor<T>,
        BoundedVec<RevealRequest<T::AccountId>, T::MaxRevealsPerBlock>,
        ValueQuery,
    >;

    #[pallet::storage]
    pub type SessionOwners<T: Config> = StorageMap<_, Blake2_128Concat, T::AccountId, T::AccountId>;

    #[pallet::storage]
    pub type NextGameIds<T: Config> =
        StorageMap<_, Blake2_128Concat, T::AccountId, u64, ValueQuery>;

    #[pallet::storage]
    pub type TotalEscrowed<T: Config> = StorageValue<_, BalanceOf<T>, ValueQuery>;

    #[pallet::storage]
    pub type LastResults<T: Config> =
        StorageMap<_, Blake2_128Concat, T::AccountId, GameResultOf<T>>;

    #[pallet::storage]
    pub type CurrentStakeBounds<T: Config> =
        StorageValue<_, StakeBounds<BalanceOf<T>>, ValueQuery, DefaultStakeBounds<T>>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        GameCommitted {
            owner: T::AccountId,
            game_id: u64,
            session: T::AccountId,
            stake: BalanceOf<T>,
            reveal_at: BlockNumberFor<T>,
        },
        RandomnessStored {
            owner: T::AccountId,
            game_id: u64,
            available: bool,
        },
        GameActivated {
            owner: T::AccountId,
            game_id: u64,
            revision: u32,
            status: AdvanceStatus,
        },
        MovePlayed {
            owner: T::AccountId,
            game_id: u64,
            controller: T::AccountId,
            card_index: u8,
            revision: u32,
            status: AdvanceStatus,
        },
        GameAdvanced {
            owner: T::AccountId,
            game_id: u64,
            controller: T::AccountId,
            revision: u32,
            status: AdvanceStatus,
        },
        SessionRotated {
            owner: T::AccountId,
            game_id: u64,
            old_session: T::AccountId,
            new_session: T::AccountId,
            revision: u32,
        },
        GameCompleted {
            owner: T::AccountId,
            game_id: u64,
            reason: FinishReason,
            score: u128,
            stake: BalanceOf<T>,
            reward: BalanceOf<T>,
        },
        GameForfeited {
            owner: T::AccountId,
            game_id: u64,
            stake: BalanceOf<T>,
        },
        GameCancelled {
            owner: T::AccountId,
            game_id: u64,
            refunded: BalanceOf<T>,
        },
        GameFaulted {
            owner: T::AccountId,
            game_id: u64,
            reason: FaultReason,
            refunded: BalanceOf<T>,
        },
        StakeBoundsUpdated {
            min: BalanceOf<T>,
            max: BalanceOf<T>,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        AlreadyPlaying,
        ArithmeticOverflow,
        CancellationNotAllowed,
        EscrowInvariant,
        InvalidCard,
        InvalidStakeBounds,
        MoveLimitReached,
        NoEnergy,
        NoGame,
        NotController,
        NotOwner,
        RandomnessNotReady,
        RandomnessUnavailable,
        RevealQueueFull,
        SessionInUse,
        SessionMustDiffer,
        SessionUnchanged,
        StaleRevision,
        StakeAboveMaximum,
        StakeBelowMinimum,
        StepBudgetTooLarge,
        StepBudgetZero,
        UnexpectedPhase,
        WrongGameId,
    }

    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
        fn on_initialize(block_number: BlockNumberFor<T>) -> Weight {
            let requests = ScheduledReveals::<T>::take(block_number);
            let request_count = requests.len() as u32;
            for request in requests {
                Games::<T>::mutate(&request.owner, |maybe_slot| {
                    let Some(GameSlot::Pending(pending)) = maybe_slot else {
                        return;
                    };
                    if pending.game_id != request.game_id
                        || pending.reveal_at != block_number
                        || pending.seed != SeedStatus::Awaiting
                    {
                        return;
                    }
                    let (entropy, known_since) = T::GameRandomness::random(
                        &Self::randomness_subject(&request.owner, pending),
                    );
                    let available = known_since > pending.committed_at;
                    pending.seed = if available {
                        SeedStatus::Ready(Self::seed_from_entropy(entropy.as_ref()))
                    } else {
                        SeedStatus::Unavailable
                    };
                    Self::deposit_event(Event::RandomnessStored {
                        owner: request.owner.clone(),
                        game_id: request.game_id,
                        available,
                    });
                });
            }
            T::WeightInfo::on_initialize(request_count)
        }

        fn integrity_test() {
            assert!(!T::DefaultMinStake::get().is_zero());
            assert!(T::DefaultMaxStake::get() >= T::DefaultMinStake::get());
            assert!(T::MaxMoves::get() > 0);
            assert!(T::MaxTransitions::get() > 0);
            assert!(T::MaxStepsPerCall::get() > 0);
            assert!(!T::RandomnessDelay::get().is_zero());
            assert!(T::MaxRevealsPerBlock::get() > 0);
            assert!(T::FeelessTransactionPriority::get() > 0);
            assert!(T::FeelessTransactionLongevity::get() > 0);
        }
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        /// Lock a stake before any board-producing randomness is accepted.
        #[pallet::call_index(0)]
        #[pallet::weight(T::WeightInfo::commit_game())]
        #[transactional]
        pub fn commit_game(
            origin: OriginFor<T>,
            session: T::AccountId,
            #[pallet::compact] stake: BalanceOf<T>,
        ) -> DispatchResult {
            let owner = ensure_signed(origin)?;
            ensure!(
                !Games::<T>::contains_key(&owner),
                Error::<T>::AlreadyPlaying
            );
            ensure!(session != owner, Error::<T>::SessionMustDiffer);
            ensure!(
                !SessionOwners::<T>::contains_key(&session),
                Error::<T>::SessionInUse
            );
            let bounds = CurrentStakeBounds::<T>::get();
            ensure!(stake >= bounds.min, Error::<T>::StakeBelowMinimum);
            ensure!(stake <= bounds.max, Error::<T>::StakeAboveMaximum);
            let committed_at = frame_system::Pallet::<T>::block_number();
            let reveal_at = committed_at
                .checked_add(&T::RandomnessDelay::get())
                .ok_or(Error::<T>::ArithmeticOverflow)?;

            let game_id = NextGameIds::<T>::try_mutate(&owner, |last_id| {
                let game_id = last_id
                    .checked_add(1)
                    .ok_or(Error::<T>::ArithmeticOverflow)?;
                *last_id = game_id;
                Ok::<_, Error<T>>(game_id)
            })?;
            ScheduledReveals::<T>::try_mutate(reveal_at, |requests| {
                requests
                    .try_push(RevealRequest {
                        owner: owner.clone(),
                        game_id,
                    })
                    .map_err(|_| Error::<T>::RevealQueueFull)
            })?;
            T::StakeCurrency::transfer(
                &owner,
                &Self::pot_account(),
                stake,
                Preservation::Preserve,
            )?;
            TotalEscrowed::<T>::try_mutate(|total| {
                *total = total
                    .checked_add(&stake)
                    .ok_or(Error::<T>::ArithmeticOverflow)?;
                Ok::<_, Error<T>>(())
            })?;
            frame_system::Pallet::<T>::inc_sufficients(&session);
            SessionOwners::<T>::insert(&session, &owner);
            Games::<T>::insert(
                &owner,
                GameSlot::Pending(PendingGame {
                    game_id,
                    session: session.clone(),
                    stake,
                    committed_at,
                    reveal_at,
                    seed: SeedStatus::Awaiting,
                    revision: 0,
                }),
            );
            Self::deposit_event(Event::GameCommitted {
                owner,
                game_id,
                session,
                stake,
                reveal_at,
            });
            Ok(())
        }

        /// Initialize the committed board once the randomness provider reports fresh entropy.
        #[pallet::call_index(1)]
        #[pallet::weight(
            T::WeightInfo::activate_game(*step_budget)
                .saturating_add(
                    T::WeightInfo::resolution_step()
                        .max(T::WeightInfo::resolution_step_groups())
                        .saturating_mul((*step_budget).into())
                )
                .saturating_add(T::WeightInfo::advance_fault())
        )]
        #[pallet::feeless_if(|origin: &OriginFor<T>, owner: &T::AccountId, game_id: &u64, expected_revision: &u32, step_budget: &u32| -> bool {
            Pallet::<T>::is_feeless_activation(origin, owner, *game_id, *expected_revision, *step_budget)
        })]
        #[transactional]
        pub fn activate_game(
            origin: OriginFor<T>,
            owner: T::AccountId,
            #[pallet::compact] game_id: u64,
            expected_revision: u32,
            #[pallet::compact] step_budget: u32,
        ) -> DispatchResult {
            let controller = ensure_signed(origin)?;
            Self::ensure_step_budget(step_budget)?;
            let pending = match Games::<T>::get(&owner).ok_or(Error::<T>::NoGame)? {
                GameSlot::Pending(game) => game,
                GameSlot::Active(_) => return Err(Error::<T>::UnexpectedPhase.into()),
            };
            Self::ensure_controller(&controller, &owner, &pending.session)?;
            ensure!(pending.game_id == game_id, Error::<T>::WrongGameId);
            ensure!(
                pending.revision == expected_revision,
                Error::<T>::StaleRevision
            );
            let seed = match pending.seed {
                SeedStatus::Ready(seed) => seed,
                SeedStatus::Awaiting => return Err(Error::<T>::RandomnessNotReady.into()),
                SeedStatus::Unavailable => return Err(Error::<T>::RandomnessUnavailable.into()),
            };
            let mut active = ActiveGame {
                game_id: pending.game_id,
                session: pending.session,
                stake: pending.stake,
                revision: Self::increment_revision(pending.revision)?,
                game: Game::from_seed(seed),
            };
            let report = match active.game.advance(step_budget, Self::rules_limits()) {
                Ok(report) => report,
                Err(error) => return Self::handle_engine_fault(&owner, active, error),
            };
            Self::deposit_event(Event::GameActivated {
                owner: owner.clone(),
                game_id: active.game_id,
                revision: active.revision,
                status: report.status,
            });
            Self::store_or_settle(&owner, active, report)
        }

        /// Apply one card increment and a bounded amount of automatic resolution work.
        #[pallet::call_index(2)]
        #[pallet::weight(
            T::WeightInfo::play(*step_budget)
                .saturating_add(
                    T::WeightInfo::resolution_step()
                        .max(T::WeightInfo::resolution_step_groups())
                        .saturating_mul((*step_budget).into())
                )
                .saturating_add(T::WeightInfo::play_settlement())
                .saturating_add(T::WeightInfo::play_fault())
        )]
        #[pallet::feeless_if(|origin: &OriginFor<T>, owner: &T::AccountId, game_id: &u64, expected_revision: &u32, card_index: &u8, step_budget: &u32| -> bool {
            Pallet::<T>::is_feeless_play(origin, owner, *game_id, *expected_revision, *card_index, *step_budget)
        })]
        #[transactional]
        pub fn play(
            origin: OriginFor<T>,
            owner: T::AccountId,
            #[pallet::compact] game_id: u64,
            expected_revision: u32,
            card_index: u8,
            #[pallet::compact] step_budget: u32,
        ) -> DispatchResult {
            let controller = ensure_signed(origin)?;
            Self::ensure_step_budget(step_budget)?;
            let mut active = Self::active_game(&owner)?;
            Self::ensure_controller(&controller, &owner, &active.session)?;
            ensure!(active.game_id == game_id, Error::<T>::WrongGameId);
            ensure!(
                active.revision == expected_revision,
                Error::<T>::StaleRevision
            );
            let report = match active
                .game
                .play(card_index, step_budget, Self::rules_limits())
            {
                Ok(report) => report,
                Err(error) if Self::fault_reason(error).is_some() => {
                    return Self::handle_engine_fault(&owner, active, error);
                }
                Err(error) => return Err(Self::engine_dispatch_error(error).into()),
            };
            active.revision = Self::increment_revision(active.revision)?;
            Self::deposit_event(Event::MovePlayed {
                owner: owner.clone(),
                game_id: active.game_id,
                controller,
                card_index,
                revision: active.revision,
                status: report.status,
            });
            Self::store_or_settle(&owner, active, report)
        }

        /// Continue preparation or cascade resolution without accepting another move.
        #[pallet::call_index(3)]
        #[pallet::weight(
            T::WeightInfo::advance(*step_budget)
                .saturating_add(
                    T::WeightInfo::resolution_step()
                        .max(T::WeightInfo::resolution_step_groups())
                        .saturating_mul((*step_budget).into())
                )
                .saturating_add(T::WeightInfo::advance_settlement())
                .saturating_add(T::WeightInfo::advance_fault())
        )]
        #[pallet::feeless_if(|origin: &OriginFor<T>, owner: &T::AccountId, game_id: &u64, expected_revision: &u32, step_budget: &u32| -> bool {
            Pallet::<T>::is_feeless_advance(origin, owner, *game_id, *expected_revision, *step_budget)
        })]
        #[transactional]
        pub fn advance(
            origin: OriginFor<T>,
            owner: T::AccountId,
            #[pallet::compact] game_id: u64,
            expected_revision: u32,
            #[pallet::compact] step_budget: u32,
        ) -> DispatchResult {
            let controller = ensure_signed(origin)?;
            Self::ensure_step_budget(step_budget)?;
            let mut active = Self::active_game(&owner)?;
            Self::ensure_controller(&controller, &owner, &active.session)?;
            ensure!(active.game_id == game_id, Error::<T>::WrongGameId);
            ensure!(
                active.revision == expected_revision,
                Error::<T>::StaleRevision
            );
            let report = match active.game.advance(step_budget, Self::rules_limits()) {
                Ok(report) => report,
                Err(error) if Self::fault_reason(error).is_some() => {
                    return Self::handle_engine_fault(&owner, active, error);
                }
                Err(error) => return Err(Self::engine_dispatch_error(error).into()),
            };
            active.revision = Self::increment_revision(active.revision)?;
            Self::deposit_event(Event::GameAdvanced {
                owner: owner.clone(),
                game_id: active.game_id,
                controller,
                revision: active.revision,
                status: report.status,
            });
            Self::store_or_settle(&owner, active, report)
        }

        /// Replace a lost or compromised session account. Only the owner may rotate it.
        #[pallet::call_index(4)]
        #[pallet::weight(T::WeightInfo::rotate_session())]
        #[transactional]
        pub fn rotate_session(
            origin: OriginFor<T>,
            expected_revision: u32,
            new_session: T::AccountId,
        ) -> DispatchResult {
            let owner = ensure_signed(origin)?;
            ensure!(new_session != owner, Error::<T>::SessionMustDiffer);
            let mut slot = Games::<T>::get(&owner).ok_or(Error::<T>::NoGame)?;
            ensure!(
                slot.revision() == expected_revision,
                Error::<T>::StaleRevision
            );
            let old_session = slot.session().clone();
            ensure!(old_session != new_session, Error::<T>::SessionUnchanged);
            ensure!(
                !SessionOwners::<T>::contains_key(&new_session),
                Error::<T>::SessionInUse
            );
            frame_system::Pallet::<T>::inc_sufficients(&new_session);
            SessionOwners::<T>::insert(&new_session, &owner);
            SessionOwners::<T>::remove(&old_session);
            frame_system::Pallet::<T>::dec_sufficients(&old_session);
            let revision = Self::increment_revision(expected_revision)?;
            let game_id = match &mut slot {
                GameSlot::Pending(game) => {
                    game.session = new_session.clone();
                    game.revision = revision;
                    game.game_id
                }
                GameSlot::Active(game) => {
                    game.session = new_session.clone();
                    game.revision = revision;
                    game.game_id
                }
            };
            Games::<T>::insert(&owner, slot);
            Self::deposit_event(Event::SessionRotated {
                owner,
                game_id,
                old_session,
                new_session,
                revision,
            });
            Ok(())
        }

        /// End the owner's game without reward. The committed stake remains in the pallet pot.
        #[pallet::call_index(5)]
        #[pallet::weight(T::WeightInfo::forfeit())]
        #[transactional]
        pub fn forfeit(origin: OriginFor<T>, expected_revision: u32) -> DispatchResult {
            let owner = ensure_signed(origin)?;
            let slot = Games::<T>::get(&owner).ok_or(Error::<T>::NoGame)?;
            ensure!(
                slot.revision() == expected_revision,
                Error::<T>::StaleRevision
            );
            let (game_id, session, stake, score, high_combo, moves, pending_reveal) = match slot {
                GameSlot::Pending(game) => (
                    game.game_id,
                    game.session,
                    game.stake,
                    0,
                    0,
                    0,
                    Some(game.reveal_at),
                ),
                GameSlot::Active(game) => (
                    game.game_id,
                    game.session,
                    game.stake,
                    game.game.score,
                    game.game.high_combo,
                    game.game.move_count,
                    None,
                ),
            };
            if let Some(reveal_at) = pending_reveal {
                Self::unschedule_reveal(reveal_at, &owner, game_id);
            }
            Self::consume_escrow(stake)?;
            Self::cleanup_session(&session);
            Games::<T>::remove(&owner);
            LastResults::<T>::insert(
                &owner,
                GameResult {
                    game_id,
                    outcome: GameOutcome::Forfeited,
                    score,
                    high_combo,
                    moves,
                    stake,
                    reward: Zero::zero(),
                    ended_at: frame_system::Pallet::<T>::block_number(),
                },
            );
            Self::deposit_event(Event::GameForfeited {
                owner,
                game_id,
                stake,
            });
            Ok(())
        }

        /// Refund a pending game only when its one scheduled randomness sample failed.
        #[pallet::call_index(6)]
        #[pallet::weight(T::WeightInfo::cancel_pending())]
        #[transactional]
        pub fn cancel_pending(origin: OriginFor<T>, expected_revision: u32) -> DispatchResult {
            let owner = ensure_signed(origin)?;
            let pending = match Games::<T>::get(&owner).ok_or(Error::<T>::NoGame)? {
                GameSlot::Pending(game) => game,
                GameSlot::Active(_) => return Err(Error::<T>::CancellationNotAllowed.into()),
            };
            ensure!(
                pending.revision == expected_revision,
                Error::<T>::StaleRevision
            );
            let missed_reveal = pending.seed == SeedStatus::Awaiting
                && frame_system::Pallet::<T>::block_number() > pending.reveal_at;
            ensure!(
                pending.seed == SeedStatus::Unavailable || missed_reveal,
                Error::<T>::CancellationNotAllowed
            );
            Self::unschedule_reveal(pending.reveal_at, &owner, pending.game_id);
            T::StakeCurrency::transfer(
                &Self::pot_account(),
                &owner,
                pending.stake,
                Preservation::Expendable,
            )?;
            Self::consume_escrow(pending.stake)?;
            Self::cleanup_session(&pending.session);
            Games::<T>::remove(&owner);
            LastResults::<T>::insert(
                &owner,
                GameResult {
                    game_id: pending.game_id,
                    outcome: GameOutcome::Cancelled,
                    score: 0,
                    high_combo: 0,
                    moves: 0,
                    stake: pending.stake,
                    reward: Zero::zero(),
                    ended_at: frame_system::Pallet::<T>::block_number(),
                },
            );
            Self::deposit_event(Event::GameCancelled {
                owner,
                game_id: pending.game_id,
                refunded: pending.stake,
            });
            Ok(())
        }

        #[pallet::call_index(7)]
        #[pallet::weight(T::WeightInfo::set_stake_bounds())]
        pub fn set_stake_bounds(
            origin: OriginFor<T>,
            #[pallet::compact] min: BalanceOf<T>,
            #[pallet::compact] max: BalanceOf<T>,
        ) -> DispatchResult {
            ensure_root(origin)?;
            ensure!(!min.is_zero() && max >= min, Error::<T>::InvalidStakeBounds);
            CurrentStakeBounds::<T>::put(StakeBounds { min, max });
            Self::deposit_event(Event::StakeBoundsUpdated { min, max });
            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        pub fn pot_account() -> T::AccountId {
            T::PalletId::get().into_account_truncating()
        }

        pub fn is_feeless_activation(
            origin: &OriginFor<T>,
            owner: &T::AccountId,
            game_id: u64,
            expected_revision: u32,
            step_budget: u32,
        ) -> bool {
            if !Self::valid_step_budget(step_budget) {
                return false;
            }
            let Some(GameSlot::Pending(game)) = Games::<T>::get(owner) else {
                return false;
            };
            game.game_id == game_id
                && game.revision == expected_revision
                && matches!(game.seed, SeedStatus::Ready(_))
                && Self::is_session_origin(origin, owner, &game.session)
        }

        pub fn is_feeless_play(
            origin: &OriginFor<T>,
            owner: &T::AccountId,
            game_id: u64,
            expected_revision: u32,
            card_index: u8,
            step_budget: u32,
        ) -> bool {
            if !Self::valid_step_budget(step_budget) || card_index as usize >= BOARD_SIZE {
                return false;
            }
            let Some(GameSlot::Active(game)) = Games::<T>::get(owner) else {
                return false;
            };
            game.game_id == game_id
                && game.revision == expected_revision
                && game.game.phase == Phase::Ready
                && game.game.energy >= MOVE_COST
                && game.game.move_count < T::MaxMoves::get()
                && Self::is_session_origin(origin, owner, &game.session)
        }

        pub fn is_feeless_advance(
            origin: &OriginFor<T>,
            owner: &T::AccountId,
            game_id: u64,
            expected_revision: u32,
            step_budget: u32,
        ) -> bool {
            if !Self::valid_step_budget(step_budget) {
                return false;
            }
            let Some(GameSlot::Active(game)) = Games::<T>::get(owner) else {
                return false;
            };
            game.game_id == game_id
                && game.revision == expected_revision
                && matches!(game.game.phase, Phase::Preparing | Phase::Resolving { .. })
                && Self::is_session_origin(origin, owner, &game.session)
        }

        fn valid_step_budget(step_budget: u32) -> bool {
            step_budget > 0 && step_budget <= T::MaxStepsPerCall::get()
        }

        fn ensure_step_budget(step_budget: u32) -> Result<(), Error<T>> {
            ensure!(step_budget > 0, Error::<T>::StepBudgetZero);
            ensure!(
                step_budget <= T::MaxStepsPerCall::get(),
                Error::<T>::StepBudgetTooLarge
            );
            Ok(())
        }

        fn is_session_origin(
            origin: &OriginFor<T>,
            owner: &T::AccountId,
            session: &T::AccountId,
        ) -> bool {
            ensure_signed(origin.clone())
                .ok()
                .is_some_and(|controller| {
                    controller == *session
                        && SessionOwners::<T>::get(session).as_ref() == Some(owner)
                })
        }

        fn ensure_controller(
            controller: &T::AccountId,
            owner: &T::AccountId,
            session: &T::AccountId,
        ) -> Result<(), Error<T>> {
            ensure!(
                controller == owner
                    || (controller == session
                        && SessionOwners::<T>::get(session).as_ref() == Some(owner)),
                Error::<T>::NotController
            );
            Ok(())
        }

        fn active_game(owner: &T::AccountId) -> Result<ActiveGameOf<T>, Error<T>> {
            match Games::<T>::get(owner).ok_or(Error::<T>::NoGame)? {
                GameSlot::Active(game) => Ok(game),
                GameSlot::Pending(_) => Err(Error::<T>::UnexpectedPhase),
            }
        }

        fn randomness_subject(owner: &T::AccountId, pending: &PendingGameOf<T>) -> Vec<u8> {
            (
                b"digifall/game/v1",
                owner,
                pending.game_id,
                pending.committed_at,
                pending.reveal_at,
            )
                .encode()
        }

        fn seed_from_entropy(entropy: &[u8]) -> u64 {
            let mut seed_bytes = [0u8; 8];
            for (target, source) in seed_bytes.iter_mut().zip(entropy.iter()) {
                *target = *source;
            }
            u64::from_le_bytes(seed_bytes)
        }

        fn unschedule_reveal(reveal_at: BlockNumberFor<T>, owner: &T::AccountId, game_id: u64) {
            ScheduledReveals::<T>::mutate_exists(reveal_at, |maybe_requests| {
                let Some(requests) = maybe_requests else {
                    return;
                };
                requests.retain(|request| request.owner != *owner || request.game_id != game_id);
                if requests.is_empty() {
                    *maybe_requests = None;
                }
            });
        }

        fn rules_limits() -> RulesLimits {
            RulesLimits {
                max_moves: T::MaxMoves::get(),
                max_transitions: T::MaxTransitions::get(),
            }
        }

        fn increment_revision(revision: u32) -> Result<u32, Error<T>> {
            revision
                .checked_add(1)
                .ok_or(Error::<T>::ArithmeticOverflow)
        }

        fn store_or_settle(
            owner: &T::AccountId,
            active: ActiveGameOf<T>,
            report: AdvanceReport,
        ) -> DispatchResult {
            match report.status {
                AdvanceStatus::Finished(reason) => Self::settle_completed(owner, active, reason),
                AdvanceStatus::Pending | AdvanceStatus::Ready => {
                    Games::<T>::insert(owner, GameSlot::Active(active));
                    Ok(())
                }
            }
        }

        fn settle_completed(
            owner: &T::AccountId,
            active: ActiveGameOf<T>,
            finish_reason: FinishReason,
        ) -> DispatchResult {
            let Some(reward) = T::RewardPolicy::reward(active.stake, active.game.score) else {
                return Self::settle_fault(owner, active, FaultReason::RewardCalculation);
            };
            if reward > T::MaxReward::get() {
                return Self::settle_fault(owner, active, FaultReason::RewardAboveLimit);
            }
            if !reward.is_zero() && T::RewardCurrency::mint_into(owner, reward).is_err() {
                return Self::settle_fault(owner, active, FaultReason::RewardMintFailed);
            }
            Self::consume_escrow(active.stake)?;
            Self::cleanup_session(&active.session);
            Games::<T>::remove(owner);
            LastResults::<T>::insert(
                owner,
                GameResult {
                    game_id: active.game_id,
                    outcome: GameOutcome::Completed(finish_reason),
                    score: active.game.score,
                    high_combo: active.game.high_combo,
                    moves: active.game.move_count,
                    stake: active.stake,
                    reward,
                    ended_at: frame_system::Pallet::<T>::block_number(),
                },
            );
            Self::deposit_event(Event::GameCompleted {
                owner: owner.clone(),
                game_id: active.game_id,
                reason: finish_reason,
                score: active.game.score,
                stake: active.stake,
                reward,
            });
            Ok(())
        }

        fn handle_engine_fault(
            owner: &T::AccountId,
            active: ActiveGameOf<T>,
            error: EngineError,
        ) -> DispatchResult {
            let reason = Self::fault_reason(error).ok_or(Self::engine_dispatch_error(error))?;
            Self::settle_fault(owner, active, reason)
        }

        fn settle_fault(
            owner: &T::AccountId,
            active: ActiveGameOf<T>,
            reason: FaultReason,
        ) -> DispatchResult {
            T::StakeCurrency::transfer(
                &Self::pot_account(),
                owner,
                active.stake,
                Preservation::Expendable,
            )?;
            Self::consume_escrow(active.stake)?;
            Self::cleanup_session(&active.session);
            Games::<T>::remove(owner);
            LastResults::<T>::insert(
                owner,
                GameResult {
                    game_id: active.game_id,
                    outcome: GameOutcome::Faulted(reason),
                    score: active.game.score,
                    high_combo: active.game.high_combo,
                    moves: active.game.move_count,
                    stake: active.stake,
                    reward: Zero::zero(),
                    ended_at: frame_system::Pallet::<T>::block_number(),
                },
            );
            Self::deposit_event(Event::GameFaulted {
                owner: owner.clone(),
                game_id: active.game_id,
                reason,
                refunded: active.stake,
            });
            Ok(())
        }

        fn consume_escrow(stake: BalanceOf<T>) -> Result<(), Error<T>> {
            TotalEscrowed::<T>::try_mutate(|total| {
                *total = total
                    .checked_sub(&stake)
                    .ok_or(Error::<T>::EscrowInvariant)?;
                Ok::<_, Error<T>>(())
            })
        }

        fn cleanup_session(session: &T::AccountId) {
            SessionOwners::<T>::remove(session);
            frame_system::Pallet::<T>::dec_sufficients(session);
        }

        fn fault_reason(error: EngineError) -> Option<FaultReason> {
            match error {
                EngineError::ArithmeticOverflow => Some(FaultReason::ArithmeticOverflow),
                EngineError::BoardInvariant => Some(FaultReason::BoardInvariant),
                EngineError::TransitionLimitReached => Some(FaultReason::TransitionLimit),
                EngineError::InvalidCard
                | EngineError::MoveLimitReached
                | EngineError::NoEnergy
                | EngineError::WrongPhase
                | EngineError::ZeroStepBudget => None,
            }
        }

        fn engine_dispatch_error(error: EngineError) -> Error<T> {
            match error {
                EngineError::ArithmeticOverflow => Error::<T>::ArithmeticOverflow,
                EngineError::BoardInvariant => Error::<T>::UnexpectedPhase,
                EngineError::InvalidCard => Error::<T>::InvalidCard,
                EngineError::MoveLimitReached => Error::<T>::MoveLimitReached,
                EngineError::NoEnergy => Error::<T>::NoEnergy,
                EngineError::TransitionLimitReached => Error::<T>::UnexpectedPhase,
                EngineError::WrongPhase => Error::<T>::UnexpectedPhase,
                EngineError::ZeroStepBudget => Error::<T>::StepBudgetZero,
            }
        }
    }
}
