import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import init from './Bot'

dotenv.config({ path: '.env' })

const app = express()
const server = createServer(app)

const io = new Server(server)

app.use(express.json())
app.use(express.static(`${process.cwd()}/src/assets`))
app.use(express.static(`${process.cwd()}/src/Views`))

init(io)

app.get('/', (req, res) => res.sendFile(`${process.cwd()}/src/Views/configs.html`))

server.listen(process.env.PORT, () => console.log(`Server Online: /${process.env.PORT}`))