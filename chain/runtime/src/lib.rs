#![cfg_attr(not(feature = "std"), no_std)]
#![recursion_limit = "256"]

extern crate alloc;

mod weights;

use alloc::vec::Vec;

#[cfg(feature = "std")]
include!(concat!(env!("OUT_DIR"), "/wasm_binary.rs"));

use polkadot_sdk::{
    cumulus_pallet_parachain_system,
    cumulus_primitives_core::ParaId,
    frame_executive,
    frame_support::{
        self, PalletId, derive_impl, parameter_types,
        traits::{AsEnsureOriginWithArg, ConstU8, ConstU32, VariantCountOf, fungible::ItemOf},
        weights::{Weight, constants::RocksDbWeight},
    },
    frame_system, pallet_assets, pallet_balances, pallet_insecure_randomness_collective_flip,
    pallet_skip_feeless_payment, pallet_transaction_payment,
    sp_runtime::{AccountId32, MultiAddress, MultiSignature, generic, traits::BlakeTwo256},
    sp_version::{ApiId, RuntimeVersion, runtime_version},
    sp_weights::IdentityFee,
};

pub type AccountId = AccountId32;
pub type Address = MultiAddress<AccountId, ()>;
pub type AssetId = u32;
pub type Balance = u128;
pub type BlockNumber = u32;
pub type Hash = polkadot_sdk::sp_core::H256;
pub type Nonce = u32;
pub type Signature = MultiSignature;
pub type Header = generic::Header<BlockNumber, BlakeTwo256>;
pub type Block = generic::Block<Header, UncheckedExtrinsic>;

#[cfg(feature = "runtime-benchmarks")]
const RUNTIME_APIS: alloc::borrow::Cow<'static, [(ApiId, u32)]> =
    benchmark_apis::RUNTIME_API_VERSIONS;
#[cfg(not(feature = "runtime-benchmarks"))]
const RUNTIME_APIS: alloc::borrow::Cow<'static, [(ApiId, u32)]> =
    polkadot_sdk::sp_version::create_apis_vec!([]);

#[runtime_version]
pub const VERSION: RuntimeVersion = RuntimeVersion {
    spec_name: alloc::borrow::Cow::Borrowed("digifall-template-runtime"),
    impl_name: alloc::borrow::Cow::Borrowed("digifall-template-runtime"),
    authoring_version: 1,
    spec_version: 1,
    impl_version: 0,
    apis: RUNTIME_APIS,
    transaction_version: 1,
    system_version: 1,
};

/// Template transaction pipeline. The custom nonce extension replaces standard `CheckNonce`, and
/// the payment extension is skipped only for calls whose runtime fee predicate currently passes.
pub type TxExtension = (
    frame_system::AuthorizeCall<Runtime>,
    frame_system::CheckNonZeroSender<Runtime>,
    frame_system::CheckSpecVersion<Runtime>,
    frame_system::CheckTxVersion<Runtime>,
    frame_system::CheckGenesis<Runtime>,
    frame_system::CheckEra<Runtime>,
    pallet_digifall::CheckNonceForDigifall<Runtime>,
    frame_system::CheckWeight<Runtime>,
    pallet_skip_feeless_payment::SkipCheckIfFeeless<
        Runtime,
        pallet_transaction_payment::ChargeTransactionPayment<Runtime>,
    >,
);

pub type UncheckedExtrinsic =
    generic::UncheckedExtrinsic<Address, RuntimeCall, Signature, TxExtension>;

pub type Executive = frame_executive::Executive<
    Runtime,
    Block,
    frame_system::ChainContext<Runtime>,
    Runtime,
    AllPalletsWithSystem,
>;

