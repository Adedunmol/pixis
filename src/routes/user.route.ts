import { Router } from 'express';
import { changePasswordController, getUserController } from '../controllers/user.controller';

const router = Router();

router.route('/:id/').patch().get(getUserController)
router.route('/change-password').post(changePasswordController)


export default router;