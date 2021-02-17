const fetchData = require('./fetchData');

async function marketsrealtime({ API_TOKEN, API_URL }) {
 //category: 0=most active, 1=gainers, 2=losers
  if (API_TOKEN === undefined) {
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');
  }

  try {
    const data = [];
    data.push(fetchData(API_URL + '/stable/stock/market/list/mostactive?', '', '', API_TOKEN));
    data.push(fetchData(API_URL + '/stable/stock/market/list/gainers?', '', '', API_TOKEN));
    data.push(fetchData(API_URL + '/stable/stock/market/list/losers?', '', '', API_TOKEN));
    const fetchedData = await Promise.all(data);

    if (fetchedData[0].message === 'Invalid API Key.') {
      throw new Error('Invalid API Token');
    }
    return fetchedData;

  } catch (error) {
    throw error;
  }
}

module.exports = marketsrealtime;