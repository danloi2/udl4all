import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const udlCorePath = path.join(__dirname, 'src/data/json/udl-core.json');
const udlCore = JSON.parse(fs.readFileSync(udlCorePath, 'utf8'));

// Extract principle colors and map them to guideline IDs
const guidelineColors = {};
udlCore.udl.networks.forEach((network) => {
  const principleColor = network.principle.color;
  network.principle.guidelines.forEach((guideline) => {
    // guideline.id is "guideline-X", we want the number i
    const id = guideline.id.split('-')[1];
    guidelineColors[id] = principleColor;
  });
});

const guidelinesCount = 9;
const considerationsPerGuideline = {
  1: ['1-1', '1-2', '1-3'],
  2: ['2-1', '2-2', '2-3', '2-4', '2-5'],
  3: ['3-1', '3-2', '3-3', '3-4'],
  4: ['4-1', '4-2'],
  5: ['5-1', '5-2', '5-3', '5-4'],
  6: ['6-1', '6-2', '6-3', '6-4'],
  7: ['7-1', '7-2', '7-3', '7-4'],
  8: ['8-1', '8-2', '8-3', '8-4', '8-5'],
  9: ['9-1', '9-2', '9-3', '9-4'],
};

const levels = [
  { es: 'Infantil', en: 'Pre-school', eu: 'Haur Hezkuntza', la: 'Infantilis' },
  { es: 'Primaria', en: 'Primary', eu: 'Lehen Hezkuntza', la: 'Primaria' },
  { es: 'Secundaria', en: 'Secondary', eu: 'Bigarren Hezkuntza', la: 'Secundaria' },
  { es: 'Bachillerato', en: 'High School', eu: 'Batxilergoa', la: 'Baccalaureatus' },
];

const areas = [
  { es: 'Matemáticas', en: 'Mathematics', eu: 'Matematika', la: 'Mathematica' },
  { es: 'Lengua', en: 'Language', eu: 'Hizkuntza', la: 'Lingua' },
  { es: 'Ciencias', en: 'Science', eu: 'Zientziak', la: 'Scientiae' },
  { es: 'Historia', en: 'History', eu: 'Historia', la: 'Historia' },
  { es: 'Arte', en: 'Art', eu: 'Artea', la: 'Ars' },
];

const tools = [
  { name: 'Canva', url: 'https://canva.com', domain: 'canva.com' },
  { name: 'GeoGebra', url: 'https://geogebra.org', domain: 'geogebra.org' },
  { name: 'Padlet', url: 'https://padlet.com', domain: 'padlet.com' },
  { name: 'Kahoot', url: 'https://kahoot.com', domain: 'kahoot.com' },
  { name: 'Quizizz', url: 'https://quizizz.com', domain: 'quizizz.com' },
  { name: 'Genially', url: 'https://genial.ly', domain: 'genial.ly' },
  { name: 'Mentimeter', url: 'https://mentimeter.com', domain: 'mentimeter.com' },
  { name: 'Google Classroom', url: 'https://classroom.google.com', domain: 'google.com' },
];

function generateExamples(cid, count, color) {
  const examples = [];
  for (let i = 1; i <= count; i++) {
    const level = levels[Math.floor(Math.random() * levels.length)];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const tool = tools[Math.floor(Math.random() * tools.length)];

    examples.push({
      id: `${cid}-${i}`,
      code: `${cid.replace('-', '.')}.${i}`,
      color: color,
      educationalLevel: level,
      curricularArea: area,
      content: {
        es: `Ejemplo ${i} para la consideración ${cid} en el área de ${area.es}. Aplicación práctica del principio en el nivel ${level.es}.`,
        en: `Example ${i} for consideration ${cid} in ${area.en}. Practical application of the principle in ${level.en}.`,
        eu: `${cid} kontuan hartzeko ${i}. adibidea ${area.eu} arloan. Printzipioaren aplikazio praktikoa ${level.eu} mailan.`,
        la: `Exemplum ${i} pro consideratione ${cid} in area ${area.la}. Applicatio practica principii in gradu ${level.la}.`,
      },
      webTools: [
        {
          name: tool.name,
          url: tool.url,
          logo: `https://logo.clearbit.com/${tool.domain}`,
        },
      ],
    });
  }
  return examples;
}

for (let i = 1; i <= guidelinesCount; i++) {
  const cids = considerationsPerGuideline[i];
  const color = guidelineColors[i];
  const guidelineData = {
    considerations: cids.map((cid) => ({
      considerationId: cid,
      examples: generateExamples(cid, 10, color),
    })),
  };

  fs.writeFileSync(
    path.join(__dirname, 'src/data/json/', `udl-guideline-${i}.json`),
    JSON.stringify(guidelineData, null, 2)
  );
}
console.log('All guideline files generated.');
