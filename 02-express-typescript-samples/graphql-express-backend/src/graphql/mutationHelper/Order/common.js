import https from 'https';

export function getRates() {
  return new Promise((resolve) => {
    let data = '';
    https.get('https://api.zebpay.com/api/v1/ticker?currencyCode=INR', (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        data = JSON.parse(data);
        resolve(data);
      });
    })
      .on('error', () => {
        console.error('error in fetching rates from zebpay');
      });
  });
}
