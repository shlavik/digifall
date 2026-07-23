#!/usr/bin/env node
import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const ANDROID_API_LEVEL = 36;
const DEFAULT_GRADLE_PATH = "android/app/build.gradle";

export function configureSdk(gradle, apiLevel = ANDROID_API_LEVEL) {
  const replacements = [
    [/^(\s*compileSdkVersion\s+)\d+\s*$/m, `$1${apiLevel}`],
    [/^(\s*targetSdkVersion\s+)\d+\s*$/m, `$1${apiLevel}`],
  ];
  let configured = gradle;
  for (const [pattern, replacement] of replacements) {
    if (!pattern.test(configured)) {
      throw new Error(`Bubblewrap Gradle template does not match ${pattern}`);
    }
    configured = configured.replace(pattern, replacement);
  }
  return configured;
}

function main() {
  const gradlePath = process.argv[2] || DEFAULT_GRADLE_PATH;
  const gradle = fs.readFileSync(gradlePath, "utf8");
  fs.writeFileSync(gradlePath, configureSdk(gradle));
  console.log(`Configured ${gradlePath} for Android API ${ANDROID_API_LEVEL}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
