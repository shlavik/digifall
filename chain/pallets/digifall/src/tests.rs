use crate::{
    Error, FaultReason, GameOutcome, GameSlot, Games, LastResults, Phase, SeedStatus,
    SessionOwners, TotalEscrowed, mock::*,
};
use codec::Encode;
use frame::prelude::*;
use polkadot_sdk::{
    frame_support::{
        assert_noop, assert_ok,
        dispatch::{CheckIfFeeless, GetDispatchInfo},
    },
    pallet_skip_feeless_payment::SkipCheckIfFeeless,
    pallet_transaction_payment::ChargeTransactionPayment,
    sp_runtime::{
        traits::DispatchTransaction,
        transaction_validity::{InvalidTransaction, TransactionSource, TransactionValidityError},
    },
};

type SessionExtensions = (
    crate::CheckNonceForDigifall<Test>,
    SkipCheckIfFeeless<Test, ChargeTransactionPayment<Test>>,
);

fn session_extensions(nonce: u32) -> SessionExtensions {
    (
        crate::CheckNonceForDigifall::<Test>::from_nonce(nonce),
        SkipCheckIfFeeless::from(ChargeTransactionPayment::<Test>::from(0)),
    )
}

fn finish_game(owner: AccountId, session: AccountId) {
    for _ in 0..64 {
        let Some(GameSlot::Active(active)) = Games::<Test>::get(owner) else {
            return;
        };
        let revision = active.revision;
        match active.game.phase {
            Phase::Ready => {
                let card_index = (active.game.move_count as usize % crate::BOARD_SIZE) as u8;
                assert_ok!(Digifall::play(
                    RuntimeOrigin::signed(session),
                    owner,
                    active.game_id,
                    revision,
                    card_index,
                    MaxStepsPerCall::get(),
                ));
            }
            Phase::Preparing | Phase::Resolving { .. } => {
                assert_ok!(Digifall::advance(
                    RuntimeOrigin::signed(session),
                    owner,
                    active.game_id,
                    revision,
                    MaxStepsPerCall::get(),
                ));
            }
            Phase::Finished => panic!("finished games must settle atomically"),
        }
    }
    panic!("game did not finish within the test call bound");
}

#[test]
fn commitment_enforces_bounds_and_custodies_stake() {
    new_test_ext(true).execute_with(|| {
        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(OWNER), SESSION, 99),
            Error::<Test>::StakeBelowMinimum
        );
        assert_eq!(crate::NextGameIds::<Test>::get(OWNER), 0);

        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        assert_eq!(Balances::free_balance(OWNER), 9_900);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 100);
        assert_eq!(TotalEscrowed::<Test>::get(), 100);
        assert_eq!(SessionOwners::<Test>::get(SESSION), Some(OWNER));
        assert_eq!(System::account(SESSION).sufficients, 1);
        assert!(matches!(
            Games::<Test>::get(OWNER),
            Some(GameSlot::Pending(_))
        ));

        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(OWNER), OTHER_SESSION, 100),
            Error::<Test>::AlreadyPlaying
        );
        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(OTHER_OWNER), SESSION, 100),
            Error::<Test>::SessionInUse
        );
        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(OTHER_OWNER), OTHER_SESSION, 99_999),
            Error::<Test>::StakeAboveMaximum
        );
    });
}

#[test]
fn reveal_queue_is_bounded_and_failed_commit_rolls_back() {
    new_test_ext(true).execute_with(|| {
        for index in 0..MaxRevealsPerBlock::get() {
            let owner = 100 + u64::from(index);
            let session = 200 + u64::from(index);
            assert_ok!(Balances::force_set_balance(
                RuntimeOrigin::root(),
                owner,
                1_000
            ));
            assert_ok!(Digifall::commit_game(
                RuntimeOrigin::signed(owner),
                session,
                100
            ));
        }
        let rejected_owner = 999;
        let rejected_session = 1_999;
        assert_ok!(Balances::force_set_balance(
            RuntimeOrigin::root(),
            rejected_owner,
            1_000
        ));
        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(rejected_owner), rejected_session, 100),
            Error::<Test>::RevealQueueFull
        );
        assert_eq!(Balances::free_balance(rejected_owner), 1_000);
        assert_eq!(crate::NextGameIds::<Test>::get(rejected_owner), 0);
        assert_eq!(System::account(rejected_session).sufficients, 0);
        assert_eq!(crate::ScheduledReveals::<Test>::get(3).len(), 16);
    });
}

