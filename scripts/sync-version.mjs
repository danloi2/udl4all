import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const packageJsonPath = path.join(rootDir, 'package.json');
const udlCorePath = path.join(rootDir, 'src/data/json/udl-core.json');

function syncVersion() {
  try {
    // 1. Read package.json version
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version;
    console.log(`🔍 Current package.json version: ${version}`);

    // 2. Read udl-core.json
    if (!fs.existsSync(udlCorePath)) {
      console.error('❌ Error: udl-core.json not found');
      return;
    }

    const udlCore = JSON.parse(fs.readFileSync(udlCorePath, 'utf8'));

    // 3. Update version field in udlCore.udl.version
    // The version field in udl-core.json is an object with translations like:
    // "version": { "es": "Versión 3.0", "en": "Version 3.0", ... }
    // We want to keep the label and only update the number part if possible,
    // or just ensure the version matches the package.json if it's meant to be that.

    // For now, let's assume we want to update the data to match package.json
    // while keeping the prefixes if they exist.

    const versionObj = udlCore.udl.version || {};

    const prefixes = {
      es: 'Versión ',
      en: 'Version ',
      eu: ' Bertsioa', // Suffix in Basque
      la: 'Versio ',
    };

    udlCore.udl.version = {
      es: `${prefixes.es}${version}`,
      en: `${prefixes.en}${version}`,
      eu: `${version}${prefixes.eu}`,
      la: `${prefixes.la}${version}`,
    };

    // 4. Write back to udl-core.json
    fs.writeFileSync(udlCorePath, JSON.stringify(udlCore, null, 2));
    console.log('✅ Successfully updated udl-core.json with new version.');

    // 5. Optionally create public/version.json for external checks
    const versionJsonPath = path.join(rootDir, 'public/version.json');
    fs.writeFileSync(versionJsonPath, JSON.stringify({ version }, null, 2));
    console.log('✅ Successfully created public/version.json');
  } catch (error) {
    console.error('❌ Error syncing version:', error.message);
  }
}

syncVersion();
