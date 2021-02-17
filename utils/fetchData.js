const axios = require('axios').default;

module.exports = async (URL, query, options, API_TOKEN) => axios.get(`${URL}${query}${options}token=${API_TOKEN}`)
  .then(response => response.data)
  .catch((error) => {
    throw new Error(error);
  });