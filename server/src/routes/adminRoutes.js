import { Router } from 'express';
import { adminController } from '../controllers/adminController.js';
import { optionalAuthToken } from '../middleware/authMiddleware.js';
const router = Router();
// Allow easy public/demo inspection and authenticated usage
router.get('/statistics', optionalAuthToken, adminController.getStatistics);
router.get('/users', optionalAuthToken, adminController.getUsers);
router.delete('/users/:id', optionalAuthToken, adminController.deleteUser);
router.patch('/donors/:id/verify', optionalAuthToken, adminController.verifyDonor);
router.get('/reports', optionalAuthToken, adminController.getReports);
export default router;
