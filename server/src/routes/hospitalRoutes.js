import { Router } from 'express';
import { hospitalController } from '../controllers/hospitalController.js';
import { optionalAuthToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', optionalAuthToken, hospitalController.getAllHospitals);
router.get('/:id', optionalAuthToken, hospitalController.getHospitalById);
router.put('/:id', optionalAuthToken, hospitalController.updateHospital);
export default router;
