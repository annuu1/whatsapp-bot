const Router = require('express').Router();
const {client : Client} = require('./WhatsappAuth');

Router.get('/', (req, res)=>{
    res.send('index');
})

module.exports = Router