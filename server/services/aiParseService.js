import { getCatalog } from '../storage/jsonStorage.js';

export function trigramSimilarity(str1, str2) {
  const s1 = (str1 || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const s2 = (str2 || '').toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.90;

  const getTrigrams = (str) => {
    const padded = `  ${str} `;
    const trigrams = new Set();
    for (let i = 0; i < padded.length - 2; i++) {
      trigrams.add(padded.slice(i, i + 3));
    }
    return trigrams;
  };

  const t1 = getTrigrams(s1);
  const t2 = getTrigrams(s2);

  let intersection = 0;
  for (const t of t1) {
    if (t2.has(t)) intersection++;
  }

  const union = t1.size + t2.size - intersection;
  return union === 0 ? 0 : Number((intersection / union).toFixed(2));
}

export function resolveCatalogMatch(rawName, catalog = []) {
  const scored = catalog.map(cat => ({
    catalogId: cat.id,
    name: cat.name,
    muscleGroup: cat.muscleGroup,
    confidenceScore: trigramSimilarity(rawName, cat.name),
  })).sort((a, b) => b.confidenceScore - a.confidenceScore);

  const best = scored[0] || null;
  const isHighConfidence = best && best.confidenceScore >= 0.85;

  return {
    matchedCatalogId: best ? best.catalogId : undefined,
    matchedCatalogName: best ? best.name : undefined,
    confidenceScore: best ? best.confidenceScore : 0.5,
    needsUserConfirmation: !isHighConfidence,
    suggestedCandidates: scored.slice(0, 3)
  };
}

export function parseNaturalLanguageWorkout(rawTranscript, catalog = []) {
  const statements = rawTranscript
    .split(/(?:\r?\n|,|\bthen\b|\band\b|;)+/i)
    .map(s => s.trim())
    .filter(Boolean);

  const parsedExercises = [];

  for (const statement of statements) {
    const setsRepsMatch = statement.match(/(\d+)\s*(?:sets?(?:\s*of|\s*x)?)\s*(\d+)?/i) || statement.match(/(\d+)\s*x\s*(\d+)/i);
    const weightMatch = statement.match(/(?:at|with|@)?\s*(\d+(?:\.\d+)?)\s*(?:kg|lbs?|pounds?)/i);

    let rawName = statement;
    let setCount = 3;
    let reps = 10;
    let weightKg = undefined;
    let distanceMeters = undefined;
    let durationSeconds = undefined;
    let metrics = undefined;

    if (/row(?:ed)?/i.test(statement)) {
      rawName = 'Concept2 Rowing Ergometer';
      const mMatch = statement.match(/(\d+)\s*m/i);
      if (mMatch) distanceMeters = parseInt(mMatch[1], 10);
      const timeMatch = statement.match(/(\d+):(\d+)/);
      if (timeMatch) {
        durationSeconds = parseInt(timeMatch[1], 10) * 60 + parseInt(timeMatch[2], 10);
      }
      setCount = 1;
      metrics = {
        damperSetting: 5,
        split500mPace: durationSeconds && distanceMeters ? `${Math.floor((durationSeconds / (distanceMeters / 500)) / 60)}:${Math.floor((durationSeconds / (distanceMeters / 500)) % 60).toString().padStart(2, '0')}` : '1:50.0'
      };
    } else if (/wall\s*balls?/i.test(statement)) {
      rawName = 'Wall Balls';
      metrics = { resistanceLevel: 20 };
    } else if (/bench(?:\s*press)?/i.test(statement)) {
      rawName = 'Barbell Flat Bench Press';
    } else if (/squat/i.test(statement)) {
      rawName = 'Barbell Back Squat';
    } else if (/deadlift/i.test(statement)) {
      rawName = 'Conventional Barbell Deadlift';
    } else if (/overhead\s*press|military/i.test(statement)) {
      rawName = 'Standing Overhead Press';
    } else if (/pull-?up/i.test(statement)) {
      rawName = 'Overhand Pull-Up';
    } else if (/curl/i.test(statement)) {
      rawName = 'Incline Dumbbell Bicep Curl';
    } else {
      rawName = statement
        .replace(/(\d+)\s*(?:sets?|x)\s*(\d+)?/gi, '')
        .replace(/(?:at|with|@)?\s*\d+(?:\.\d+)?\s*(?:kg|lbs?)/gi, '')
        .trim();
    }

    if (setsRepsMatch) {
      setCount = parseInt(setsRepsMatch[1], 10) || 3;
      if (setsRepsMatch[2]) reps = parseInt(setsRepsMatch[2], 10);
    }
    if (weightMatch) {
      let val = parseFloat(weightMatch[1]);
      if (/lbs?|pounds?/i.test(weightMatch[0])) val = Math.round(val * 0.453592 * 10) / 10;
      weightKg = val;
    }

    const grounded = resolveCatalogMatch(rawName, catalog);

    const sets = Array.from({ length: setCount }, (_, idx) => ({
      setIndex: idx + 1,
      reps,
      weightKg,
      distanceMeters,
      durationSeconds,
      metrics
    }));

    parsedExercises.push({
      rawInputString: statement,
      matchedCatalogId: grounded.matchedCatalogId,
      matchedCatalogName: grounded.matchedCatalogName,
      confidenceScore: grounded.confidenceScore,
      needsUserConfirmation: grounded.needsUserConfirmation,
      suggestedCandidates: grounded.suggestedCandidates,
      sets
    });
  }

  const overallConfidence = parsedExercises.length > 0
    ? Number((parsedExercises.reduce((acc, e) => acc + e.confidenceScore, 0) / parsedExercises.length).toFixed(2))
    : 0.9;

  return {
    extractedTitle: `Session: ${parsedExercises.map(e => e.matchedCatalogName || e.rawInputString).slice(0, 2).join(' + ')}`,
    exercises: parsedExercises,
    overallConfidence
  };
}

export class AiParseService {
  /**
   * Parse voice / natural language workout transcript into structured exercises
   */
  async parseWorkoutTranscript(rawTranscript) {
    if (!rawTranscript || typeof rawTranscript !== 'string' || rawTranscript.trim().length < 3) {
      const error = new Error('Workout transcript too short');
      error.status = 400;
      throw error;
    }

    const catalog = await getCatalog();
    return parseNaturalLanguageWorkout(rawTranscript, catalog);
  }
}

export const aiParseService = new AiParseService();
