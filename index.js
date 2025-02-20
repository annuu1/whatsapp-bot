const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const io = require('socket.io-client');

// Create client instance
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Connect to backend
const socket = io('http://localhost:5000');

// Generate QR code
client.on('qr', qr => {
  logger.info('QR code received');
  qrcode.generate(qr, { small: true });
  socket.emit('qr', qr); // Send QR code to frontend
});

// When authenticated
client.on('authenticated', () => {
  console.log('Authenticated!');
  socket.emit('authenticated');
});

// When ready
client.on('ready', () => {
  console.log('Client is ready!');
  socket.emit('ready');
});

// Message handler
client.on('message', async msg => {
  if (msg.body === '!ping') {
    msg.reply('pong');
  }
  // Send message to frontend
  socket.emit('message', {
    from: msg.from,
    body: msg.body,
    timestamp: msg.timestamp
  });
});

// Handle send message requests from frontend
socket.on('sendMessage', async ({ to, message }) => {
  try {
    await client.sendMessage(to, message);
    socket.emit('messageSent', { to, message });
  } catch (error) {
    socket.emit('messageError', { error: error.message });
  }
});

// Start client
client.initialize();
