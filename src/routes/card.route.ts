import { Router } from 'express';
import { createCardHandler } from '../controllers/card.controller';

const router = Router();

router.route('/').post(createCardHandler).get()
router.route('/:id').get().patch().delete()

export default router;