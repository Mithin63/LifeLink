import { Router } from 'express';
import { matchController } from '../controllers/matchController.js';
import { optionalAuthToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/requests/:id/matches', optionalAuthToken, matchController.getMatchesByRequest);
router.post('/requests/:id/match', optionalAuthToken, matchController.runMatching);
router.post('/matches/:id/contact', optionalAuthToken, matchController.contactDonor);
router.patch('/matches/:id/status', optionalAuthToken, matchController.updateMatchStatus);
export default router;
