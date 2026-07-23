import assert from "node:assert/strict";
import test from "node:test";
import { configureSdk } from "./configure-sdk.mjs";

test("configures Bubblewrap compile and target SDK levels", () => {
  const gradle = `android {
    compileSdkVersion 35
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 35
    }
}
`;
  const configured = configureSdk(gradle, 36);
  assert.match(configured, /compileSdkVersion 36/);
  assert.match(configured, /minSdkVersion 21/);
  assert.match(configured, /targetSdkVersion 36/);
});

test("fails when the Bubblewrap template shape changes", () => {
  assert.throws(() => configureSdk("android {}", 36), /does not match/);
});
