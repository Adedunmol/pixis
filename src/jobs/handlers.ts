import { Job } from "agenda"
import { sendMailHandler } from "./mailHandlers"

const jobHandlers = {
    sendMail: async (job: Job) => { 
    
        console.log(`Running at: ${Date()}`)

        const { cardId } = job.attrs.data

        await sendMailHandler(cardId)

        console.log('job done')
    }
}


export default jobHandlers;