const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const {client} = require('./Whatsapp-client')

const Router = express.Router();

Router.get('/login', (req, res) => {
     const pushname = client.info.pushname
    console.log(pushname)
    if(pushname){
        res.send({"message": "Already Logged In! "+pushname})
    }else{
        res.send({'message':'Not Fond'})
    }
});

// Export the router
module.exports = { Router};