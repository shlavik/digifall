#!/usr/bin/env bash
set -euo pipefail

CHAIN_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
REPO_ROOT=$(cd "$CHAIN_ROOT/.." && pwd)
BENCHER=${FRAME_OMNI_BENCHER:-frame-omni-bencher}
STEPS=${STEPS:-50}
REPEAT=${REPEAT:-20}
RUNTIME_PACKAGE=digifall-template-runtime
WASM="$CHAIN_ROOT/target/release/wbuild/$RUNTIME_PACKAGE/digifall_template_runtime.compact.compressed.wasm"
DESTINATION="$CHAIN_ROOT/runtime/src/weights/pallet_digifall.rs"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

command -v "$BENCHER" >/dev/null 2>&1 || {
  echo "Missing frame-omni-bencher. Install it or set FRAME_OMNI_BENCHER." >&2
  exit 1
}

cargo build \
  --locked \
  --manifest-path "$CHAIN_ROOT/Cargo.toml" \
  -p "$RUNTIME_PACKAGE" \
  --release \
  --features runtime-benchmarks

"$BENCHER" v1 benchmark pallet \
  --runtime "$WASM" \
  --pallet pallet_digifall \
  --extrinsic '*' \
  --steps "$STEPS" \
  --repeat "$REPEAT" \
  --output "$TEMP_DIR"

python3 - "$TEMP_DIR/pallet_digifall.rs" "$DESTINATION" <<'PY'
from pathlib import Path
import re
import sys

source = Path(sys.argv[1])
destination = Path(sys.argv[2])
text = source.read_text()
text = text.replace(
    "use frame_support::{traits::Get, weights::Weight};",
    "use polkadot_sdk::frame_support::{traits::Get, weights::Weight};",
)
text = text.replace(
    "impl<T: frame_system::Config> pallet_digifall::WeightInfo for WeightInfo<T> {",
    "impl<T: polkadot_sdk::frame_system::Config> pallet_digifall::WeightInfo for WeightInfo<T> {",
)
methods = re.findall(r"^\s*fn\s+(\w+)\s*\(", text, re.MULTILINE)
if len(methods) != 16 or len(set(methods)) != 16:
    raise SystemExit(f"expected 16 unique generated weight methods, got {methods}")
destination.write_text(text)
PY

cargo check --locked --manifest-path "$CHAIN_ROOT/Cargo.toml" -p "$RUNTIME_PACKAGE"
echo "Updated ${DESTINATION#$REPO_ROOT/} with $STEPS steps and $REPEAT repeats."