#[frame_support::runtime]
mod runtime {
    #[runtime::runtime]
    #[runtime::derive(
        RuntimeCall,
        RuntimeEvent,
        RuntimeError,
        RuntimeOrigin,
        RuntimeFreezeReason,
        RuntimeHoldReason,
        RuntimeSlashReason,
        RuntimeLockId,
        RuntimeTask,
        RuntimeViewFunction
    )]
    pub struct Runtime;

    #[runtime::pallet_index(0)]
    pub type System = frame_system;
    #[runtime::pallet_index(1)]
    pub type ParachainSystem = cumulus_pallet_parachain_system;
    #[runtime::pallet_index(2)]
    pub type Randomness = pallet_insecure_randomness_collective_flip;
    #[runtime::pallet_index(10)]
    pub type Balances = pallet_balances;
    #[runtime::pallet_index(11)]
    pub type Assets = pallet_assets;
    #[runtime::pallet_index(12)]
    pub type TransactionPayment = pallet_transaction_payment;
    #[runtime::pallet_index(13)]
    pub type SkipFeelessPayment = pallet_skip_feeless_payment;
    #[runtime::pallet_index(50)]
    pub type Digifall = pallet_digifall;
}

#[cfg(feature = "runtime-benchmarks")]
mod benchmark_apis {
    use super::*;
    use polkadot_sdk::{
        frame_benchmarking::{BenchmarkBatch, BenchmarkConfig, BenchmarkList},
        frame_support::traits::{StorageInfoTrait, WhitelistedStorageKeys},
        sp_runtime::traits::Block as BlockT,
    };

    polkadot_sdk::frame_benchmarking::define_benchmarks!([pallet_digifall, Digifall]);

    polkadot_sdk::sp_api::impl_runtime_apis! {
        impl polkadot_sdk::sp_api::Core<Block> for Runtime {
            fn version() -> RuntimeVersion {
                VERSION
            }

            fn execute_block(block: <Block as BlockT>::LazyBlock) {
                Executive::execute_block(block)
            }

            fn initialize_block(
                header: &<Block as BlockT>::Header,
            ) -> polkadot_sdk::sp_runtime::ExtrinsicInclusionMode {
                Executive::initialize_block(header)
            }
        }

        impl polkadot_sdk::sp_genesis_builder::GenesisBuilder<Block> for Runtime {
            fn build_state(
                config: Vec<u8>,
            ) -> polkadot_sdk::sp_genesis_builder::Result {
                polkadot_sdk::frame_support::genesis_builder_helper::build_state::<
                    RuntimeGenesisConfig,
                >(config)
            }

            fn get_preset(
                id: &Option<polkadot_sdk::sp_genesis_builder::PresetId>,
            ) -> Option<Vec<u8>> {
                polkadot_sdk::frame_support::genesis_builder_helper::get_preset::<
                    RuntimeGenesisConfig,
                >(id, |name| {
                    (name == polkadot_sdk::sp_genesis_builder::DEV_RUNTIME_PRESET).then(|| {
                        polkadot_sdk::frame_support::genesis_builder_helper::get_preset::<
                            RuntimeGenesisConfig,
                        >(&None, |_| None)
                        .expect("default genesis preset serializes")
                    })
                })
            }

            fn preset_names() -> Vec<polkadot_sdk::sp_genesis_builder::PresetId> {
                alloc::vec![polkadot_sdk::sp_genesis_builder::DEV_RUNTIME_PRESET.into()]
            }
        }

        impl polkadot_sdk::frame_benchmarking::Benchmark<Block> for Runtime {
            fn benchmark_metadata(extra: bool) -> (
                Vec<BenchmarkList>,
                Vec<polkadot_sdk::frame_support::traits::StorageInfo>,
            ) {
                let mut list = Vec::<BenchmarkList>::new();
                list_benchmarks!(list, extra);
                (list, AllPalletsWithSystem::storage_info())
            }

            fn dispatch_benchmark(
                config: BenchmarkConfig,
            ) -> Result<Vec<BenchmarkBatch>, alloc::string::String> {
                let whitelist = AllPalletsWithSystem::whitelisted_storage_keys();
                let mut batches = Vec::<BenchmarkBatch>::new();
                let params = (&config, &whitelist);
                add_benchmarks!(params, batches);
                if batches.is_empty() {
                    return Err("Benchmark not found for this pallet.".into());
                }
                Ok(batches)
            }
        }
    }
}

