import { Router } from 'express';
import { aiParseService } from '../services/aiParseService.js';

const router = Router();

const handleParseWorkout = async (req, res, next) => {
  try {
    const { rawTranscript } = req.body || {};
    const result = await aiParseService.parseWorkoutTranscript(rawTranscript);
    res.json(result);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
};

router.post('/v1/ai/parse-workout', handleParseWorkout);
router.post('/ai/parse-workout', handleParseWorkout);

export default router;
