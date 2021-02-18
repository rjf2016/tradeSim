const fetchData = require('../utils/fetchData');
const makeQueries = require('../utils/makeQueries');
const formatOptions = require('../utils/formatOptions');

async function news({
  symbols, API_TOKEN, API_URL, options
}) {
  const URL = API_URL + '/stable/stock/market/batch?types=news&last=3&symbols=';
  
  if (symbols === undefined) {
    throw new Error('No symbols provided, add symbols as an argument');
  }
  if (API_TOKEN === undefined) {
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');
  }
  const optionQuery = formatOptions(options);
  try {
    const data = [];
    const queries = await makeQueries(symbols, 5);
   
    for (const query of queries) { // eslint-disable-line no-restricted-syntax
        data.push(fetchData(URL, query, optionQuery, API_TOKEN));
    }
    
    const fetchedData = await Promise.all(data);
    
    if (fetchedData[0].message === 'Invalid API Key.') {
      throw new Error('Invalid API Token');
    }
    return fetchedData;

  } catch (error) {
    throw error;
  }
}

module.exports = news;