parameter_types! {
    pub Version: RuntimeVersion = VERSION;
    pub RuntimeBlockWeights: frame_system::limits::BlockWeights =
        frame_system::limits::BlockWeights::simple_max(Weight::from_parts(
            2_000_000_000_000,
            5 * 1024 * 1024,
        ));
    pub RuntimeBlockLength: frame_system::limits::BlockLength =
        frame_system::limits::BlockLength::builder()
            .max_length(5 * 1024 * 1024)
            .build();
    pub const BlockHashCount: BlockNumber = 2_400;
    pub const Ss58Prefix: u16 = 42;
}

#[derive_impl(frame_system::config_preludes::ParaChainDefaultConfig)]
impl frame_system::Config for Runtime {
    type AccountId = AccountId;
    type AccountData = pallet_balances::AccountData<Balance>;
    type Block = Block;
    type BlockHashCount = BlockHashCount;
    type BlockLength = RuntimeBlockLength;
    type BlockWeights = RuntimeBlockWeights;
    type DbWeight = RocksDbWeight;
    type Hash = Hash;
    type MaxConsumers = ConstU32<16>;
    type Nonce = Nonce;
    type OnSetCode = cumulus_pallet_parachain_system::ParachainSetCode<Self>;
    type SS58Prefix = Ss58Prefix;
    type SingleBlockMigrations = ();
    type Version = Version;
}

parameter_types! {
    pub const ParachainId: ParaId = ParaId::new(2_000);
    pub const ReservedXcmpWeight: Weight = Weight::zero();
    pub const ReservedDmpWeight: Weight = Weight::zero();
}

impl cumulus_pallet_parachain_system::Config for Runtime {
    type CheckAssociatedRelayNumber =
        cumulus_pallet_parachain_system::RelayNumberMonotonicallyIncreases;
    type ConsensusHook = cumulus_pallet_parachain_system::consensus_hook::ExpectParentIncluded;
    type DmpQueue = ();
    type OnSystemEvent = ();
    type OutboundXcmpMessageSource = ();
    type RelayParentOffset = ConstU32<0>;
    type ReservedDmpWeight = ReservedDmpWeight;
    type ReservedXcmpWeight = ReservedXcmpWeight;
    type RuntimeEvent = RuntimeEvent;
    type SchedulingSignatureVerifier = ();
    type SelfParaId = ParachainId;
    type WeightInfo = ();
    type XcmpMessageHandler = ();
}

parameter_types! {
    pub const ExistentialDeposit: Balance = 1_000_000;
}

impl pallet_balances::Config for Runtime {
    type AccountStore = System;
    type Balance = Balance;
    type DoneSlashHandler = ();
    type DustRemoval = ();
    type ExistentialDeposit = ExistentialDeposit;
    type FreezeIdentifier = RuntimeFreezeReason;
    type MaxFreezes = VariantCountOf<RuntimeFreezeReason>;
    type MaxLocks = ConstU32<50>;
    type MaxReserves = ConstU32<50>;
    type ReserveIdentifier = [u8; 8];
    type RuntimeEvent = RuntimeEvent;
    type RuntimeFreezeReason = RuntimeFreezeReason;
    type RuntimeHoldReason = RuntimeHoldReason;
    type WeightInfo = pallet_balances::weights::SubstrateWeight<Runtime>;
}

parameter_types! {
    pub const AssetDeposit: Balance = 100 * ExistentialDeposit::get();
    pub const AssetAccountDeposit: Balance = ExistentialDeposit::get();
    pub const MetadataDepositBase: Balance = ExistentialDeposit::get();
    pub const MetadataDepositPerByte: Balance = ExistentialDeposit::get();
    pub const ApprovalDeposit: Balance = ExistentialDeposit::get();
    pub const AssetStringLimit: u32 = 50;
}

impl pallet_assets::Config for Runtime {
    type ApprovalDeposit = ApprovalDeposit;
    type AssetAccountDeposit = AssetAccountDeposit;
    type AssetDeposit = AssetDeposit;
    type AssetId = AssetId;
    type AssetIdAllocator = ();
    type AssetIdParameter = AssetId;
    type Balance = Balance;
    #[cfg(feature = "runtime-benchmarks")]
    type BenchmarkHelper = ();
    type CallbackHandle = ();
    type CreateOrigin = AsEnsureOriginWithArg<frame_system::EnsureSigned<AccountId>>;
    type Currency = Balances;
    type Extra = ();
    type ForceOrigin = frame_system::EnsureRoot<AccountId>;
    type Freezer = ();
    type Holder = ();
    type MetadataDepositBase = MetadataDepositBase;
    type MetadataDepositPerByte = MetadataDepositPerByte;
    type RemoveItemsLimit = ConstU32<1_000>;
    type ReserveData = ();
    type RuntimeEvent = RuntimeEvent;
    type StringLimit = AssetStringLimit;
    type WeightInfo = pallet_assets::weights::SubstrateWeight<Runtime>;
}

