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
    let { number, message= '', resolve, reject } = messageQueue.shift();

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

      // console.log('File sent..')
      await delay(3000, 7000)
    }

    message = `4 Spacious Balconies 
Big Size 3bhk Flats From 57 Lac 
Prime Location |Near D-mart, Akshaya Patra Mahal Road, jagatpura Jaipur 

https://www.instagram.com/therabbanigroup?igsh=NHpqd25neDc4N2k%3D&utm_source=qr

✔️ Loan Facility: Up To 90% Loanable From All Major Banks 🏦
✔️ Approvals: RERA&JDA
Approved

🌟 Exclusive Amenities For A Premium Lifestyle:
🏋️ State-of-the-art Gymnasium 
🕺 Spacious Community Hall
🚘 Dedicated Car Parking 
👮‍♂️ 24x7 Security With Cctv Surveillance 
🔋 Power Backup (Tata Generator) 
🪪 Smart Card Entrance 
💳 High-speed Lifts (02) 
🎛️ Inverter Fittings & Rr Switches 
🛀 Premium Cera Bath Fittings 
⏲️ Fully Modular Kitchen 
🌅 Private Terrace (Optional) 
🌳 Landscaped Garden & Kids’ Play Area 
🧘‍♀️ Yoga & Meditation Hall 

📍 Limited Units Available – Book Your Visit Today!

📞 Call/whatsapp Us Now:
📲 **
https://maps.google.com/?q=26.795807,75.874054

⭐️𝗬𝗼𝘂𝗿 𝗗𝗿𝗲𝗮𝗺 𝗛𝗼𝗺𝗲 𝗔𝘄𝗮𝗶𝘁𝘀!⭐️
Don’t Miss Out On This Incredible Opportunity To Own A Luxurious Flat In One Of Jaipur’s Most Sought-after Locations. Schedule A Visit Now!`

    // Unified error handling for media + message sending
      client.sendMessage(`${number}@c.us`, message)
      .then(resolve)  // Resolve individual promise
      .catch(reject)  // Reject individual promise
      .finally(() => {
        messageCount++;
        
        // Delay logic
        const delay = messageCount >= 50 ? 
              Math.random(3, 6)*100000 :  // 30-50s after 50 messages
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