#[test]
fn activation_requires_post_commit_randomness_and_session_is_feeless() {
    new_test_ext(true).execute_with(|| {
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        let session_origin = RuntimeOrigin::signed(SESSION);
        assert!(!Digifall::is_feeless_activation(
            &session_origin,
            &OWNER,
            1,
            0,
            64
        ));
        assert_noop!(
            Digifall::activate_game(RuntimeOrigin::signed(SESSION), OWNER, 1, 0, 64),
            Error::<Test>::RandomnessNotReady
        );

        run_to_block(3);
        let stored_seed = match Games::<Test>::get(OWNER).unwrap() {
            GameSlot::Pending(game) => match game.seed {
                SeedStatus::Ready(seed) => seed,
                status => panic!("unexpected seed status: {status:?}"),
            },
            GameSlot::Active(_) => panic!("game activates only by dispatch"),
        };
        run_to_block(4);
        let seed_after_waiting = match Games::<Test>::get(OWNER).unwrap() {
            GameSlot::Pending(game) => match game.seed {
                SeedStatus::Ready(seed) => seed,
                status => panic!("unexpected seed status: {status:?}"),
            },
            GameSlot::Active(_) => panic!("game activates only by dispatch"),
        };
        assert_eq!(seed_after_waiting, stored_seed);
        assert!(Digifall::is_feeless_activation(
            &RuntimeOrigin::signed(SESSION),
            &OWNER,
            1,
            0,
            64
        ));
        assert!(!Digifall::is_feeless_activation(
            &RuntimeOrigin::signed(OWNER),
            &OWNER,
            1,
            0,
            64
        ));
        assert_ok!(Digifall::activate_game(
            RuntimeOrigin::signed(SESSION),
            OWNER,
            1,
            0,
            64
        ));
        assert_eq!(active_revision(OWNER), 1);
        assert_eq!(current_phase(OWNER), Phase::Ready);
    });
}

#[test]
fn authorization_revision_and_call_shape_gate_feeless_moves() {
    new_test_ext(true).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        let revision = active_revision(OWNER);
        assert!(Digifall::is_feeless_play(
            &RuntimeOrigin::signed(SESSION),
            &OWNER,
            1,
            revision,
            0,
            64
        ));
        let runtime_call = RuntimeCall::Digifall(crate::Call::play {
            owner: OWNER,
            game_id: 1,
            expected_revision: revision,
            card_index: 0,
            step_budget: 64,
        });
        assert!(runtime_call.is_feeless(&RuntimeOrigin::signed(SESSION)));
        assert!(!runtime_call.is_feeless(&RuntimeOrigin::signed(OWNER)));
        assert!(!Digifall::is_feeless_play(
            &RuntimeOrigin::signed(OWNER),
            &OWNER,
            1,
            revision,
            0,
            64
        ));
        assert!(!Digifall::is_feeless_play(
            &RuntimeOrigin::signed(SESSION),
            &OWNER,
            1,
            revision,
            crate::BOARD_SIZE as u8,
            64
        ));
        assert_noop!(
            Digifall::play(RuntimeOrigin::signed(ATTACKER), OWNER, 1, revision, 0, 64),
            Error::<Test>::NotController
        );
        assert_noop!(
            Digifall::play(RuntimeOrigin::signed(SESSION), OWNER, 1, 0, 0, 64),
            Error::<Test>::StaleRevision
        );
        assert_noop!(
            Digifall::play(
                RuntimeOrigin::signed(SESSION),
                OWNER,
                1,
                revision,
                crate::BOARD_SIZE as u8,
                64
            ),
            Error::<Test>::InvalidCard
        );
        assert_ok!(Digifall::play(
            RuntimeOrigin::signed(SESSION),
            OWNER,
            1,
            revision,
            0,
            64
        ));
        let GameSlot::Active(game) = Games::<Test>::get(OWNER).unwrap() else {
            panic!("game remains active after one move");
        };
        assert_eq!(game.revision, revision + 1);
        assert_eq!(game.game.energy, 90);
        assert_eq!(game.game.move_count, 1);
    });
}

#[test]
fn custom_nonce_extension_preserves_standard_nonce_encoding() {
    let custom = crate::CheckNonceForDigifall::<Test>::from_nonce(7);
    let standard = frame_system::CheckNonce::<Test>::from(7);
    assert_eq!(custom.encode(), standard.encode());
}