impl pallet_insecure_randomness_collective_flip::Config for Runtime {}

impl pallet_transaction_payment::Config for Runtime {
    type FeeMultiplierUpdate = ();
    type LengthToFee = IdentityFee<Balance>;
    type OnChargeTransaction = pallet_transaction_payment::FungibleAdapter<Balances, ()>;
    type OperationalFeeMultiplier = ConstU8<5>;
    type RuntimeEvent = RuntimeEvent;
    type WeightInfo = ();
    type WeightToFee = IdentityFee<Balance>;
}

impl pallet_skip_feeless_payment::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
}

parameter_types! {
    pub const RewardAssetId: AssetId = 7;
    pub const DigifallPalletId: PalletId = PalletId(*b"dg/fall!");
    pub const DefaultMinStake: Balance = 100_000_000;
    pub const DefaultMaxStake: Balance = 100_000_000_000;
    pub const MaxReward: Balance = 100_000_000_000;
    pub const MaxMoves: u32 = 40_000;
    pub const MaxTransitions: u32 = 1_000;
    pub const MaxStepsPerCall: u32 = 64;
    // The integration runtime uses collective-flip only as a compile/test source. Its 81-block
    // lookback requires a delay greater than 81; production must replace this source.
    pub const RandomnessDelay: BlockNumber = 100;
    pub const MaxRevealsPerBlock: u32 = 100;
    pub const FeelessTransactionPriority: u64 = 1_000_000;
    pub const FeelessTransactionLongevity: u64 = 1;
}

pub type RewardToken = ItemOf<Assets, RewardAssetId, AccountId>;

pub struct TemplateRewardPolicy;
impl pallet_digifall::RewardPolicy<Balance> for TemplateRewardPolicy {
    fn reward(stake: Balance, score: u128) -> Option<Balance> {
        stake.checked_div(10)?.checked_add(score)
    }
}

#[cfg(feature = "runtime-benchmarks")]
pub struct DigifallBenchmarkHelper;
#[cfg(feature = "runtime-benchmarks")]
impl pallet_digifall::BenchmarkHelper<AccountId> for DigifallBenchmarkHelper {
    fn prepare_reward_asset(owner: &AccountId) {
        if !pallet_assets::Asset::<Runtime>::contains_key(RewardAssetId::get()) {
            Assets::force_create(
                RuntimeOrigin::root(),
                RewardAssetId::get(),
                Address::Id(owner.clone()),
                true,
                1,
            )
            .expect("benchmark reward asset creation succeeds");
        }
    }
}

impl pallet_digifall::Config for Runtime {
    type DefaultMaxStake = DefaultMaxStake;
    type DefaultMinStake = DefaultMinStake;
    type FeelessTransactionLongevity = FeelessTransactionLongevity;
    type FeelessTransactionPriority = FeelessTransactionPriority;
    type GameRandomness = Randomness;
    type MaxMoves = MaxMoves;
    type MaxRevealsPerBlock = MaxRevealsPerBlock;
    type MaxReward = MaxReward;
    type MaxStepsPerCall = MaxStepsPerCall;
    type MaxTransitions = MaxTransitions;
    type PalletId = DigifallPalletId;
    type RandomnessDelay = RandomnessDelay;
    type RewardCurrency = RewardToken;
    type RewardPolicy = TemplateRewardPolicy;
    #[cfg(feature = "runtime-benchmarks")]
    type BenchmarkHelper = DigifallBenchmarkHelper;
    type RuntimeEvent = RuntimeEvent;
    type StakeCurrency = Balances;
    type WeightInfo = weights::pallet_digifall::WeightInfo<Runtime>;
}

