import { Router } from 'express';
import { syncService } from '../services/syncService.js';

const router = Router();

const handleSync = async (req, res, next) => {
  try {
    const result = await syncService.processSyncBatch(req.body || {});
    res.json(result);
  } catch (err) {
    next(err);
  }
};

router.post('/v1/sync', handleSync);
router.post('/sync', handleSync);

export default router;
