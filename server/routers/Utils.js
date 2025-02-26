const math = require('mathjs')
const path = require('path')
function delay(min, max) {
    return new Promise(resolve => setTimeout(resolve, math.random(min, max)));
}

// Function to get MIME type based on file extension
const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.mp4':
        return 'video/mp4';
      case '.pdf':
        return 'application/pdf';
      // Add more cases as needed for other file types
      default:
        return 'application/octet-stream'; // Fallback for unknown types
    }
  };

module.exports = {delay, getMimeType};