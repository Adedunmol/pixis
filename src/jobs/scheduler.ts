import agenda from "./agendaInstance"


const scheduler = {
    dueDateMail: async (date: Date) => {

        await agenda.schedule(date, 'send-mail-on-due-date', {})
    }
}

export default scheduler