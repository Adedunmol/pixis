import { Router } from 'express';

const router = Router();

router.route('/register').post()
router.route('/login').post()
router.route('/forgot-password').post()
router.route('/change-password').post()

export default router;