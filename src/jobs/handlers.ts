import { Job } from "agenda"
import { sendMailHandler } from "./mailHandlers"

const jobHandlers = {
    sendMailOnDueDate: async (job: Job) => { 
    
        console.log(`Running at: ${Date()}`)
        const invoiceId = job.attrs.data.id 

        await sendMailHandler(invoiceId, false)

        console.log('job done')
    }
}


export default jobHandlers;