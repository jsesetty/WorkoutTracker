import { Router } from 'express';
import { catalogService } from '../services/catalogService.js';

const router = Router();

const handleGetCatalog = async (req, res, next) => {
  try {
    const catalog = await catalogService.getCatalog();
    res.json(catalog);
  } catch (err) {
    next(err);
  }
};

router.get('/v1/catalog', handleGetCatalog);
router.get('/catalog', handleGetCatalog);

export default router;
