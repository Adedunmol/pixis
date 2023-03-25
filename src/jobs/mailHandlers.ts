import { prisma } from '../config/dbConn';
import agenda from './agendaInstance';
import sendMail from '../utils/mail';

export const sendMailHandler = async (cardId: string) => {
    const card = await prisma.card.findFirst({
        where: {
            id: cardId
        },
        include: {
            author: true
        }
    })
        
    if (!card) {

        const job = await agenda.cancel({ 'data.body.id': cardId })

        console.log('cancelling job')
        return;
    }

    const user = card.author

    const subject = `Review this item`
    const text = `Please check the link below:`
    const link = `$`
    await sendMail(user.email, subject, text, 'review.hbs', link, user)
}