const express = require('express')
const WaRouter = require('./routers/WhatsappSend')
const {Router : WaAuthRouter} = require('./routers/WhatsappAuth')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())
app.use('/wa', WaRouter)
app.use('/auth', WaAuthRouter)

app.listen(3000, () => {
    console.log('listening on port 3000!')
})