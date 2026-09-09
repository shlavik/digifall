#[cfg(feature = "std")]
fn main() {
    if std::env::var_os("WASM_BUILD_WORKSPACE_HINT").is_none() {
        let workspace = std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("runtime crate is a direct child of the chain workspace");
        // Build scripts are single-threaded here; set the hint before WasmBuilder spawns Cargo.
        unsafe { std::env::set_var("WASM_BUILD_WORKSPACE_HINT", workspace) };
    }
    substrate_wasm_builder::WasmBuilder::build_using_defaults();
}

#[cfg(not(feature = "std"))]
fn main() {}
