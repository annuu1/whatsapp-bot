const Router = require('express').Router();
const {client} = require('./WhatsappAuth');

Router.get('/', (req, res)=>{
    res.send('index');
})
Router.post('/send-bulk', (req, res)=>{
    console.log(req.body.numbers)
    console.log(typeof client)
    // res.send(Client)
})

module.exports = Router