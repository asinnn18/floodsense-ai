const axios = require('axios');
const fs = require('fs');

async function download() {
  try {
    const response = await axios({
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Emblem_of_Karnataka.svg/512px-Emblem_of_Karnataka.svg.png',
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8'
      }
    });
    response.data.pipe(fs.createWriteStream('public/emblem.png'));
    console.log('Downloaded successfully');
  } catch (e) {
    console.error('Failed', e.message);
  }
}
download();
