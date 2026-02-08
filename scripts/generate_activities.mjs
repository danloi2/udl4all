import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyFile, loadConfig } from './verify_activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../src/data/json/activities');

// Helper to ensure directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Helper to Create Activity JSON
function createActivityJson(id, code, titleObj) {
  // If titleObj is a string, assuming it's legacy/single-line mode -> ES
  const titles =
    typeof titleObj === 'string'
      ? { es: titleObj, eu: '', en: '', la: '' }
      : { ...{ es: '', eu: '', en: '', la: '' }, ...titleObj };

  return {
    id: id,
    code: code,
    gradeLevel: 'INF', // Overwritten by main
    subject: 'GEN', // Overwritten by main
    title: titles,
    duaAdaptations: {
      // Engagement (7, 8, 9)
      7.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      7.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      7.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      // 7.4 Removed as it doesn't exist in standard UDL 2.2/3.0 usually, but keeping if user had it.
      // Actually standard is 7.1, 7.2, 7.3.
      // User had 7.4 in previous list, I will keep it to be safe or remove if it was a mistake?
      // Looking at previous file content, 7.4 was there. I will keep it but sorted.
      7.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      8.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      8.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      8.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      8.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      8.5: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] }, // Keeping 8.5 if it was there

      9.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      9.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      9.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      9.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      // Representation (1, 2, 3)
      1.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      1.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      1.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      2.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      2.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      2.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      2.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      2.5: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      3.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      3.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      3.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      3.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      // Action & Expression (4, 5, 6)
      4.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      4.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },

      5.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      5.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      5.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      5.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] }, // Keeping 5.4

      6.1: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      6.2: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      6.3: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      6.4: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] },
      6.5: { text: { es: '', eu: '', en: '', la: '' }, webTools: [] }, // Keeping 6.5
    },
  };
}

// Pad number with leading zero
function padNumber(num) {
  return num.toString().padStart(2, '0');
}

// Mappings based on constants.ts
// Mappings based on constants.ts ( Spanish Only )
const GRADE_MAP = {
  // Standardized folder names matching constants IDs
  '01_inf': 'INF',
  '02_pri': 'PRI',
  '03_eso': 'ESO',
  '04_bac': 'BAC',
  '05_fpb': 'FPB',
  '06_epa': 'EPA',
  '07_cgm': 'CGM',
  '08_cgs': 'CGS',
  '09_uni': 'UNI',
};

const SUBJECT_MAP = {
  // Infantil
  'Crecimiento en Armonía': 'ARM',
  'Descubrimiento y Exploración del Entorno': 'DES',
  'Comunicación y Representación de la Realidad': 'COM',

  // Primaria / ESO
  'Conocimiento del Medio Natural, Social y Cultural': 'CON',
  'Educación Artística': 'ART',
  'Educación Física': 'EFI',
  'Lengua Castellana y Literatura': 'LCA',
  'Lengua Vasca y Literatura': 'LCO',
  'Lengua Extranjera': 'LEX',
  Matemáticas: 'MAT',
  'Educación en Valores Cívicos y Éticos': 'VCE',
  Religión: 'REL',
  'Biología y Geología': 'BGE',
  'Educación Plástica, Visual y Audiovisual': 'EPV',
  'Física y Química': 'FQU',
  'Geografía e Historia': 'GHI',
  Música: 'MUS',
  'Tecnología y Digitalización': 'TEC',

  // Bachillerato / FP / Others
  Filosofía: 'FIL',
  'Historia de la Filosofía': 'HFI',
  'Historia de España': 'HES',
  'Biología, Geología y Ciencias Ambientales': 'BIO',
  Biología: 'BIO',
  Geología: 'GEO',
  'Dibujo Técnico': 'DTE',
  Latín: 'LAT',
  Griego: 'GRI',
  'Matemáticas Aplicadas a las Ciencias Sociales': 'MCS',
  'Economía, Emprendimiento y Actividad Empresarial': 'ECO',
  'Literatura Universal': 'LUN',
  'Dibujo Artístico': 'DAR',
  'Análisis Musical': 'AMU',
  'Artes Escénicas': 'AES',
  'Cultura Audiovisual': 'CAV',
  'Ciencias para el Mundo Contemporáneo': 'CMC',

  // Generic Fallback
  General: 'GEN',
};

