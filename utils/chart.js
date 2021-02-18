const fetchData = require('./fetchData');

async function chart({
  symbol, API_TOKEN, API_URL, timeFrame, options
}) {
  var optionQuery = '';

  if (symbol === undefined) 
    throw new Error('No symbol provided, add symbols as an argument');
  
  if (API_TOKEN === undefined) 
    throw new Error('No API_TOKEN provided, add your API_TOKEN as an argument');

 // timeFrame = 'dynamic'
  const URL = API_URL + '/stable/stock/' + symbol + '/chart/' + timeFrame;

  if (timeFrame == '5dm') optionQuery = "chartInterval=2&";
  if (timeFrame == '5y')  optionQuery = "chartInterval=7&";

  try {
    var data = [];
    var x = 0;
    var o = {};
    const query = '?';  

    data.push(fetchData(URL, query, optionQuery, API_TOKEN));
   
    var d = await Promise.all(data);
 
    let dataPoints = [];
    let dataLabels = [];
    let deltaCounter = 1;
    let deltaMax = 0;

    if (timeFrame == '1m')  deltaMax = 8;  // space the labels on the bottom x-axis
    if (timeFrame == '3m')  deltaMax = 65;
    if (timeFrame == '6m') deltaMax = 100;
    if (timeFrame == '5dm') deltaMax = 50;
    if (timeFrame == '1y') deltaMax = 100;
    if (timeFrame == '5y') deltaMax = 80;
    if (timeFrame == 'dynamic') deltaMax = 90;

    const dataVal = timeFrame=='dynamic' ? d[0].data : d[0];

    Object.values(dataVal).forEach(obj => {
      dataPoints.push(parseFloat(obj.close));
     
      if(!x || (deltaCounter == deltaMax && x < dataVal.length-1)) {
          if(timeFrame=='5y')
            dataLabels.push(obj['date'].substring(obj['date'].length - 5, obj['date'].length) + "-" + obj['date'].substring(0, 4));
          else
            if(timeFrame != 'dynamic')
                dataLabels.push(obj['date'].substring(obj['date'].length - 5, obj['date'].length));

          if(deltaCounter==deltaMax)  
            deltaCounter=1;
      }
      else
        dataLabels.push('');

      x++;
      deltaCounter++;
      
    });
    o = { data: dataPoints, labels: dataLabels }

    return o;
  } catch (error) {
    throw error;
  }
}

module.exports = chart;