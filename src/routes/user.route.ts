import { Router } from 'express';

const router = Router();

router.route('/:id/').patch().get()
router.route('/change-password').post()


export default router;