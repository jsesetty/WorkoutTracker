import { getFoods, saveFoods } from '../storage/jsonStorage.js';

export const ADDITIVES_DATABASE = {
  e250: { code: 'E250', name: 'Sodium Nitrite', risk: 'Hazardous', description: 'Preservative with carcinogenic nitrosamine risk' },
  e129: { code: 'E129', name: 'Allura Red AC (Red 40)', risk: 'Hazardous', description: 'Azo dye linked to hyperactivity and sensitivity' },
  e211: { code: 'E211', name: 'Sodium Benzoate', risk: 'Hazardous', description: 'Preservative that can form benzene when combined with Vitamin C' },
  e951: { code: 'E951', name: 'Aspartame', risk: 'Hazardous', description: 'Synthetic sweetener with possible neurological effects' },
  e950: { code: 'E950', name: 'Acesulfame K', risk: 'Moderate', description: 'Artificial sweetener' },
  e955: { code: 'E955', name: 'Sucralose', risk: 'Moderate', description: 'Artificial organochlorine sweetener' },
  e338: { code: 'E338', name: 'Phosphoric Acid', risk: 'Moderate', description: 'Acidifier that reduces bone mineral density' },
  e621: { code: 'E621', name: 'Monosodium Glutamate (MSG)', risk: 'Moderate', description: 'Synthetic flavor enhancer' },
  e150d: { code: 'E150d', name: 'Ammonia Caramel', risk: 'Moderate', description: 'Colorant with 4-MEI residue' },
  e150c: { code: 'E150c', name: 'Ammonia Caramel', risk: 'Moderate', description: 'Colorant with potential immune suppression' },
  e471: { code: 'E471', name: 'Mono- and diglycerides', risk: 'Low', description: 'Synthetic emulsifier' },
  e407: { code: 'E407', name: 'Carrageenan', risk: 'Moderate', description: 'Thickener linked to intestinal inflammation' },
  e300: { code: 'E300', name: 'Ascorbic Acid (Vitamin C)', risk: 'None', description: 'Natural antioxidant' },
  e322: { code: 'E322', name: 'Lecithins', risk: 'None', description: 'Natural emulsifier from soy or sunflower' },
  e960: { code: 'E960', name: 'Steviol glycosides', risk: 'None', description: 'Natural plant extract sweetener' },
  e415: { code: 'E415', name: 'Xanthan Gum', risk: 'Low', description: 'Natural fermentation stabilizer' },
  e412: { code: 'E412', name: 'Guar Gum', risk: 'Low', description: 'Plant seed thickener' },
};

export function calculateYukaScore(nutriscoreGrade, additives, isOrganic, calories = 0, protein = 0) {
  let nutriBase = 65;
  if (nutriscoreGrade) {
    const grade = String(nutriscoreGrade).toLowerCase();
    if (grade === 'a') nutriBase = 100;
    else if (grade === 'b') nutriBase = 80;
    else if (grade === 'c') nutriBase = 60;
    else if (grade === 'd') nutriBase = 40;
    else if (grade === 'e') nutriBase = 20;
  } else {
    if (protein >= 20 && calories < 250) nutriBase = 85;
    else if (protein >= 10 && calories < 200) nutriBase = 75;
    else if (calories > 350) nutriBase = 45;
  }

  let additiveBase = 100;
  for (const add of additives) {
    if (add.risk === 'Hazardous') additiveBase -= 30;
    else if (add.risk === 'Moderate') additiveBase -= 15;
    else if (add.risk === 'Low') additiveBase -= 5;
  }
  additiveBase = Math.max(0, additiveBase);

  const organicBonus = isOrganic ? 100 : 0;
  const score = Math.min(100, Math.max(1, Math.round(
    (nutriBase * 0.60) + (additiveBase * 0.30) + (organicBonus * 0.10)
  )));

  let rating = 'Mediocre';
  if (score >= 75) rating = 'Excellent';
  else if (score >= 50) rating = 'Good';
  else if (score >= 25) rating = 'Mediocre';
  else rating = 'Bad';

  return { score, rating };
}

