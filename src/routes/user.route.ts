import { Router } from 'express';
import { changePasswordController } from '../controllers/user.controller';

const router = Router();

router.route('/:id/').patch().get()
router.route('/change-password').post(changePasswordController)


export default router;