#[test]
fn runtime_extensions_admit_one_unfunded_move_and_reject_future_nonce_duplicates() {
    new_test_ext(true).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        assert_eq!(Balances::free_balance(SESSION), 0);
        assert_eq!(System::account(SESSION).nonce, 0);
        let revision = active_revision(OWNER);
        let call = RuntimeCall::Digifall(crate::Call::play {
            owner: OWNER,
            game_id: 1,
            expected_revision: revision,
            card_index: 0,
            step_budget: 64,
        });
        let info = call.get_dispatch_info();
        let (validity, _, _) = session_extensions(0)
            .validate_only(
                RuntimeOrigin::signed(SESSION),
                &call,
                &info,
                100,
                TransactionSource::External,
                0,
            )
            .expect("current fee-free nonce validates");
        assert_eq!(validity.priority, FeelessTransactionPriority::get());
        assert_eq!(validity.longevity, FeelessTransactionLongevity::get());
        assert!(validity.requires.is_empty());
        assert_eq!(validity.provides.len(), 1);

        let future_result = session_extensions(1).validate_only(
            RuntimeOrigin::signed(SESSION),
            &call,
            &info,
            100,
            TransactionSource::External,
            0,
        );
        match future_result {
            Err(error) => assert_eq!(
                error,
                TransactionValidityError::Invalid(InvalidTransaction::Future)
            ),
            Ok(_) => panic!("future nonce must not enter the pool"),
        }

        let paid_call = RuntimeCall::System(frame_system::Call::remark {
            remark: vec![0; 32],
        });
        let paid_info = paid_call.get_dispatch_info();
        let (paid_nonce_validity, _, _) = crate::CheckNonceForDigifall::<Test>::from_nonce(1)
            .validate_only(
                RuntimeOrigin::signed(OWNER),
                &paid_call,
                &paid_info,
                100,
                TransactionSource::External,
                0,
            )
            .expect("paid calls retain standard future-nonce dependencies");
        assert_eq!(paid_nonce_validity.requires.len(), 1);
        let paid_result = session_extensions(0).validate_only(
            RuntimeOrigin::signed(SESSION),
            &paid_call,
            &paid_info,
            100,
            TransactionSource::External,
            0,
        );
        match paid_result {
            Err(error) => assert_eq!(
                error,
                TransactionValidityError::Invalid(InvalidTransaction::Payment)
            ),
            Ok(_) => panic!("unfunded unrelated call must remain paid"),
        }

        let result = session_extensions(0).dispatch_transaction(
            RuntimeOrigin::signed(SESSION),
            call,
            &info,
            100,
            0,
        );
        assert!(matches!(result, Ok(Ok(_))));
        assert_eq!(Balances::free_balance(SESSION), 0);
        assert_eq!(System::account(SESSION).nonce, 1);
        assert_eq!(active_revision(OWNER), revision + 1);
        assert!(System::events().iter().any(|record| matches!(
            record.event,
            RuntimeEvent::SkipFeelessPayment(
                polkadot_sdk::pallet_skip_feeless_payment::Event::FeeSkipped { .. }
            )
        )));
    });
}

#[test]
fn game_id_prevents_replay_after_a_session_account_is_reaped_and_reused() {
    new_test_ext(true).execute_with(|| {
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        assert_ok!(Digifall::forfeit(RuntimeOrigin::signed(OWNER), 0));
        assert_eq!(System::account(SESSION).nonce, 0);
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        run_to_block(3);
        assert!(!Digifall::is_feeless_activation(
            &RuntimeOrigin::signed(SESSION),
            &OWNER,
            1,
            0,
            64
        ));
        assert_noop!(
            Digifall::activate_game(RuntimeOrigin::signed(SESSION), OWNER, 1, 0, 64),
            Error::<Test>::WrongGameId
        );
        assert_ok!(Digifall::activate_game(
            RuntimeOrigin::signed(SESSION),
            OWNER,
            2,
            0,
            64
        ));
        let revision = active_revision(OWNER);
        assert_noop!(
            Digifall::play(RuntimeOrigin::signed(SESSION), OWNER, 1, revision, 0, 64),
            Error::<Test>::WrongGameId
        );
    });
}

