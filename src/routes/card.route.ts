import { Router } from 'express';
import { createCardHandler, deleteCardHandler, getCardHandler, getCardsHandler } from '../controllers/card.controller';

const router = Router();

router.route('/').post(createCardHandler).get(getCardsHandler)
router.route('/:id').get(getCardHandler).patch().delete(deleteCardHandler)

export default router;