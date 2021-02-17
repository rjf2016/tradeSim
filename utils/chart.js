const fetchData = require('./fetchData');
const formatOptions = require('./formatOptions');

async function chart({
  symbol, API_TOKEN, API_URL, timeFrame, options
}) {

  if (symbol === undefined) 
    throw new Error('No symbol provided, add symbols as an argument');
  
  if (API_TOKEN === undefined) 
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');

  timeFrame = 'dynamic'
  const URL = API_URL + '/stable/stock/' + symbol + '/chart/' + timeFrame;
  const optionQuery = formatOptions(options);
 
  //Work-in-progress...
  try {
    var data = [];
    var dataPoints = [];
    var dataLabels = [];
    var x = 0;
    var o = {};
    const query = '?';  
    
    data.push(fetchData(URL, query, optionQuery, API_TOKEN));
    const d = await Promise.all(data);
 
    Object.values(d[0].data).forEach(obj => {
      dataPoints.push(parseFloat(obj.close));
      if (x % 2)
        dataLabels.push(x); 
      x++
    });
    o = { data: dataPoints, labels: dataLabels }

    return o;
  } catch (error) {
    throw error;
  }
}

module.exports = chart;