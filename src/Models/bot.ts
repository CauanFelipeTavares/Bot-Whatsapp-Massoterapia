import fs from 'fs'
import { StepParams } from '../Interfaces/bot'
import { client } from '../Bot'
import { Message } from 'whatsapp-web.js'

const basePath = `${process.cwd()}/src/Databases/`

export async function sendMessage(replaceWords: { [key: string]: string }[], customerID: string, stepParams: StepParams): Promise<Message | null> {
    
    let message = _getMessage(stepParams.file)
    replaceWords.forEach(replacedArg => {

        const [key, value] = Object.entries(replacedArg)[0]
        message = message.replace(`[${key}]`, value)

    })

    const separatedMessages = message.split('[SEPARATE-MESSAGE]')
    let msg = null

    for(let i = 0; i < separatedMessages.length; i++){

        msg = await client.sendMessage(customerID, separatedMessages[i].trim())
        await new Promise(resolve => setTimeout(resolve, 1500))
        
    }

    return msg

}

export async function sendRememberOptionsMessage(customerID: string, optionsMsgId?: string): Promise<Message>{
    
    const message = _getMessage('rememberOptions.txt')

    const msg = await client.sendMessage(customerID, message.trim(), { quotedMessageId: optionsMsgId })
    await new Promise(resolve => setTimeout(resolve, 1500))

    return msg

}

export function _getMessage(file: string){
    
    const message = fs.readFileSync(`${basePath}${file}`, { encoding: 'utf8' })

    return message

}