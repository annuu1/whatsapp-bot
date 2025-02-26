const Router = require('express').Router();
const {client} = require('./Whatsapp-client');
const {MessageMedia, Buttons} = require('whatsapp-web.js')
const path = require('path')
const fs = require('fs')
const math = require('mathjs')
const {delay, getMimeType} = require('./Utils')

let messageQueue = [];
let isSending = false;


// Queue processing
let messageCount = 0; // Counter to track the number of messages sent

const processQueue = async () => {
  if (!isSending && messageQueue.length > 0) {
    isSending = true;
    const { number, message= '', resolve, reject } = messageQueue.shift();

    console.log(number, " - ", messageCount)

    const files = fs.readdirSync(__dirname+'/uploads')
    const filePaths = files.map((file)=> __dirname+'/uploads/'+file)

    for(const filePath of filePaths){
      const mimeType = getMimeType(filePath);
      const media = MessageMedia.fromFilePath(filePath, mimeType)
      // client.sendMessage(`${number}@c.us`, media, { caption: "caption" })
      client.sendMessage(`${number}@c.us`, media)
      .then(()=>{console.log('File sent:', filePath);})
      .catch(err => {if (mimeType === 'video/mp4') {
        console.error('Error sending MP4 file:', err, 'File path:', filePath);
      } else {
        console.error('Error sending file:', err, 'File path:', filePath);
      }})

      console.log('File sent..')
      await delay(3000, 7000)
    }

    // Unified error handling for media + message sending
      client.sendMessage(`${number}@c.us`, message)
      .then(resolve)  // Resolve individual promise
      .catch(reject)  // Reject individual promise
      .finally(() => {
        messageCount++;
        
        // Delay logic
        const delay = messageCount >= 50 ? 
          Math.random() * 20 + 30 :  // 30-50s after 50 messages
          math.random(5, 14) * 1000;

        messageCount = messageCount >= 50 ? 0 : messageCount;
        console.log("delay : ", delay);
        
        
        setTimeout(() => {
          isSending = false;
          processQueue();
        }, delay);
      });
  }
};
 
Router.post('/send-bulk', async(req, res)=>{
    try {
        const { numbers } = req.body;
        
        // Create promises FIRST
        const promises = numbers.map(number => new Promise((resolve, reject) => {
          messageQueue.push({ number, resolve, reject });
        }));
    
        // Start processing
        processQueue();
    
        // Wait for ALL promises to settle
        const results = await Promise.allSettled(promises);
    
        // Process results
        const failedNumbers = results
          .filter((r, index) => r.status === 'rejected')
          .map((r, index) => numbers[index]);
    
        res.json({
          total: numbers.length,
          successful: numbers.length - failedNumbers.length,
          failed: failedNumbers.length,
          failedNumbers
        });
    
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
})

module.exports = Router