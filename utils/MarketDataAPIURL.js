import MarketDataProductionAccess from '../utils/MarketDataProductionAccess';
import { PROD_API_URL, SANDBOX_API_URL } from '@env'

function MarketDataAPIURL() {
  const prod = MarketDataProductionAccess;
  
    if (prod)
      return PROD_API_URL;
    else
      return SANDBOX_API_URL;
}
module.exports = MarketDataAPIURL;

