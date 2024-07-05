import { Client, LocalAuth } from 'whatsapp-web.js'
import customerService from '../Controllers/bot'
import { Server } from 'socket.io'

export var client: Client

export default function init(io: Server){

    client = new Client({
        authStrategy: new LocalAuth({ clientId: "teste" }),
        puppeteer: { args: ['--no-sandbox'] },
        webVersionCache: {
            type: "remote",
            remotePath: process.env.WWJSRemotePath || '',
        }
    })

    let qrMsg = false
    client.on('qr', async qr => {

        // console.log('QR CODE:')
        // console.log(qr)

        if(!qrMsg){

            qrMsg = true
            console.log('Precisa fazer conexão com QR Code.')

        }
    
        io.emit('qr', qr)
    
    })
    
    client.on('ready', () => console.log('Conectado'))
    
    client.on('auth_failure', () => console.log('Falha na Autenticacao'))
    
    client.on('authenticated', () => console.log('Autenticado'))

    client.on('disconnected', () => console.log('Disconnected'))
    
    client.on('message', customerService)

    // customerService({body: 'asd', id: {remote: 'ashdhasy'}})

    console.log('Initialized Bot.')
    client.initialize()

}