import MarketDataProductionAccess from '../utils/MarketDataProductionAccess';
import { PROD_API_KEY, SANDBOX_API_KEY } from '@env'

function MarketDataAPI() {
  const prod = MarketDataProductionAccess;

  if ( prod )
    return PROD_API_KEY
    else
    return SANDBOX_API_KEY
}
module.exports = MarketDataAPI;