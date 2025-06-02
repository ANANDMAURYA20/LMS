import { Router } from 'express';
import { generateQuestions, analyzeStudentProgress, chatWithAI } from '../controllers/ai.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/generate-questions', generateQuestions);
router.get('/analyze-progress', isLoggedIn, analyzeStudentProgress);
router.post('/chat', isLoggedIn, chatWithAI);

export default router;




