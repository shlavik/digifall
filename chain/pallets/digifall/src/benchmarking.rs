use super::*;
use frame::prelude::*;
use polkadot_sdk::{
    frame_benchmarking::{account, v2::*, whitelisted_caller},
    frame_support::{
        assert_ok,
        traits::fungible::{Inspect, Mutate},
    },
    frame_system::RawOrigin,
    sp_runtime::traits::Saturating,
};

const SEED: u32 = 7;

fn prefill_reveal_queue<T: Config>() {
    let reveal_at =
        frame_system::Pallet::<T>::block_number().saturating_add(T::RandomnessDelay::get());
    let mut requests = BoundedVec::<RevealRequest<T::AccountId>, T::MaxRevealsPerBlock>::default();
    for index in 0..T::MaxRevealsPerBlock::get().saturating_sub(1) {
        requests
            .try_push(RevealRequest {
                owner: account("queued-owner", index, SEED),
                game_id: u64::from(index).saturating_add(2),
            })
            .expect("prefill remains below the configured queue bound");
    }
    ScheduledReveals::<T>::insert(reveal_at, requests);
}

fn pending_game<T: Config>() -> (T::AccountId, T::AccountId, BalanceOf<T>) {
    let owner: T::AccountId = whitelisted_caller();
    let session: T::AccountId = account("session", 0, SEED);
    let stake = CurrentStakeBounds::<T>::get().min;
    let funding = stake.saturating_add(T::StakeCurrency::minimum_balance());
    assert_ok!(T::StakeCurrency::mint_into(&owner, funding));
    assert_ok!(Pallet::<T>::commit_game(
        RawOrigin::Signed(owner.clone()).into(),
        session.clone(),
        stake,
    ));
    (owner, session, stake)
}

fn maximize_reveal_scan<T: Config>(owner: &T::AccountId) {
    let Some(GameSlot::Pending(pending)) = Games::<T>::get(owner) else {
        panic!("benchmark setup committed a pending game")
    };
    ScheduledReveals::<T>::mutate(pending.reveal_at, |requests| {
        let target = requests.pop().expect("commit scheduled the target reveal");
        for index in 0..T::MaxRevealsPerBlock::get().saturating_sub(1) {
            requests
                .try_push(RevealRequest {
                    owner: account("queued-owner", index, SEED),
                    game_id: u64::from(index).saturating_add(2),
                })
                .expect("queue remains within its configured bound");
        }
        requests
            .try_push(target)
            .expect("target occupies the final bounded queue position");
    });
}

fn rules_limits<T: Config>() -> RulesLimits {
    RulesLimits {
        max_moves: T::MaxMoves::get(),
        max_transitions: T::MaxTransitions::get(),
    }
}

fn ready_game<T: Config>() -> (T::AccountId, T::AccountId, ActiveGameOf<T>) {
    let (owner, session, _) = pending_game::<T>();
    Games::<T>::mutate(&owner, |slot| {
        let Some(GameSlot::Pending(pending)) = slot else {
            panic!("benchmark setup committed a pending game")
        };
        pending.seed = SeedStatus::Ready(7);
    });
    assert_ok!(Pallet::<T>::activate_game(
        RawOrigin::Signed(session.clone()).into(),
        owner.clone(),
        1,
        0,
        T::MaxStepsPerCall::get(),
    ));
    let Some(GameSlot::Active(active)) = Games::<T>::get(&owner) else {
        panic!("benchmark seed must activate into a resumable game")
    };
    (owner, session, active)
}

fn maximize_matched_board(game: &mut Game) {
    for index in 0..BOARD_SIZE {
        let column = index / ROWS;
        let row = game.board[index].y as usize;
        game.board[index].value = match (column < 3, row < 3) {
            (true, true) | (false, false) => 9,
            (false, true) if column == 3 && row == 0 => 1,
            (false, true) => 8,
            (true, false) if row == 3 && column < 2 => 2,
            (true, false) => 7,
        };
    }
    assert_eq!(
        game.matches()
            .expect("constructed benchmark board is valid")
            .mask
            .count_ones(),
        BOARD_SIZE as u32,
    );
}

fn maximize_match_groups(game: &mut Game) {
    for index in 0..BOARD_SIZE {
        let column = index / ROWS;
        let row = game.board[index].y as usize;
        game.board[index].value = if (column + row).is_multiple_of(2) {
            1
        } else {
            0
        };
    }
    let matches = game
        .matches()
        .expect("constructed benchmark board is valid");
    assert_eq!(matches.groups, (BOARD_SIZE / 2) as u32);
}

