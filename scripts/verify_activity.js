import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Default Configuration
const DEFAULT_CONFIG = {
  requiredFields: ['id', 'code', 'gradeLevel', 'subject', 'title', 'duaAdaptations'],
  multilingualFields: ['title'],
  languages: ['es', 'en', 'eu', 'la'],
  adaptations: {
    pattern: /^[1-9]\.[1-9]$/, // Keys like 1.1, 9.4
    structure: {
      text: 'multilingual', // Expects { es: "", en: "" ... }
      webTools: 'array', // Expects []
    },
  },
};

async function loadConfig() {
  const configPath = path.join(process.cwd(), 'verify_config.json');
  if (fs.existsSync(configPath)) {
    try {
      const customConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log('📦 Loaded custom configuration from verify_config.json');
      return { ...DEFAULT_CONFIG, ...customConfig };
    } catch (e) {
      console.error('⚠️ Error loading verify_config.json, using default config:', e.message);
    }
  }
  return DEFAULT_CONFIG;
}

function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else if (file.endsWith('.json')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function validateMultilingual(obj, fieldName, languages, errors) {
  if (!obj || typeof obj !== 'object') {
    errors.push(`Field '${fieldName}' is missing or not an object.`);
    return;
  }
  languages.forEach((lang) => {
    if (obj[lang] === undefined) {
      errors.push(`Field '${fieldName}' is missing language '${lang}'.`);
    } else if (typeof obj[lang] !== 'string') {
      errors.push(`Field '${fieldName}.${lang}' must be a string.`);
    }
  });
}

function verifyFile(filePath, config) {
  const errors = [];
  const warnings = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    // 1. Check Required Fields
    config.requiredFields.forEach((field) => {
      if (json[field] === undefined) {
        errors.push(`Missing required field: '${field}'`);
      }
    });

    // 2. Check Multilingual Fields (Top level)
    config.multilingualFields.forEach((field) => {
      if (json[field]) {
        validateMultilingual(json[field], field, config.languages, errors);
      }
    });

    // 3. Check duaAdaptations
    if (json.duaAdaptations) {
      Object.entries(json.duaAdaptations).forEach(([key, value]) => {
        // Check key pattern (e.g. 1.1)
        // We use the regex from config if it exists and is a RegExp object, or create one
        const pattern = new RegExp(config.adaptations.pattern);
        if (!pattern.test(key)) {
          warnings.push(`Adaptation key '${key}' might not follow standard pattern (e.g. 1.1).`);
        }

        // Check structure
        if (config.adaptations.structure.text === 'multilingual') {
          if (!value.text) {
            errors.push(`Adaptation '${key}' missing 'text' object.`);
          } else {
            validateMultilingual(
              value.text,
              `duaAdaptations.${key}.text`,
              config.languages,
              errors
            );
          }
        }

        if (config.adaptations.structure.webTools === 'array') {
          if (!Array.isArray(value.webTools)) {
            errors.push(`Adaptation '${key}' 'webTools' must be an array.`);
          }
        }
      });
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      errors.push(`Invalid JSON syntax: ${e.message}`);
    } else {
      errors.push(`Error reading file: ${e.message}`);
    }
  }

  return { path: filePath, errors, warnings };
}

async function main() {
  const targetPath = process.argv[2];
  if (!targetPath) {
    console.error('❌ Please provide a file or directory path to verify.');
    console.error('Usage: node scripts/verify_activity.js <path>');
    process.exit(1);
  }

  const absolutePath = path.resolve(targetPath);
  const config = await loadConfig();

  console.log(`🔍 Verifying JSON files in: ${absolutePath}`);
  console.log('---');

  let filesToCheck = [];
  if (fs.statSync(absolutePath).isDirectory()) {
    filesToCheck = getFiles(absolutePath);
  } else {
    filesToCheck = [absolutePath];
  }

  let passCount = 0;
  let failCount = 0;

  filesToCheck.forEach((file) => {
    const result = verifyFile(file, config);
    const relativePath = path.relative(process.cwd(), file);

    if (result.errors.length > 0) {
      console.log(`❌ ${relativePath}`);
      result.errors.forEach((e) => console.log(`   - ${e}`));
      failCount++;
    } else if (result.warnings.length > 0) {
      console.log(`⚠️  ${relativePath}`);
      result.warnings.forEach((w) => console.log(`   - ${w}`));
      passCount++; // Count as pass with warnings
    } else {
      // Uncomment to see all passed files
      // console.log(`✅ ${relativePath}`);
      passCount++;
    }
  });

  console.log('---');
  console.log(`📊 Result: ${passCount} Passed, ${failCount} Failed. Total: ${filesToCheck.length}`);

  if (failCount > 0) process.exit(1);
}

// Export functions for use in other scripts
export { verifyFile, loadConfig };

// Only run main if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
