import { Router } from 'express';
import workoutRoutes from './workoutRoutes.js';
import nutritionRoutes from './nutritionRoutes.js';
import barcodeRoutes from './barcodeRoutes.js';
import catalogRoutes from './catalogRoutes.js';
import syncRoutes from './syncRoutes.js';
import aiRoutes from './aiRoutes.js';

const apiRouter = Router();

// Mount domain routes
apiRouter.use(workoutRoutes);
apiRouter.use(nutritionRoutes);
apiRouter.use(barcodeRoutes);
apiRouter.use(catalogRoutes);
apiRouter.use(syncRoutes);
apiRouter.use(aiRoutes);

export default apiRouter;
