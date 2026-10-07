import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';
import { optionalAuthToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', optionalAuthToken, notificationController.getUserNotifications);
router.patch('/:id/read', optionalAuthToken, notificationController.markAsRead);
router.patch('/read-all', optionalAuthToken, notificationController.markAllAsRead);
export default router;
