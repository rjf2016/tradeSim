const fetchData = require('../utils/fetchData');

async function search({ search_term, API_TOKEN, API_URL, options }) {
  const URL = API_URL + '/stable/search/' + search_term;

  if (search_term === undefined) {
    throw new Error('No search provided, add a search term as an argument');
  }
  if (API_TOKEN === undefined) {
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');
  }

  optionQuery = "?";

  try { 
    const fetchedData = await fetchData(URL, '', optionQuery, API_TOKEN);
   
    if (fetchedData.message === 'Invalid API Key.') {
      throw new Error('Invalid API Token');
    }
    return fetchedData;
    
  } catch (error) {
    throw error;
  }
}
module.exports = search;