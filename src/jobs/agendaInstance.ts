import Agenda from 'agenda'
import allDefinitions from './definitions'

const agenda = new Agenda({
    name: 'mail queue',
    db: {
        address: process.env.MONGODB_URL as string,
        collection: 'agendaJobs',
    },
    maxConcurrency: 20,
    processEvery: '1 minute'
})

//check if agenda has started
agenda
.on('ready', async () => { 
    await agenda.start()
    console.log('Agenda has started')
    //need to create the definitions(jobs) before
    allDefinitions(agenda)
})
.on('error', (err) => console.log('Agenda has not started', err))


export default agenda;