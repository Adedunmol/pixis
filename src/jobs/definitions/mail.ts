import jobHandlers from '../handlers'

const mailDefinition = async (agenda: any) => {
    agenda.define('send-mail-on-due-date', jobHandlers.sendMail)
}

export default mailDefinition;