#[test]
fn bounded_preparation_requires_explicit_advance() {
    new_test_ext(true).execute_with(|| {
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        run_to_block(3);
        assert_ok!(Digifall::activate_game(
            RuntimeOrigin::signed(SESSION),
            OWNER,
            1,
            0,
            1
        ));
        assert_eq!(active_revision(OWNER), 1);
        assert_ne!(current_phase(OWNER), Phase::Finished);
        assert_noop!(
            Digifall::advance(RuntimeOrigin::signed(SESSION), OWNER, 1, 1, 0),
            Error::<Test>::StepBudgetZero
        );
        assert_noop!(
            Digifall::advance(RuntimeOrigin::signed(SESSION), OWNER, 1, 1, 65),
            Error::<Test>::StepBudgetTooLarge
        );

        while current_phase(OWNER) != Phase::Ready {
            let revision = active_revision(OWNER);
            assert!(Digifall::is_feeless_advance(
                &RuntimeOrigin::signed(SESSION),
                &OWNER,
                1,
                revision,
                1
            ));
            assert_ok!(Digifall::advance(
                RuntimeOrigin::signed(SESSION),
                OWNER,
                1,
                revision,
                1
            ));
        }
        assert!(active_revision(OWNER) > 1);
    });
}

#[test]
fn owner_can_rotate_session_without_reopening_replay_window() {
    new_test_ext(true).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        let revision = active_revision(OWNER);
        assert_ok!(Digifall::rotate_session(
            RuntimeOrigin::signed(OWNER),
            revision,
            OTHER_SESSION
        ));
        assert_eq!(SessionOwners::<Test>::get(SESSION), None);
        assert_eq!(SessionOwners::<Test>::get(OTHER_SESSION), Some(OWNER));
        assert_eq!(System::account(SESSION).sufficients, 0);
        assert_eq!(System::account(OTHER_SESSION).sufficients, 1);
        assert_eq!(active_revision(OWNER), revision + 1);
        assert_noop!(
            Digifall::play(
                RuntimeOrigin::signed(SESSION),
                OWNER,
                1,
                revision + 1,
                0,
                64
            ),
            Error::<Test>::NotController
        );
        assert!(Digifall::is_feeless_play(
            &RuntimeOrigin::signed(OTHER_SESSION),
            &OWNER,
            1,
            revision + 1,
            0,
            64
        ));
    });
}

#[test]
fn completion_consumes_stake_and_mints_separate_reward_asset() {
    new_test_ext(true).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        finish_game(OWNER, SESSION);

        assert!(!Games::<Test>::contains_key(OWNER));
        assert_eq!(SessionOwners::<Test>::get(SESSION), None);
        assert_eq!(System::account(SESSION).sufficients, 0);
        assert_eq!(TotalEscrowed::<Test>::get(), 0);
        assert_eq!(Balances::free_balance(OWNER), 9_900);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 100);
        let result = LastResults::<Test>::get(OWNER).unwrap();
        assert_eq!(
            result.outcome,
            GameOutcome::Completed(crate::FinishReason::EnergyDepleted)
        );
        assert_eq!(result.moves, 10);
        assert_eq!(result.reward, 10 + result.score as Balance);
        assert_eq!(reward_balance(OWNER), result.reward);
    });
}

#[test]
fn forfeit_consumes_stake_and_cleans_session_reference() {
    new_test_ext(true).execute_with(|| {
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        assert_ok!(Digifall::forfeit(RuntimeOrigin::signed(OWNER), 0));
        assert!(!Games::<Test>::contains_key(OWNER));
        assert_eq!(SessionOwners::<Test>::get(SESSION), None);
        assert_eq!(System::account(SESSION).sufficients, 0);
        assert_eq!(Balances::free_balance(OWNER), 9_900);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 100);
        assert_eq!(TotalEscrowed::<Test>::get(), 0);
        assert_eq!(
            LastResults::<Test>::get(OWNER).unwrap().outcome,
            GameOutcome::Forfeited
        );
        assert!(crate::ScheduledReveals::<Test>::get(3).is_empty());
    });
}

#[test]
fn sufficient_session_reference_cannot_be_blocked_by_consumers() {
    new_test_ext(true).execute_with(|| {
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        frame_system::Pallet::<Test>::inc_providers(&SESSION);
        assert_ok!(frame_system::Pallet::<Test>::inc_consumers(&SESSION));
        assert_eq!(System::account(SESSION).sufficients, 1);
        assert_eq!(System::account(SESSION).consumers, 1);

        assert_ok!(Digifall::forfeit(RuntimeOrigin::signed(OWNER), 0));
        let account = System::account(SESSION);
        assert_eq!(account.sufficients, 0);
        assert_eq!(account.providers, 1);
        assert_eq!(account.consumers, 1);

        frame_system::Pallet::<Test>::dec_consumers(&SESSION);
        assert_ok!(frame_system::Pallet::<Test>::dec_providers(&SESSION));
    });
}

