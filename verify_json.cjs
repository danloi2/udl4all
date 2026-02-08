const fs = require('fs');
const path = require('path');

const files = [
  'src/data/json/activities/02_pri/mat/01_pri_mat.json',
  'src/data/json/activities/02_pri/mat/02_pri_mat.json',
  'src/data/json/activities/01_inf/arm/01_inf_arm.json',
];

files.forEach((file) => {
  try {
    const absolutePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(absolutePath)) {
      console.error(`File not found: ${file}`);
      return;
    }
    const content = fs.readFileSync(absolutePath, 'utf8');
    const json = JSON.parse(content);
    console.log(`[PASS] ${file} is valid JSON.`);

    // Check duaAdaptations structure
    if (json.duaAdaptations) {
      Object.entries(json.duaAdaptations).forEach(([key, value]) => {
        if (typeof value === 'object' && value.text && Array.isArray(value.webTools)) {
          // Modern structure ok
        } else if (value.es || value.en) {
          // Legacy structure (?)
          console.log(
            `[INFO] ${file} key ${key} looks like legacy structure (direct MultilingualText?)`
          );
        } else {
          console.log(`[WARN] ${file} key ${key} has unexpected structure:`, Object.keys(value));
        }
      });
    }
  } catch (e) {
    console.error(`[FAIL] ${file} is invalid JSON:`, e.message);
  }
});