const config = await loadConfig();

async function main() {
  const mdFilePath = process.argv[2];

  if (!mdFilePath) {
    console.error('Please provide a markdown file path.');
    process.exit(1);
  }

  const absoluteMdPath = path.resolve(process.cwd(), mdFilePath);

  if (!fs.existsSync(absoluteMdPath)) {
    console.error(`File not found: ${absoluteMdPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(absoluteMdPath, 'utf-8');
  // Normalize line endings
  const lines = fileContent.replace(/\r\n/g, '\n').split('\n');

  // Default output directory to the markdown file's directory
  let currentDir = path.dirname(absoluteMdPath);
  console.log(`Default output directory: ${currentDir}`);

  // State for Subject: determined by the last seen header #
  let currentSubjectCode = 'GEN';

  // State for block parsing
  let currentActivityIndex = null;
  let currentTitles = { es: '', en: '', eu: '', la: '' };

  // Helper to determine Grade from path
  function getGradeFromPath(dirPath) {
    const parts = dirPath.split(path.sep);
    for (const part of parts) {
      if (GRADE_MAP[part]) return GRADE_MAP[part];
    }
    return 'INF'; // Default
  }

  // Helper function to emit JSON
  function emitActivity() {
    if (currentActivityIndex !== null && currentDir) {
      const gradeLevel = getGradeFromPath(currentDir);

      // Construct filename: {index}_{grade}_{subject}.json
      const filenameBase =
        `${padNumber(currentActivityIndex)}_${gradeLevel.toLowerCase()}_${currentSubjectCode.toLowerCase()}.json`.replace(
          /-/g,
          '_'
        );

      const filename = filenameBase;
      const filePath = path.join(currentDir, filename);

      // ID and Code
      const idLower = path.parse(filename).name; // 01_inf_arm
      const id = idLower.toUpperCase(); // 01_INF_ARM
      const code = id.replace(/_/g, '-'); // 01-INF-ARM

      // Update the JSON creation to use strict grade and subject
      const jsonData = createActivityJson(id, code, currentTitles);
      jsonData.gradeLevel = gradeLevel;
      jsonData.subject = currentSubjectCode;

      ensureDirectoryExistence(filePath);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log(`Generated: ${filePath} (Grade: ${gradeLevel}, Subject: ${currentSubjectCode})`);

      // Verify the generated file
      const result = verifyFile(filePath, config);
      if (result.errors.length > 0) {
        console.error(`❌ Verification Failed for ${filename}:`);
        result.errors.forEach((e) => console.error(`   - ${e}`));
      } else {
        console.log(`✅ Verified`);
      }

      // Reset state
      currentActivityIndex = null;
      currentTitles = { es: '', en: '', eu: '', la: '' };
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // 1. Check for Directory Change @[...]
    // (If we see this, we should probably emit previous activity if pending)
    const directoryMatch = trimmedLine.match(/^@\[(.*?)\]/);
    if (directoryMatch) {
      emitActivity(); // Flush pending

      const rawPath = directoryMatch[1];
      currentDir = path.resolve(process.cwd(), rawPath);
      console.log(`Switched output directory to: ${currentDir}`);

      if (!fs.existsSync(currentDir)) {
        console.log(`Directory does not exist, creating: ${currentDir}`);
        fs.mkdirSync(currentDir, { recursive: true });
      }
      continue;
    }

    // 2. Check for Subject Header # Title
    const headerMatch = trimmedLine.match(/^#\s+(.*)/);
    if (headerMatch) {
      emitActivity(); // Flush pending

      const headerTitle = headerMatch[1].trim();
      const mappedCode = SUBJECT_MAP[headerTitle];

      if (mappedCode) {
        currentSubjectCode = mappedCode;
        console.log(`Detected Subject: ${headerTitle} -> ${currentSubjectCode}`);
      } else {
        console.warn(`Warning: Header "${headerTitle}" not found in SUBJECT_MAP. using 'GEN'.`);
        currentSubjectCode = 'GEN';
      }
      continue;
    }

    // 3. Check for New Activity Start
    // Supports: "**1.**", "1.", "**1**", "1"
    const newActivityMatch = trimmedLine.match(/^(\*\*?)?(\d+)(\.\s*(\*\*?)?|\.?\s*(\*\*?)?)/);
    // Note: The above might be too permissive or clash. Let's stick to the previous one but ensure optional bold.
    // Previous: /^(\*\*?)(\d+)(\.\s*\*\*?|\.)/
    // Let's try: Matches start with optional **, digits, optional . or .**, then space
    const activityRegex = /^(\*\*)?(\d+)(\.(\*\*)?)?/;
    // Wait, regex for "1." is ^1\.$
    // Regex for "**1.**" is ^\*\*1\.\*\*$
    // Regex for "**1**" is ^\*\*1\*\*$
    // Let's simplify: look for digits at start, surrounded by optional ** and optional dot.

    const activityMatchSimple = trimmedLine.match(/^(\*\*)?(\d+)(\.(\*\*)?)?/);

    // Actually, to differentiate from normal text, we probably want to enforce the dot if it's not bolded, or just rely on the user usage.
    // User asked "que funcione aunque no esté en negria el número".
    // "1. Title"
    // "**1.**"

    if (activityMatchSimple) {
      // Check if it really looks like a list item
      // Standard markdown list is "1. " or just "1." at end of line.
      // Our bold format is "**1.**".

      // Allow space OR end of line after dot
      const isStandardList = /^\d+\.(\s|$)/.test(trimmedLine);
      const isBoldList = /^\*\*\d+\.\*\*/.test(trimmedLine) || /^\*\*\d+\*\*/.test(trimmedLine);

      if (isStandardList || isBoldList) {
        emitActivity();
        const numberPart = trimmedLine.match(/(\d+)/)[0];
        currentActivityIndex = parseInt(numberPart);

        // Check for legacy inline title: "1. Título" matches standard list.
        // Remove the number part and clean up to get title.
        // For "**1.**", remainder is empty.

        // clean prefix: **, digits, ., spaces
        const cleanLine = trimmedLine.replace(/^(\*\*)?(\d+)(\.(\*\*)?)?\s*/, '').trim();
        if (cleanLine) {
          currentTitles.es = cleanLine;
        }
        continue;
      }
    }

    // 4. Check for Language Lines
    // Regex for language keys: optional **, Code (ES,EN,EU,LA), optional :, optional **
    if (currentActivityIndex !== null) {
      // Helper to extract text
      const extractLang = (code) => {
        // Regex: Start, optional ** (or *), Code, optional :, optional ** (or *), whitespace, Capture rest
        // We use [\\*]* to match any number of asterisks (0, 1, 2...)
        const regex = new RegExp(`^[\\*]*${code}(:)?[\\*]*\\s*(.*)`, 'i');
        const match = trimmedLine.match(regex);
        return match ? match[2].trim() : null;
      };

      const esText = extractLang('ES');
      if (esText !== null) {
        currentTitles.es = esText;
        continue;
      }

      const enText = extractLang('EN');
      if (enText !== null) {
        currentTitles.en = enText;
        continue;
      }

      const euText = extractLang('EU');
      if (euText !== null) {
        currentTitles.eu = euText;
        continue;
      }

      const laText = extractLang('LA');
      if (laText !== null) {
        currentTitles.la = laText;
        continue;
      }

      if (trimmedLine === '---') {
        emitActivity();
      }
    }
  }

  // Flush last activity at end of file
  emitActivity();
}

main().catch((err) => console.error(err));
