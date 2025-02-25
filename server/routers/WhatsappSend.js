const Router = require('express').Router();
const {client} = require('./Whatsapp-client');
const {MessageMedia} = require('whatsapp-web.js')
const path = require('path')
const fs = require('fs')
const math = require('mathjs')

let messageQueue = [];
let isSending = false;


// Queue processing
let messageCount = 0; // Counter to track the number of messages sent

const processQueue = async () => {
  if (!isSending && messageQueue.length > 0) {
    isSending = true;
    const { number, message, resolve, reject } = messageQueue.shift();

    console.log(number, " - ", messageCount)

    // Unified error handling for media + message sending
    const media =  MessageMedia.fromFilePath(path.join(__dirname, './uploads/img.jpg'))
      client.sendMessage(`${number}@c.us`, media)
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