export class FoodBarcodeService {
  /**
   * Look up product info by barcode via local cache, then Open Food Facts API
   */
  async lookupBarcode(rawBarcode) {
    if (!rawBarcode || typeof rawBarcode !== 'string') {
      const error = new Error('Valid barcode is required');
      error.status = 400;
      error.found = false;
      throw error;
    }

    const barcode = rawBarcode.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!barcode || barcode.length < 5 || barcode.length > 20) {
      const error = new Error('Barcode format invalid (must be 5-20 characters)');
      error.status = 400;
      error.found = false;
      throw error;
    }

    const foods = await getFoods();
    const existing = foods.find(f => f.barcode === barcode);
    if (existing) {
      return {
        found: true,
        source: 'local_cache',
        product: existing
      };
    }

    // Miss in local cache: fetch from Open Food Facts API
    try {
      const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
      const offResponse = await fetch(offUrl, {
        headers: {
          'User-Agent': 'IronPulseWorkoutTracker/1.0 (contact@ironpulse.fit)'
        },
        signal: AbortSignal.timeout(4000)
      });

      if (offResponse.ok) {
        const offData = await offResponse.json();
        if (offData && offData.status === 1 && offData.product) {
          const p = offData.product;
          const nutriments = p.nutriments || {};

          const name = p.product_name || p.product_name_en || p.generic_name || `Scanned Item (${barcode})`;
          const brand = p.brands || 'Open Food Facts';
          const imageUrl = p.image_front_small_url || p.image_url || undefined;
          const servingSize = p.serving_size || '100g';

          const calories = Math.round(Number(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : 0)) || 0);
          const protein = Math.round((Number(nutriments.proteins_100g || nutriments.proteins || 0)) * 10) / 10;
          const carbs = Math.round((Number(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0)) * 10) / 10;
          const fat = Math.round((Number(nutriments.fat_100g || nutriments.fat || 0)) * 10) / 10;

          const isOrganic = Array.isArray(p.labels_tags) && p.labels_tags.some(tag => tag.includes('organic'));
          const novaGroup = [1, 2, 3, 4].includes(p.nova_group) ? p.nova_group : (isOrganic ? 1 : 2);

          // Parse additives
          const additivesTags = Array.isArray(p.additives_tags) ? p.additives_tags : [];
          const resolvedAdditives = additivesTags.map(tag => {
            const cleanCode = tag.replace(/^en:/, '').toLowerCase();
            const matched = ADDITIVES_DATABASE[cleanCode];
            if (matched) return matched;
            return {
              code: cleanCode.toUpperCase(),
              name: cleanCode.toUpperCase(),
              risk: 'Low',
              description: 'Food additive recorded in Open Food Facts'
            };
          });

          const { score, rating } = calculateYukaScore(p.nutriscore_grade, resolvedAdditives, isOrganic, calories, protein);

          const newFood = {
            id: 'food-off-' + barcode,
            name: name.trim(),
            brand: brand.trim(),
            barcode,
            imageUrl,
            calories,
            protein,
            carbs,
            fat,
            servingSize,
            yukaScore: score,
            yukaRating: rating,
            additives: resolvedAdditives,
            novaGroup,
            isOrganic
          };

          // Cache in foods list for instant future lookup
          foods.unshift(newFood);
          await saveFoods(foods);

          return {
            found: true,
            source: 'open_food_facts',
            product: newFood
          };
        }
      }
    } catch (fetchErr) {
      console.warn('Open Food Facts API fetch timeout or error:', fetchErr.message);
    }

    const notFoundError = new Error(`Food product with barcode ${barcode} not found in Open Food Facts or local database.`);
    notFoundError.status = 404;
    notFoundError.found = false;
    throw notFoundError;
  }
}

export const foodBarcodeService = new FoodBarcodeService();
