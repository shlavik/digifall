use crate as pallet_digifall;
use crate::{RewardPolicy, pallet::BalanceOf};
use frame::prelude::*;
use polkadot_sdk::{
    frame_support::{
        PalletId, assert_ok, construct_runtime, derive_impl, parameter_types,
        traits::{AsEnsureOriginWithArg, Randomness, fungible::ItemOf},
    },
    pallet_assets, pallet_balances, pallet_skip_feeless_payment, pallet_transaction_payment,
    sp_io::TestExternalities,
    sp_runtime::{BuildStorage, traits::Hash as HashT},
    sp_weights::IdentityFee,
};

pub type AccountId = u64;
pub type Balance = u64;
pub type AssetId = u32;
pub type Block = frame_system::mocking::MockBlock<Test>;

pub const OWNER: AccountId = 1;
pub const OTHER_OWNER: AccountId = 2;
pub const SESSION: AccountId = 10;
pub const OTHER_SESSION: AccountId = 11;
pub const ATTACKER: AccountId = 12;
pub const REWARD_ASSET_ID: AssetId = 7;

construct_runtime!(
    pub enum Test {
        System: frame_system,
        Balances: pallet_balances,
        Assets: pallet_assets,
        TransactionPayment: pallet_transaction_payment,
        SkipFeelessPayment: pallet_skip_feeless_payment,
        Digifall: pallet_digifall,
    }
);

#[derive_impl(frame_system::config_preludes::TestDefaultConfig)]
impl frame_system::Config for Test {
    type Block = Block;
    type AccountData = pallet_balances::AccountData<Balance>;
}

#[derive_impl(pallet_balances::config_preludes::TestDefaultConfig)]
impl pallet_balances::Config for Test {
    type AccountStore = System;
}

#[derive_impl(pallet_assets::config_preludes::TestDefaultConfig)]
impl pallet_assets::Config for Test {
    type Currency = Balances;
    type CreateOrigin = AsEnsureOriginWithArg<frame_system::EnsureSigned<AccountId>>;
    type ForceOrigin = frame_system::EnsureRoot<AccountId>;
}

#[derive_impl(pallet_transaction_payment::config_preludes::TestDefaultConfig)]
impl pallet_transaction_payment::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type OnChargeTransaction = pallet_transaction_payment::FungibleAdapter<Balances, ()>;
    type WeightToFee = IdentityFee<Balance>;
    type LengthToFee = IdentityFee<Balance>;
}

impl pallet_skip_feeless_payment::Config for Test {
    type RuntimeEvent = RuntimeEvent;
}

parameter_types! {
    pub const RewardAssetId: AssetId = REWARD_ASSET_ID;
    pub const DigifallPalletId: PalletId = PalletId(*b"dg/fall!");
    pub const DefaultMinStake: Balance = 100;
    pub const DefaultMaxStake: Balance = 1_000;
    pub const MaxReward: Balance = 10_000;
    pub const MaxMoves: u32 = 40_000;
    pub const MaxTransitions: u32 = 1_000;
    pub const MaxStepsPerCall: u32 = 64;
    pub const RandomnessDelay: u64 = 2;
    pub const MaxRevealsPerBlock: u32 = 16;
    pub const FeelessTransactionPriority: u64 = 1_000_000;
    pub const FeelessTransactionLongevity: u64 = 1;
    pub static RandomnessFresh: bool = true;
}

pub type RewardToken = ItemOf<Assets, RewardAssetId, AccountId>;

pub struct TestRandomness;
impl Randomness<<Test as frame_system::Config>::Hash, BlockNumberFor<Test>> for TestRandomness {
    fn random(subject: &[u8]) -> (<Test as frame_system::Config>::Hash, BlockNumberFor<Test>) {
        let block_number = System::block_number();
        let known_since = if RandomnessFresh::get() {
            block_number.saturating_sub(1)
        } else {
            0
        };
        (
            <Test as frame_system::Config>::Hashing::hash_of(&(subject, block_number)),
            known_since,
        )
    }
}

