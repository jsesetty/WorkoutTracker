import { Router } from 'express';
import { foodBarcodeService } from '../services/foodBarcodeService.js';

const router = Router();

const handleBarcodeLookup = async (req, res) => {
  try {
    const result = await foodBarcodeService.lookupBarcode(req.params.barcode);
    res.json(result);
  } catch (err) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      found: false,
      error: err.message || 'Internal error during barcode lookup'
    });
  }
};

router.get('/v1/foods/barcode/:barcode', handleBarcodeLookup);
router.get('/foods/barcode/:barcode', handleBarcodeLookup);

export default router;
