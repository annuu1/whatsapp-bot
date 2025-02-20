const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create client instance
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Generate QR code
client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

// When authenticated
client.on('authenticated', () => {
  console.log('Authenticated!');
});

// When ready
client.on('ready', () => {
  console.log('Client is ready!');
});

// Message handler
client.on('message', async msg => {
  if (msg.body === '!ping') {
    msg.reply('pong');
  }
});

// Start client
client.initialize();
