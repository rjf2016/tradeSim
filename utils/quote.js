const fetchData = require('./fetchData');

async function quote({
  symbol, API_TOKEN, API_URL
}) {
  
  if (symbol === undefined) 
    throw new Error('No symbol provided, add symbols as an argument');
  
  if (API_TOKEN === undefined) 
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');
  
  const URL = API_URL + '/stable/stock/' + symbol + '/quote'
  const optionQuery = "?";
  try {
    var data = [];
    const query = '';  

    data.push(fetchData(URL, query, optionQuery, API_TOKEN));
    const quoteData = await Promise.all(data);
    return quoteData[0];
  } catch (error) {
    throw error;
  }
}

module.exports = quote;