cumulus_pallet_parachain_system::register_validate_block! {
    Runtime = Runtime,
    BlockExecutor = Executive,
}

#[cfg(test)]
mod tests {
    use super::*;
    use codec::{Decode, Encode};
    use polkadot_sdk::{
        frame_support::{assert_ok, traits::Hooks},
        sp_core::{Pair, sr25519},
        sp_runtime::{
            BuildStorage, generic::SignedPayload, transaction_validity::InvalidTransaction,
        },
    };

    fn account(byte: u8) -> AccountId {
        AccountId::new([byte; 32])
    }

    fn test_externalities(owner: &AccountId) -> polkadot_sdk::sp_io::TestExternalities {
        let mut storage = frame_system::GenesisConfig::<Runtime>::default()
            .build_storage()
            .expect("system genesis builds");
        pallet_balances::GenesisConfig::<Runtime> {
            balances: alloc::vec![(owner.clone(), 1_000_000_000)],
            dev_accounts: None,
        }
        .assimilate_storage(&mut storage)
        .expect("balances genesis assimilates");
        storage.into()
    }

    fn signed_extrinsic(
        signer: &sr25519::Pair,
        nonce: Nonce,
        call: RuntimeCall,
    ) -> UncheckedExtrinsic {
        let extensions: TxExtension = (
            frame_system::AuthorizeCall::<Runtime>::new(),
            frame_system::CheckNonZeroSender::<Runtime>::new(),
            frame_system::CheckSpecVersion::<Runtime>::new(),
            frame_system::CheckTxVersion::<Runtime>::new(),
            frame_system::CheckGenesis::<Runtime>::new(),
            frame_system::CheckEra::<Runtime>::from(generic::Era::Immortal),
            pallet_digifall::CheckNonceForDigifall::<Runtime>::from_nonce(nonce),
            frame_system::CheckWeight::<Runtime>::new(),
            pallet_skip_feeless_payment::SkipCheckIfFeeless::<
                Runtime,
                pallet_transaction_payment::ChargeTransactionPayment<Runtime>,
            >::from(pallet_transaction_payment::ChargeTransactionPayment::from(
                0,
            )),
        );
        let payload =
            SignedPayload::new(call.clone(), extensions.clone()).expect("signed payload encodes");
        let signature = payload.using_encoded(|encoded| signer.sign(encoded));
        UncheckedExtrinsic::new_signed(
            call,
            Address::Id(AccountId::from(signer.public())),
            Signature::Sr25519(signature),
            extensions,
        )
    }

    fn commit_reveal_and_activate(owner: &AccountId, session: &AccountId) {
        System::set_block_number(1);
        assert_ok!(Digifall::commit_game(
            RuntimeOrigin::signed(owner.clone()),
            session.clone(),
            DefaultMinStake::get(),
        ));
        assert_eq!(Balances::free_balance(session), 0);
        assert_eq!(System::account(session).sufficients, 1);
        System::set_block_number(101);
        Randomness::on_initialize(101);
        Digifall::on_initialize(101);
        assert_ok!(Digifall::activate_game(
            RuntimeOrigin::signed(session.clone()),
            owner.clone(),
            1,
            0,
            MaxStepsPerCall::get(),
        ));
    }

    #[test]
    fn wasm_validation_binary_is_embedded() {
        assert!(WASM_BINARY.is_some_and(|binary| !binary.is_empty()));
    }

    #[test]
    fn pallet_executes_inside_parachain_runtime_composition() {
        let owner = account(1);
        let session = account(2);
        test_externalities(&owner).execute_with(|| {
            commit_reveal_and_activate(&owner, &session);
            assert!(matches!(
                pallet_digifall::Games::<Runtime>::get(&owner),
                Some(pallet_digifall::GameSlot::Active(_))
            ));
            assert_ok!(Digifall::forfeit(RuntimeOrigin::signed(owner.clone()), 1));
            assert!(!pallet_digifall::Games::<Runtime>::contains_key(&owner));
            assert_eq!(System::account(&session).sufficients, 0);
            assert_eq!(
                Balances::free_balance(Digifall::pot_account()),
                DefaultMinStake::get()
            );
        });
    }

