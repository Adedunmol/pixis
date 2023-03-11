import { Router } from 'express';
import { createUserController } from '../controllers/auth.controller';

const router = Router();

router.route('/register').post(createUserController)
router.route('/login').post()
router.route('/forgot-password').post()
router.route('/change-password').post()

export default router;