#[test]
fn unavailable_scheduled_randomness_allows_full_refund() {
    new_test_ext(true).execute_with(|| {
        RandomnessFresh::set(false);
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            100
        ));
        assert_noop!(
            Digifall::cancel_pending(RuntimeOrigin::signed(OWNER), 0),
            Error::<Test>::CancellationNotAllowed
        );
        run_to_block(3);
        let GameSlot::Pending(pending) = Games::<Test>::get(OWNER).unwrap() else {
            panic!("game remains pending");
        };
        assert_eq!(pending.seed, SeedStatus::Unavailable);
        assert_noop!(
            Digifall::activate_game(RuntimeOrigin::signed(SESSION), OWNER, 1, 0, 64),
            Error::<Test>::RandomnessUnavailable
        );
        assert_ok!(Digifall::cancel_pending(RuntimeOrigin::signed(OWNER), 0));
        assert!(!Games::<Test>::contains_key(OWNER));
        assert_eq!(Balances::free_balance(OWNER), 10_000);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 0);
        assert_eq!(TotalEscrowed::<Test>::get(), 0);
        assert_eq!(System::account(SESSION).sufficients, 0);
        assert_eq!(
            LastResults::<Test>::get(OWNER).unwrap().outcome,
            GameOutcome::Cancelled
        );
    });
}

#[test]
fn engine_fault_refunds_stake_and_records_terminal_fault() {
    new_test_ext(true).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        Games::<Test>::mutate(OWNER, |slot| {
            let Some(GameSlot::Active(active)) = slot else {
                panic!("active game exists");
            };
            for card in &mut active.game.board {
                card.value = 0;
            }
            active.game.board[0].value = 1;
            active.game.phase = Phase::Resolving { depth: 1, combo: 0 };
            active.game.transition_count = MaxTransitions::get();
        });
        let revision = active_revision(OWNER);
        assert_ok!(Digifall::advance(
            RuntimeOrigin::signed(SESSION),
            OWNER,
            1,
            revision,
            1
        ));
        assert!(!Games::<Test>::contains_key(OWNER));
        assert_eq!(Balances::free_balance(OWNER), 10_000);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 0);
        assert_eq!(TotalEscrowed::<Test>::get(), 0);
        assert_eq!(
            LastResults::<Test>::get(OWNER).unwrap().outcome,
            GameOutcome::Faulted(FaultReason::TransitionLimit)
        );
    });
}

#[test]
fn failed_reward_mint_refunds_stake_instead_of_stranding_game() {
    new_test_ext(false).execute_with(|| {
        commit_and_activate(OWNER, SESSION, 100);
        finish_game(OWNER, SESSION);
        assert!(!Games::<Test>::contains_key(OWNER));
        assert_eq!(Balances::free_balance(OWNER), 10_000);
        assert_eq!(Balances::free_balance(Digifall::pot_account()), 0);
        assert_eq!(TotalEscrowed::<Test>::get(), 0);
        assert_eq!(
            LastResults::<Test>::get(OWNER).unwrap().outcome,
            GameOutcome::Faulted(FaultReason::RewardMintFailed)
        );
    });
}

#[test]
fn root_can_update_future_stake_bounds() {
    new_test_ext(true).execute_with(|| {
        assert_noop!(
            Digifall::set_stake_bounds(RuntimeOrigin::signed(OWNER), 10, 20),
            DispatchError::BadOrigin
        );
        assert_noop!(
            Digifall::set_stake_bounds(RuntimeOrigin::root(), 0, 20),
            Error::<Test>::InvalidStakeBounds
        );
        assert_noop!(
            Digifall::set_stake_bounds(RuntimeOrigin::root(), 30, 20),
            Error::<Test>::InvalidStakeBounds
        );
        assert_ok!(Digifall::set_stake_bounds(RuntimeOrigin::root(), 200, 300));
        assert_noop!(
            Digifall::commit_game(RuntimeOrigin::signed(OWNER), SESSION, 100),
            Error::<Test>::StakeBelowMinimum
        );
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(OWNER),
            SESSION,
            200
        ));
    });
}
