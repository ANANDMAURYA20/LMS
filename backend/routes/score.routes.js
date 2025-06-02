import { Router } from 'express';
import { 
    saveScore, 
    getAllScores, 
    getUserScores 
} from '../controllers/score.controller.js';
import { 
    isLoggedIn, 
    authorisedRoles 
} from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/v1/scores
router.route('/')
    .post(isLoggedIn, saveScore);

router.route('/all')
    .get(isLoggedIn, authorisedRoles('ADMIN'), getAllScores);

router.route('/user/:userId?')
    .get(isLoggedIn, getUserScores);

export default router;


