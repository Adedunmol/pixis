import agenda from './agendaInstance';

export const sendMailHandler = async (invoiceId: string, recurrent: boolean) => {
    const card = undefined
        
    if (!card) {

        // const job = await agenda.cancel({ 'data.body.id': card?._id })

        console.log('cancelling job')
        return;
    }
}