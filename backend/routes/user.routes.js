import { Router } from "express";

const router = Router();
import { register, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser,getAllUsers, updateUserByAdmin, verifyEmail, resendVerificationEmail } from '../controllers/user.controller.js';
import { isLoggedIn } from "../middleware/auth.middleware.js";
import upload from '../middleware/multer.middleware.js'

router.post('/register', upload.single("avatar"), register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/getuser',getAllUsers);
router.get('/updateuser',updateUserByAdmin);
router.post('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

router.get('/me', isLoggedIn, getProfile);
router.post('/reset', forgotPassword);
router.post('/reset/:resetToken', resetPassword);
router.post('/change-password', isLoggedIn, changePassword);
router.post('/update/:id', isLoggedIn, upload.single("avatar"), updateUser);

export default router;