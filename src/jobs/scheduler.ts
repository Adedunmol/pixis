import agenda from "./agendaInstance";
import { Card } from "@prisma/client";


const scheduler = {
    dueDateMail: async (date: Date, card: Card) => {
        const cardId = card.id
        await agenda.schedule(date, 'send-mail-on-due-date', { cardId })
    }
}

export default scheduler