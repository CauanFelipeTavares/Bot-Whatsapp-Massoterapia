import { sendMessage, sendRememberOptionsMessage } from '../Models/bot'
import { Customer, MessageParams, StepParams } from '../Interfaces/bot'
import { client } from '../Bot'

const customers: { [key: string]: Customer } = {}

const stepsParams: { [key: string]: StepParams } = {
    0: {
        file: 'welcome.txt'
    },
    0.1: {
        file: 'requireName.txt'
    },
    0.2: {
        file: 'niceToMeet.txt'
    },
    1: {
        file: 'options.txt'
    },
    1.9: {
        file: 'optionTalkWithOwner.txt'
    },
    1.99: {
        file: 'optionNotFound.txt'
    },
    2: {
        file: 'optionMarkMassage.txt'
    },
    3: {
        file: 'optionAboutWork.txt'
    },
    4: {
        file: 'optionAboutEmployes.txt'
    }
}

export default async function customerService(params: MessageParams){
    
    const msg = params.body
    const customerID = params.id.remote
    const customerName = params._data.notifyName || ''

    console.log(`${customerID}: ${msg}`)

    if(!
        [
            '5517992318569@c.us', // Myself
            '5517997311533@c.us', // Marcos
        ].includes(customerID)) return null // For Only Test

    if(!customers[customerID]) await _welcomeStep(customerID, customerName, msg)
    else if(customers[customerID].step == 0.1) await _niceToMeet(customerID, msg)
    else if(customers[customerID].step == 1) await _redirectToOption(customerID, msg) 

    console.log({ step: customers[customerID].step })
    
}

async function _welcomeStep(customerID: string, customerName: string, msg: string) {
    
    customers[customerID] = {
        id: customerID,
        step: 0,
        name: customerName,
    }

    await sendMessage([
        { name: customerName }
    ], customerID, stepsParams[0])
    if(!customerName){

        customers[customerID].step = 0.1
        await sendMessage([], customerID, stepsParams[0.1])

    }else await _options(customerID)

}

async function _niceToMeet(customerID: string, msg: string){

    const name = msg

    customers[customerID].name = name
    
    await sendMessage([
        { name }
    ], customerID, stepsParams[0.2])

    await _options(customerID)

}

async function _options(customerID: string){

    customers[customerID].step = 1
    
    const msg = await sendMessage([], customerID, stepsParams[1])
    if(msg?.id) customers[customerID].optionsMsgId = msg.id._serialized

}

async function _redirectToOption(customerID: string, msg: string){

    switch(parseInt(msg)){
        case 1: return _markMassage(customerID)
        case 2: return _aboutWork(customerID)
        case 3: return _aboutEmployes(customerID)
        case 9: return _optionTalkWithOwner(customerID)
        default: return _optionNotFound(customerID)
    }

}

async function _optionTalkWithOwner(customerID: string){

    // await client.
    await sendMessage([], customerID, stepsParams[1.9])
    
}

async function _optionNotFound(customerID: string){

    await sendMessage([], customerID, stepsParams[1.99])
    await _options(customerID)
    
}


async function _markMassage(customerID: string){

    await sendMessage([], customerID, stepsParams[2])
    await _options(customerID)
    
}

async function _aboutWork(customerID: string){

    await sendMessage([], customerID, stepsParams[3])
    await sendRememberOptionsMessage(customerID, customers[customerID].optionsMsgId)
    
}

async function _aboutEmployes(customerID: string){

    await sendMessage([], customerID, stepsParams[4])
    await sendRememberOptionsMessage(customerID, customers[customerID].optionsMsgId)
    
}