pub struct TestRewardPolicy;
impl RewardPolicy<Balance> for TestRewardPolicy {
    fn reward(stake: Balance, score: u128) -> Option<Balance> {
        let score = Balance::try_from(score).ok()?;
        stake.checked_div(10)?.checked_add(score)
    }
}

#[cfg(feature = "runtime-benchmarks")]
pub struct TestBenchmarkHelper;
#[cfg(feature = "runtime-benchmarks")]
impl crate::BenchmarkHelper<AccountId> for TestBenchmarkHelper {
    fn prepare_reward_asset(_owner: &AccountId) {
        assert!(pallet_assets::Asset::<Test>::contains_key(REWARD_ASSET_ID));
    }
}

impl pallet_digifall::Config for Test {
    type RuntimeEvent = RuntimeEvent;
    type StakeCurrency = Balances;
    type RewardCurrency = RewardToken;
    type GameRandomness = TestRandomness;
    type RewardPolicy = TestRewardPolicy;
    #[cfg(feature = "runtime-benchmarks")]
    type BenchmarkHelper = TestBenchmarkHelper;
    type PalletId = DigifallPalletId;
    type DefaultMinStake = DefaultMinStake;
    type DefaultMaxStake = DefaultMaxStake;
    type MaxReward = MaxReward;
    type MaxMoves = MaxMoves;
    type MaxTransitions = MaxTransitions;
    type MaxStepsPerCall = MaxStepsPerCall;
    type RandomnessDelay = RandomnessDelay;
    type MaxRevealsPerBlock = MaxRevealsPerBlock;
    type FeelessTransactionPriority = FeelessTransactionPriority;
    type FeelessTransactionLongevity = FeelessTransactionLongevity;
    type WeightInfo = ();
}

pub fn new_test_ext(create_reward_asset: bool) -> TestExternalities {
    let mut storage = frame_system::GenesisConfig::<Test>::default()
        .build_storage()
        .expect("system genesis builds");
    pallet_balances::GenesisConfig::<Test> {
        balances: vec![(OWNER, 10_000), (OTHER_OWNER, 10_000)],
        dev_accounts: None,
    }
    .assimilate_storage(&mut storage)
    .expect("balances genesis assimilates");
    let mut ext: TestExternalities = storage.into();
    ext.execute_with(|| {
        RandomnessFresh::set(true);
        System::set_block_number(1);
        if create_reward_asset {
            assert_ok!(Assets::force_create(
                RuntimeOrigin::root(),
                REWARD_ASSET_ID,
                OWNER,
                true,
                1,
            ));
        }
    });
    ext
}

pub fn run_to_block(target: u64) {
    while System::block_number() < target {
        let current = System::block_number();
        Digifall::on_finalize(current);
        System::on_finalize(current);
        System::set_block_number(current + 1);
        System::on_initialize(current + 1);
        Digifall::on_initialize(current + 1);
    }
}

pub fn commit_and_activate(owner: AccountId, session: AccountId, stake: Balance) {
    assert_ok!(Digifall::commit_game(
        RuntimeOrigin::signed(owner),
        session,
        stake
    ));
    run_to_block(System::block_number() + RandomnessDelay::get());
    assert_ok!(Digifall::activate_game(
        RuntimeOrigin::signed(session),
        owner,
        1,
        0,
        MaxStepsPerCall::get(),
    ));
}

pub fn active_revision(owner: AccountId) -> u32 {
    match crate::Games::<Test>::get(owner).expect("game exists") {
        crate::GameSlot::Pending(_) => panic!("game is pending"),
        crate::GameSlot::Active(game) => game.revision,
    }
}

pub fn current_phase(owner: AccountId) -> crate::Phase {
    match crate::Games::<Test>::get(owner).expect("game exists") {
        crate::GameSlot::Pending(_) => panic!("game is pending"),
        crate::GameSlot::Active(game) => game.game.phase,
    }
}

pub fn reward_balance(owner: AccountId) -> BalanceOf<Test> {
    Assets::balance(REWARD_ASSET_ID, owner)
}
