use frame::prelude::*;

pub trait WeightInfo {
    fn check_nonce_for_feeless() -> Weight;
    fn on_initialize(reveals: u32) -> Weight;
    fn commit_game() -> Weight;
    fn activate_game(steps: u32) -> Weight;
    fn resolution_step() -> Weight;
    fn resolution_step_groups() -> Weight;
    fn play(steps: u32) -> Weight;
    fn play_settlement() -> Weight;
    fn play_fault() -> Weight;
    fn advance(steps: u32) -> Weight;
    fn advance_settlement() -> Weight;
    fn advance_fault() -> Weight;
    fn rotate_session() -> Weight;
    fn forfeit() -> Weight;
    fn cancel_pending() -> Weight;
    fn set_stake_bounds() -> Weight;
}

/// Conservative development weights. Replace these with benchmark output before production use.
pub struct SubstrateWeight<T>(core::marker::PhantomData<T>);

impl<T: crate::Config> WeightInfo for SubstrateWeight<T> {
    fn check_nonce_for_feeless() -> Weight {
        // Covers the state-dependent predicate in this extension and in the payment wrapper.
        Weight::from_parts(15_000_000, 8_000).saturating_add(T::DbWeight::get().reads(4))
    }

    fn on_initialize(reveals: u32) -> Weight {
        Weight::from_parts(5_000_000, 1_000)
            .saturating_add(Weight::from_parts(20_000_000, 4_000).saturating_mul(reveals.into()))
            .saturating_add(T::DbWeight::get().reads_writes(
                u64::from(reveals).saturating_add(1),
                u64::from(reveals).saturating_add(1),
            ))
    }

    fn commit_game() -> Weight {
        Weight::from_parts(30_000_000, 8_000).saturating_add(T::DbWeight::get().reads_writes(4, 5))
    }

    fn activate_game(steps: u32) -> Weight {
        Weight::from_parts(45_000_000, 10_000)
            .saturating_add(Weight::from_parts(20_000_000, 1_000).saturating_mul(steps.into()))
            .saturating_add(T::DbWeight::get().reads_writes(4, 3))
    }

    fn resolution_step() -> Weight {
        // One full-board matching and replacement iteration, multiplied by the caller's budget.
        Weight::from_parts(25_000_000, 2_000).saturating_add(T::DbWeight::get().reads_writes(3, 3))
    }

    fn resolution_step_groups() -> Weight {
        // High-group-count matching iteration complements the full replacement benchmark.
        Weight::from_parts(25_000_000, 2_000).saturating_add(T::DbWeight::get().reads_writes(3, 3))
    }

    fn play(steps: u32) -> Weight {
        Weight::from_parts(20_000_000, 8_000)
            .saturating_add(Weight::from_parts(20_000_000, 1_000).saturating_mul(steps.into()))
            .saturating_add(T::DbWeight::get().reads_writes(3, 3))
    }

    fn play_settlement() -> Weight {
        Weight::from_parts(80_000_000, 16_000).saturating_add(T::DbWeight::get().reads_writes(7, 8))
    }

    fn play_fault() -> Weight {
        Weight::from_parts(75_000_000, 16_000).saturating_add(T::DbWeight::get().reads_writes(7, 8))
    }

    fn advance(steps: u32) -> Weight {
        Self::play(steps)
    }

    fn advance_settlement() -> Weight {
        Self::play_settlement()
    }

    fn advance_fault() -> Weight {
        Self::play_fault()
    }

    fn rotate_session() -> Weight {
        Weight::from_parts(25_000_000, 8_000).saturating_add(T::DbWeight::get().reads_writes(5, 6))
    }

    fn forfeit() -> Weight {
        Weight::from_parts(30_000_000, 10_000)
            .saturating_add(
                Weight::from_parts(250_000, 64).saturating_mul(T::MaxRevealsPerBlock::get().into()),
            )
            .saturating_add(T::DbWeight::get().reads_writes(6, 7))
    }

    fn cancel_pending() -> Weight {
        Weight::from_parts(35_000_000, 10_000)
            .saturating_add(
                Weight::from_parts(250_000, 64).saturating_mul(T::MaxRevealsPerBlock::get().into()),
            )
            .saturating_add(T::DbWeight::get().reads_writes(6, 7))
    }

    fn set_stake_bounds() -> Weight {
        Weight::from_parts(10_000_000, 1_000).saturating_add(T::DbWeight::get().writes(1))
    }
}

impl WeightInfo for () {
    fn check_nonce_for_feeless() -> Weight {
        Weight::zero()
    }

    fn on_initialize(_reveals: u32) -> Weight {
        Weight::zero()
    }

    fn commit_game() -> Weight {
        Weight::zero()
    }

    fn activate_game(_steps: u32) -> Weight {
        Weight::zero()
    }

    fn resolution_step() -> Weight {
        Weight::zero()
    }

    fn resolution_step_groups() -> Weight {
        Weight::zero()
    }

    fn play(_steps: u32) -> Weight {
        Weight::zero()
    }

    fn play_settlement() -> Weight {
        Weight::zero()
    }

    fn play_fault() -> Weight {
        Weight::zero()
    }

    fn advance(_steps: u32) -> Weight {
        Weight::zero()
    }

    fn advance_settlement() -> Weight {
        Weight::zero()
    }

    fn advance_fault() -> Weight {
        Weight::zero()
    }

    fn rotate_session() -> Weight {
        Weight::zero()
    }

    fn forfeit() -> Weight {
        Weight::zero()
    }

    fn cancel_pending() -> Weight {
        Weight::zero()
    }

    fn set_stake_bounds() -> Weight {
        Weight::zero()
    }
}
