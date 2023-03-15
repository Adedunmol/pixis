import { Router } from 'express';
import { changePasswordController, getUserController, updateUserController, uploadImageController } from '../controllers/user.controller';
import { upload } from '../middlewares/multerUpload';

const router = Router();

router.route('/:id/').patch(updateUserController).get(getUserController)
router.route('/change-password').post(changePasswordController)
router.route('/:id/upload').post(upload.single('image'), uploadImageController)

export default router;