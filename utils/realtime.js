const fetchData = require('../utils/fetchData');
const makeQueries = require('../utils/makeQueries');
const formatOptions = require('../utils/formatOptions');
import MarketDataAPIURL from '../utils/MarketDataAPIURL';

async function realtime({
  symbols, API_TOKEN, API_URL, options
}) {
  const URL = API_URL + '/stable/stock/market/batch?types=quote&range=1m&symbols=';  

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
   
    for (const query of queries) { 
       data.push(fetchData(URL, query, optionQuery, API_TOKEN));
    }
    return fetchedData = await Promise.all(data);

  } catch (error) {
    throw error;
  }
}
module.exports = realtime;