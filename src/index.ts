import https from 'https'
import bodyParser from 'body-parser'
import fs from 'fs'
import Rest from './lib/rest'
import { connectToolControllers } from './tools'
import Utils from './lib/utils'
import 'dotenv/config'

process.on('uncaughtException', (err) => console.log(err))
const { express, connectControllers, logRequest } = Rest
const { clr, log } = Utils

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8090
const options = {
  key: fs.readFileSync('crt/server-key.pem'),
  cert: fs.readFileSync('crt/server-crt.pem')
}

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

const logger = (req: any, res: any, next: any) => {
  logRequest(req, res)
  next()
}

app.all('*', logger)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9001')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
app.get('/', (req: any, res: any) => {
  res.send(`<h1>API Works ! ! !</h1>`)
})
connectControllers(app)
connectToolControllers(app)

const server = https.createServer(options, app).listen(port)
server.on('listening', () => {
  log(
    'Server running on port ' +
      port +
      '. Go to ' +
      clr('https://' + host + ':' + port + '/', '94')
  )
})
