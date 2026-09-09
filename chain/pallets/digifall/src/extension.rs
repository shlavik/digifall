use codec::{Decode, DecodeWithMemTracking, Encode};
use frame::prelude::*;
use scale_info::TypeInfo;

use polkadot_sdk::{
    frame_support::dispatch::{CheckIfFeeless, DispatchInfo},
    sp_runtime::{
        DispatchResult,
        traits::{
            AsSystemOriginSigner, DispatchInfoOf, DispatchOriginOf, Dispatchable,
            PostDispatchInfoOf, TransactionExtension, ValidateResult,
        },
        transaction_validity::{
            InvalidTransaction, TransactionLongevity, TransactionValidityError, ValidTransaction,
        },
    },
};

/// A drop-in nonce extension for runtimes with state-dependent fee-free calls.
///
/// Paid calls retain the standard FRAME behavior and may enter the pool with future nonces.
/// Calls that currently satisfy `CheckIfFeeless` must use the account's exact current nonce,
/// receive a short configured lifetime, and receive an explicit non-zero priority. This prevents
/// one session from chaining many copies of the same currently valid game revision through future
/// nonce dependencies before the first copy is included.
#[derive(Clone, Decode, DecodeWithMemTracking, Encode, Eq, PartialEq, TypeInfo)]
#[scale_info(skip_type_params(T))]
pub struct CheckNonceForDigifall<T: frame_system::Config>(#[codec(compact)] pub T::Nonce);

impl<T: frame_system::Config> CheckNonceForDigifall<T> {
    pub fn from_nonce(nonce: T::Nonce) -> Self {
        Self(nonce)
    }
}

impl<T: frame_system::Config> core::fmt::Debug for CheckNonceForDigifall<T> {
    #[cfg(feature = "std")]
    fn fmt(&self, formatter: &mut core::fmt::Formatter) -> core::fmt::Result {
        write!(formatter, "CheckNonce({:?})", self.0)
    }

    #[cfg(not(feature = "std"))]
    fn fmt(&self, _: &mut core::fmt::Formatter) -> core::fmt::Result {
        Ok(())
    }
}

#[derive(Debug)]
pub enum NonceValidation<AccountId> {
    Check(AccountId),
    Refund(Weight),
}

#[derive(Debug)]
pub enum NoncePreparation {
    Checked,
    Refund(Weight),
}

impl<T> TransactionExtension<T::RuntimeCall> for CheckNonceForDigifall<T>
where
    T: crate::Config + Send + Sync,
    T::RuntimeCall: Dispatchable<Info = DispatchInfo>
        + CheckIfFeeless<Origin = DispatchOriginOf<T::RuntimeCall>>,
    DispatchOriginOf<T::RuntimeCall>: AsSystemOriginSigner<T::AccountId> + Clone,
{
    // Keep wallet-facing compatibility with the FRAME nonce field this extension replaces.
    const IDENTIFIER: &'static str = "CheckNonce";
    type Implicit = ();
    type Val = NonceValidation<T::AccountId>;
    type Pre = NoncePreparation;

    fn weight(&self, _: &T::RuntimeCall) -> Weight {
        <T::ExtensionsWeightInfo as frame_system::ExtensionsWeightInfo>::check_nonce()
            .saturating_add(<T::WeightInfo as crate::WeightInfo>::check_nonce_for_feeless())
    }

    fn validate(
        &self,
        origin: DispatchOriginOf<T::RuntimeCall>,
        call: &T::RuntimeCall,
        _info: &DispatchInfoOf<T::RuntimeCall>,
        _len: usize,
        _self_implicit: Self::Implicit,
        _inherited_implication: &impl Encode,
        _source: TransactionSource,
    ) -> ValidateResult<Self::Val, T::RuntimeCall> {
        let Some(who) = origin.as_system_origin_signer() else {
            return Ok((
                ValidTransaction::default(),
                NonceValidation::Refund(self.weight(call)),
                origin,
            ));
        };
        let is_feeless = call.is_feeless(&origin);
        let frame_system::ValidNonceInfo { provides, requires } =
            frame_system::CheckNonce::<T>::validate_nonce_for_account(who, self.0)?;
        if is_feeless && !requires.is_empty() {
            return Err(InvalidTransaction::Future.into());
        }
        let validity = ValidTransaction {
            priority: if is_feeless {
                T::FeelessTransactionPriority::get()
            } else {
                0
            },
            requires,
            provides,
            longevity: if is_feeless {
                T::FeelessTransactionLongevity::get()
            } else {
                TransactionLongevity::MAX
            },
            propagate: true,
        };
        Ok((validity, NonceValidation::Check(who.clone()), origin))
    }

    fn prepare(
        self,
        validation: Self::Val,
        _origin: &DispatchOriginOf<T::RuntimeCall>,
        _call: &T::RuntimeCall,
        _info: &DispatchInfoOf<T::RuntimeCall>,
        _len: usize,
    ) -> Result<Self::Pre, TransactionValidityError> {
        match validation {
            NonceValidation::Check(who) => {
                frame_system::CheckNonce::<T>::prepare_nonce_for_account(&who, self.0)?;
                Ok(NoncePreparation::Checked)
            }
            NonceValidation::Refund(weight) => Ok(NoncePreparation::Refund(weight)),
        }
    }

    fn post_dispatch_details(
        preparation: Self::Pre,
        _info: &DispatchInfo,
        _post_info: &PostDispatchInfoOf<T::RuntimeCall>,
        _len: usize,
        _result: &DispatchResult,
    ) -> Result<Weight, TransactionValidityError> {
        match preparation {
            NoncePreparation::Checked => Ok(Weight::zero()),
            NoncePreparation::Refund(weight) => Ok(weight),
        }
    }
}
