import { Router } from 'express';
import { registerController, loginController, refreshController, logoutController, sendResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema, resetPasswordSchema } from '../validation/authValidation.js';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmailController);
router.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);

export default router; 