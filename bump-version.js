const fs = require('fs');
const path = require('path');
const semver = require('semver');

const iosPlistPath = path.join(
  __dirname,
  'ios',
  'SimplirideDriver',
  'Info.plist',
);
const androidGradlePath = path.join(
  __dirname,
  'android',
  'app',
  'build.gradle',
);

const args = process.argv.slice(2);
const isRelease = args.includes('--release');
const bumpType = args.includes('--major')
  ? 'major'
  : args.includes('--minor')
  ? 'minor'
  : 'patch';

// ---- iOS ----
let plist = fs.readFileSync(iosPlistPath, 'utf8');

const getPlistValue = key => {
  const match = plist.match(
    new RegExp(`<key>${key}</key>\\s*<string>(.*?)</string>`),
  );
  return match ? match[1] : null;
};

const setPlistValue = (key, value) => {
  plist = plist.replace(
    new RegExp(`(<key>${key}</key>\\s*<string>)(.*?)</string>`),
    `$1${value}</string>`,
  );
};

const currentShortVersion = getPlistValue('CFBundleShortVersionString');
const currentBuild = parseInt(getPlistValue('CFBundleVersion'), 10);

const nextShortVersion = isRelease
  ? semver.inc(currentShortVersion, bumpType)
  : currentShortVersion;

const nextBuild = isRelease ? 1 : currentBuild + 1;

if (isRelease) {
  setPlistValue('CFBundleShortVersionString', nextShortVersion);
}
setPlistValue('CFBundleVersion', nextBuild);

fs.writeFileSync(iosPlistPath, plist);

// ---- Android ----
let gradle = fs.readFileSync(androidGradlePath, 'utf8');

const versionCodeMatch = gradle.match(/versionCode\s+(\d+)/);
const versionNameMatch = gradle.match(/versionName\s+"([^"]+)"/);

const currentCode = parseInt(versionCodeMatch[1], 10);
const currentName = versionNameMatch[1];

const nextVersionCode = currentCode + 1;
const nextVersionName = isRelease
  ? semver.inc(currentName, bumpType)
  : currentName;

gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${nextVersionCode}`);

if (isRelease) {
  gradle = gradle.replace(
    /versionName\s+"[^"]+"/,
    `versionName "${nextVersionName}"`,
  );
}

fs.writeFileSync(androidGradlePath, gradle);

// ---- Console Log ----
console.log(`✅ ${isRelease ? 'Release' : 'Test'} version bumped:`);
if (isRelease) {
  console.log(`   🔹 versionName (Android): ${nextVersionName}`);
  console.log(`   🔹 CFBundleShortVersionString (iOS): ${nextShortVersion}`);
}
console.log(`   🔸 versionCode (Android): ${nextVersionCode}`);
console.log(`   🔸 CFBundleVersion (iOS): ${nextBuild}`);

// node bump-version.js
// node bump-version.js --minor
// node bump-version.js --release
// node bump-version.js --release --major
