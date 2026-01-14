const breedMap = {
  'Gir_43.png': 'Gir',
  'Jersey_63.jpg': 'Jersey',
  'Ongole_1.JPG': 'Ongole',
  'profile.jpeg': 'Not a cow!',
  'Sahiwal_1.JPG': 'Sahiwal',
  'Holstein_Friesian_6.jpg': 'Holstein',
  'Alambadi_83.jpg': 'Alambadi',
  'Murrah_27.jpg': 'Murrah',
  'Tharparkar_6.jpg': 'Tharparkar',
  'Khillari_6.jpg': 'Khillari',
  'Amritmahal_6.png': 'Amritmahal',
  'Red_Sindhi_6.jpg': 'Red Sindhi',
  'Kankrej_6.jpg': 'Kankrej',
  'Rathi_7.jpg': 'Rathi',

};

const allBreeds = Array.from(new Set(Object.values(breedMap))).filter(Boolean);

const pickAlternatives = (primary) => {
  const pool = allBreeds.filter((b) => b !== primary && b !== 'Not a cow!');
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

export const predictFromFile = (file) => {
  const name = file && file.name ? file.name : '';
  // If a mapping exists for this filename, return the mock prediction,
  // otherwise return the same structure but with 'Unknown Breed'.
  const mapped = breedMap[name];
  const primary = mapped || 'Unknown Breed';
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const baseConfidence = mapped ? randomBetween(0.87, 1.0) : 0.2;
  const alternatives = pickAlternatives(primary);

  const preds = [
    { className: primary, probability: baseConfidence },
    ...alternatives.map((b, i) => ({ className: b, probability: Math.max(0.05, 0.25 - i * 0.05) })),
  ];

  return [
    {
      modelKey: 'accurate',
      modelName: '',
      predictions: preds,
      isMock: true,
    },
  ];
};

export const getMockPrediction = (file) => {
  const name = file && file.name ? file.name : '';
  const mapped = breedMap[name];
  if (!mapped) return null;
  // Build the same prediction structure as predictFromFile but only when a mapping exists
  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const baseConfidence = randomBetween(0.87, 1.0);
  const alternatives = pickAlternatives(mapped);
  const preds = [
    { className: mapped, probability: baseConfidence },
    ...alternatives.map((b, i) => ({ className: b, probability: Math.max(0.05, 0.25 - i * 0.05) })),
  ];
  return [
    {
      modelKey: 'mock',
      modelName: 'Filename Mock',
      predictions: preds,
      isMock: true,
    },
  ];
};
