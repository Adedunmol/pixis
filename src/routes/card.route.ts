import { Router } from 'express';
import { createCardHandler, getCardHandler, getCardsHandler } from '../controllers/card.controller';

const router = Router();

router.route('/').post(createCardHandler).get(getCardsHandler)
router.route('/:id').get(getCardHandler).patch().delete()

export default router;