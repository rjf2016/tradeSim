const axios = require('axios').default;

module.exports = async (URL) => axios.get(`${URL}`)
  .then(response => response.data)
  .catch((error) => {
    throw new Error(error);
  });