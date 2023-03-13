import { Router } from 'express';
import { createUserController, loginUserController, logoutUserController, refreshTokenController } from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(createUserController)
router.route('/login').post(loginUserController)
router.route('/forgot-password').post()
router.route('/refresh').get(refreshTokenController)
router.route('/logout').get(logoutUserController)

export default router;