fn settlement_play_game<T: Config>() -> (T::AccountId, T::AccountId, ActiveGameOf<T>, u8) {
    let (owner, session, mut active) = ready_game::<T>();
    active.game.energy = MOVE_COST;
    let card_index = (0..BOARD_SIZE as u8)
        .find(|card_index| {
            let mut trial = active.game.clone();
            trial
                .play(*card_index, T::MaxStepsPerCall::get(), rules_limits::<T>())
                .is_ok_and(|report| matches!(report.status, AdvanceStatus::Finished(_)))
        })
        .expect("a stabilized board has a non-matching terminal move");
    T::BenchmarkHelper::prepare_reward_asset(&owner);
    Games::<T>::insert(&owner, GameSlot::Active(active.clone()));
    (owner, session, active, card_index)
}

#[benchmarks]
mod benchmarks {
    use super::*;

    #[benchmark]
    fn check_nonce_for_feeless() {
        let (owner, session, active) = ready_game::<T>();
        let origin = RawOrigin::Signed(session).into();

        #[block]
        {
            assert!(Pallet::<T>::is_feeless_play(
                &origin,
                &owner,
                active.game_id,
                active.revision,
                0,
                T::MaxStepsPerCall::get(),
            ));
        }
    }

    #[benchmark]
    fn on_initialize(r: Linear<1, { T::MaxRevealsPerBlock::get() }>) {
        let now: BlockNumberFor<T> = 100u32.into();
        frame_system::Pallet::<T>::set_block_number(now);
        let mut requests =
            BoundedVec::<RevealRequest<T::AccountId>, T::MaxRevealsPerBlock>::default();
        for index in 0..r {
            let owner: T::AccountId = account("reveal-owner", index, SEED);
            let session: T::AccountId = account("reveal-session", index, SEED);
            Games::<T>::insert(
                &owner,
                GameSlot::Pending(PendingGame {
                    game_id: 1,
                    session,
                    stake: CurrentStakeBounds::<T>::get().min,
                    committed_at: 1u32.into(),
                    reveal_at: now,
                    seed: SeedStatus::Awaiting,
                    revision: 0,
                }),
            );
            requests
                .try_push(RevealRequest { owner, game_id: 1 })
                .expect("benchmark component stays within reveal bound");
        }
        ScheduledReveals::<T>::insert(now, requests);

        #[block]
        {
            Pallet::<T>::on_initialize(now);
        }

        assert!(!ScheduledReveals::<T>::contains_key(now));
    }

    #[benchmark]
    fn commit_game() {
        let owner: T::AccountId = whitelisted_caller();
        let session: T::AccountId = account("session", 0, SEED);
        let stake = CurrentStakeBounds::<T>::get().min;
        let funding = stake.saturating_add(T::StakeCurrency::minimum_balance());
        assert_ok!(T::StakeCurrency::mint_into(&owner, funding));
        prefill_reveal_queue::<T>();

        #[extrinsic_call]
        _(RawOrigin::Signed(owner), session, stake);
    }

    #[benchmark]
    fn activate_game(s: Linear<1, { T::MaxStepsPerCall::get() }>) {
        let (owner, session, _) = pending_game::<T>();
        Games::<T>::mutate(&owner, |slot| {
            let Some(GameSlot::Pending(pending)) = slot else {
                panic!("benchmark setup committed a pending game")
            };
            pending.seed = SeedStatus::Ready(7);
        });

        #[extrinsic_call]
        _(RawOrigin::Signed(session), owner, 1, 0, s);
    }

    #[benchmark]
    fn resolution_step() {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.phase = Phase::Resolving { depth: 1, combo: 0 };
        maximize_matched_board(&mut active.game);
        let game_id = active.game_id;
        let revision = active.revision;
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        advance(
            RawOrigin::Signed(session),
            owner.clone(),
            game_id,
            revision,
            1,
        );

        assert!(matches!(
            Games::<T>::get(owner),
            Some(GameSlot::Active(ActiveGame {
                game: Game {
                    phase: Phase::Resolving { .. },
                    ..
                },
                ..
            }))
        ));
    }

    #[benchmark]
    fn resolution_step_groups() {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.phase = Phase::Resolving { depth: 1, combo: 0 };
        maximize_match_groups(&mut active.game);
        let game_id = active.game_id;
        let revision = active.revision;
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        advance(
            RawOrigin::Signed(session),
            owner.clone(),
            game_id,
            revision,
            1,
        );

        assert!(matches!(
            Games::<T>::get(owner),
            Some(GameSlot::Active(ActiveGame {
                game: Game {
                    phase: Phase::Resolving { .. },
                    ..
                },
                ..
            }))
        ));
    }

