const Router = require('express').Router();
const {client : Client} = require('./WhatsappAuth');

Router.get('/', (req, res)=>{
    res.send('index');
})
Router.post('/send-bulk', (req, res)=>{
    res.send('Message sent successfully');
})

module.exports = Router