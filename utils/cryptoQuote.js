const fetchData = require('./fetchData');

import {meta} from './cryptoData'
async function cryptoQuote({
  symbols, API_TOKEN, API_URL
}) {
  if (API_TOKEN === undefined) 
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');

  const optionQuery = "?";
  try {
    var data = [];
    const query = '';  
    Object.keys(meta).forEach(symbol => {
      var URL = API_URL + '/stable/crypto/' + symbol + '/quote';
      data.push(fetchData(URL, query, optionQuery, API_TOKEN));
    });

    return await Promise.all(data);
    
  } catch (error) {
    throw error;
  }
}
module.exports = cryptoQuote;