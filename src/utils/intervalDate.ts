import { Card } from '@prisma/client';
import dayjs from 'dayjs';

export const nextIntervalDate = (card: Card) => {
    const now = dayjs()

    const nextDateInDays = now.add(card.nextInterval, 'days')

    return nextDateInDays.format()
}