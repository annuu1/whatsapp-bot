const express = require('express')
const WaRouter = require('./routers/WhatsappSend')
const {Router : WaAuthRouter} = require('./routers/WhatsappAuth')

const app = express()

app.use(express.json())
app.use('/whatsapp', WaRouter)
app.use('/auth', WaAuthRouter)

app.listen(3000, () => {
    console.log('listening on port 3000!')
})