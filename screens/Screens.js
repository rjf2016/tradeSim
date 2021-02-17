import React from 'react';
import { Navigation } from 'react-native-navigation';
import { observer } from 'mobx-react'
import stores from '../stores';
import Provider from '../utils/MobxRnnProvider';

import Initializing from './utils/Initializing';
import PortfolioScreen from './portfolio/PortfolioScreen';
import PortfolioEditScreen from './portfolio/PortfolioEditScreen';
import PortfolioEditDetailScreen from './portfolio/PortfolioEditDetailScreen';
import TaxLotEditDetailScreen from './portfolio/TaxLotEditDetailScreen';
import TaxLotListScreen from './portfolio/TaxLotListScreen';
import SignUpScreen from './login/SignUpScreen';
import LoginScreen from './login/LoginScreen';
import ForgotPwdScreen from './login/ForgotPwdScreen';
import QuoteLookupScreen from './search/QuoteLookupScreen';
import QuoteResearchScreen from './search/QuoteResearchScreen';
import QuoteDetailScreen from './search/QuoteDetailScreen';
import SettingsScreen from './utils/SettingsScreen';
import NewsScreen from './news/NewsScreen';
import MarketsScreen from './markets/MarketsScreen';
import AlertScreen from './utils/AlertScreen';
import CreatePortfolioScreen from './utils/CreatePortfolioScreen';

export default routes = {
  'Initializing': Initializing,
  'LoginScreen': LoginScreen,
  'PortfolioScreen': PortfolioScreen,
  'NewsScreen': NewsScreen,
  'PortfolioEditScreen': PortfolioEditScreen,
  'PortfolioEditDetailScreen': PortfolioEditDetailScreen,
  'TaxLotEditDetailScreen': TaxLotEditDetailScreen,
  'TaxLotListScreen': TaxLotListScreen,
  'SignUpScreen': SignUpScreen,
  'ForgotPwdScreen': ForgotPwdScreen,
  'QuoteLookupScreen': QuoteLookupScreen,
  'QuoteResearchScreen': QuoteResearchScreen,
  'QuoteDetailScreen': QuoteDetailScreen,
  'SettingsScreen': SettingsScreen,
  'MarketsScreen': MarketsScreen,
  'AlertScreen': AlertScreen,
  'CreatePortfolioScreen': CreatePortfolioScreen
}

// Register all screens of the app (including internal ones)
export function registerScreens() {
  for (let r in routes) {
    Navigation.registerComponent(r, () => sceneCreator(routes[r], stores))
  }
}

function sceneCreator(sceneComp, store) {
  @observer class SceneWrapper extends React.Component {
    static options(passProps) {
      return sceneComp.options ? sceneComp.options(passProps) : {}
    }

  
    render() {
      return (
        <Provider store={store}>
          {React.createElement(sceneComp, this.props)}
        </Provider>
      )
    }
  }
  return SceneWrapper
}
  