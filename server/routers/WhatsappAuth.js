const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const Router = express.Router();

let client;

Router.get('/login', (req, res) => {
    if (!client) {
        client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
          });
          

        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('Client is ready!');
            res.status(200).json({"message" : 'Client is ready!'});
        });

        client.initialize();
    } else {
        res.send('Client is already initialized. Please scan the QR code in the terminal.');
    }
});

// Export the router
module.exports = {Router, client};