const express = require('express')
const WaRouter = require('./routers/WhatsappSend')
const {Router : WaAuthRouter} = require('./routers/WhatsappAuth')
const cors = require('cors')

const app = express()
// const corsOptions = {
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   preflightContinue: false,
//   optionsSuccessStatus: 200,
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   exposedHeaders: ['Content-Type', 'Authorization']
// }

app.use(cors())

app.use(express.json())
app.use('/whatsapp', WaRouter)
app.use('/auth', WaAuthRouter)

app.listen(3000, () => {
    console.log('listening on port 3000!')
})