    #[test]
    fn concrete_signed_extrinsic_pipeline_sponsors_only_current_progress_call() {
        let owner_pair = sr25519::Pair::from_seed(&[11; 32]);
        let session_pair = sr25519::Pair::from_seed(&[12; 32]);
        let owner = AccountId::from(owner_pair.public());
        let session = AccountId::from(session_pair.public());
        test_externalities(&owner).execute_with(|| {
            commit_reveal_and_activate(&owner, &session);
            let active = match pallet_digifall::Games::<Runtime>::get(&owner) {
                Some(pallet_digifall::GameSlot::Active(active)) => active,
                _ => panic!("game activates"),
            };
            let call = RuntimeCall::Digifall(pallet_digifall::Call::play {
                owner: owner.clone(),
                game_id: active.game_id,
                expected_revision: active.revision,
                card_index: 0,
                step_budget: MaxStepsPerCall::get(),
            });
            let encoded = signed_extrinsic(&session_pair, 0, call).encode();
            let extrinsic = UncheckedExtrinsic::decode(&mut &encoded[..])
                .expect("signed extrinsic round-trips through SCALE");
            assert!(matches!(Executive::apply_extrinsic(extrinsic), Ok(Ok(_))));
            assert_eq!(System::account(&session).nonce, 1);
            assert_eq!(Balances::free_balance(&session), 0);

            let stale = UncheckedExtrinsic::decode(&mut &encoded[..]).expect("replay decodes");
            assert_eq!(
                Executive::apply_extrinsic(stale),
                Err(InvalidTransaction::Stale.into())
            );

            let paid_call = RuntimeCall::System(frame_system::Call::remark {
                remark: alloc::vec![1],
            });
            let paid = signed_extrinsic(&session_pair, 1, paid_call);
            assert_eq!(
                Executive::apply_extrinsic(paid),
                Err(InvalidTransaction::Payment.into())
            );
            assert_eq!(System::account(&session).nonce, 1);
        });
    }

    #[test]
    fn concrete_asset_adapter_mints_reward_on_completion() {
        let owner = account(3);
        let session = account(4);
        test_externalities(&owner).execute_with(|| {
            assert_ok!(Assets::force_create(
                RuntimeOrigin::root(),
                RewardAssetId::get(),
                Address::Id(owner.clone()),
                true,
                1,
            ));
            commit_reveal_and_activate(&owner, &session);
            for _ in 0..64 {
                let Some(pallet_digifall::GameSlot::Active(active)) =
                    pallet_digifall::Games::<Runtime>::get(&owner)
                else {
                    break;
                };
                match active.game.phase {
                    pallet_digifall::Phase::Ready => {
                        let card_index =
                            (active.game.move_count as usize % pallet_digifall::BOARD_SIZE) as u8;
                        assert_ok!(Digifall::play(
                            RuntimeOrigin::signed(session.clone()),
                            owner.clone(),
                            active.game_id,
                            active.revision,
                            card_index,
                            MaxStepsPerCall::get(),
                        ));
                    }
                    pallet_digifall::Phase::Preparing
                    | pallet_digifall::Phase::Resolving { .. } => {
                        assert_ok!(Digifall::advance(
                            RuntimeOrigin::signed(session.clone()),
                            owner.clone(),
                            active.game_id,
                            active.revision,
                            MaxStepsPerCall::get(),
                        ));
                    }
                    pallet_digifall::Phase::Finished => {
                        panic!("finished game must settle in the same call")
                    }
                }
            }
            assert!(!pallet_digifall::Games::<Runtime>::contains_key(&owner));
            let result = pallet_digifall::LastResults::<Runtime>::get(&owner)
                .expect("completion stores terminal result");
            assert!(matches!(
                result.outcome,
                pallet_digifall::GameOutcome::Completed(_)
            ));
            assert_eq!(Assets::balance(RewardAssetId::get(), &owner), result.reward);
            assert!(result.reward > 0);
            assert_eq!(System::account(&session).sufficients, 0);
            assert_eq!(
                Balances::free_balance(Digifall::pot_account()),
                DefaultMinStake::get()
            );
        });
    }
}