    #[benchmark]
    fn play(s: Linear<1, { T::MaxStepsPerCall::get() }>) {
        let (owner, session, active) = ready_game::<T>();

        #[extrinsic_call]
        _(
            RawOrigin::Signed(session),
            owner,
            active.game_id,
            active.revision,
            0,
            s,
        );
    }

    #[benchmark]
    fn play_settlement() {
        let (owner, session, active, card_index) = settlement_play_game::<T>();

        #[extrinsic_call]
        play(
            RawOrigin::Signed(session),
            owner.clone(),
            active.game_id,
            active.revision,
            card_index,
            T::MaxStepsPerCall::get(),
        );

        assert!(matches!(
            LastResults::<T>::get(owner).map(|result| result.outcome),
            Some(GameOutcome::Completed(_))
        ));
    }

    #[benchmark]
    fn play_fault() {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.board[0].y = active.game.board[1].y;
        let game_id = active.game_id;
        let revision = active.revision;
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        play(
            RawOrigin::Signed(session),
            owner.clone(),
            game_id,
            revision,
            0,
            T::MaxStepsPerCall::get(),
        );

        assert!(matches!(
            LastResults::<T>::get(owner).map(|result| result.outcome),
            Some(GameOutcome::Faulted(FaultReason::BoardInvariant))
        ));
    }

    #[benchmark]
    fn advance(s: Linear<1, { T::MaxStepsPerCall::get() }>) {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.phase = Phase::Preparing;
        let game_id = active.game_id;
        let revision = active.revision;
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        _(RawOrigin::Signed(session), owner, game_id, revision, s);
    }

    #[benchmark]
    fn advance_settlement() {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.energy = 0;
        active.game.phase = Phase::Resolving { depth: 1, combo: 0 };
        let game_id = active.game_id;
        let revision = active.revision;
        T::BenchmarkHelper::prepare_reward_asset(&owner);
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        advance(
            RawOrigin::Signed(session),
            owner.clone(),
            game_id,
            revision,
            T::MaxStepsPerCall::get(),
        );

        assert!(matches!(
            LastResults::<T>::get(owner).map(|result| result.outcome),
            Some(GameOutcome::Completed(_))
        ));
    }

    #[benchmark]
    fn advance_fault() {
        let (owner, session, mut active) = ready_game::<T>();
        active.game.phase = Phase::Resolving { depth: 1, combo: 0 };
        active.game.board[0].y = active.game.board[1].y;
        let game_id = active.game_id;
        let revision = active.revision;
        Games::<T>::insert(&owner, GameSlot::Active(active));

        #[extrinsic_call]
        advance(
            RawOrigin::Signed(session),
            owner.clone(),
            game_id,
            revision,
            T::MaxStepsPerCall::get(),
        );

        assert!(matches!(
            LastResults::<T>::get(owner).map(|result| result.outcome),
            Some(GameOutcome::Faulted(FaultReason::BoardInvariant))
        ));
    }

    #[benchmark]
    fn rotate_session() {
        let (owner, _, active) = ready_game::<T>();
        let new_session: T::AccountId = account("new-session", 0, SEED);

        #[extrinsic_call]
        _(RawOrigin::Signed(owner), active.revision, new_session);
    }

    #[benchmark]
    fn forfeit() {
        let (owner, _, _) = pending_game::<T>();
        maximize_reveal_scan::<T>(&owner);

        #[extrinsic_call]
        _(RawOrigin::Signed(owner), 0);
    }

    #[benchmark]
    fn cancel_pending() {
        let (owner, _, _) = pending_game::<T>();
        maximize_reveal_scan::<T>(&owner);
        Games::<T>::mutate(&owner, |slot| {
            let Some(GameSlot::Pending(pending)) = slot else {
                panic!("benchmark setup committed a pending game")
            };
            pending.seed = SeedStatus::Unavailable;
        });

        #[extrinsic_call]
        _(RawOrigin::Signed(owner), 0);
    }

    #[benchmark]
    fn set_stake_bounds() {
        let bounds = CurrentStakeBounds::<T>::get();

        #[extrinsic_call]
        _(RawOrigin::Root, bounds.min, bounds.max);
    }

    impl_benchmark_test_suite!(Pallet, crate::mock::new_test_ext(true), crate::mock::Test);
}
