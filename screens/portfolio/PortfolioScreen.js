import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { inject, observer } from 'mobx-react'
import { showSettingsModal, showPorfolioEditModal, showPorfolioEditDetailsModal, showSearchModal, showCreatePortfolio } from '../utils/Navigation';
import Balances from '../../components/portfolio/Balances';
import PortfolioList from '../../components/portfolio/PortfolioList';

@inject('authstore')
@inject('holdingsstore')
@observer
export default class PortfolioScreen extends Component {
  static options() {
      return {
      topBar: {
          title: { text: "Portfolio", color: 'white', fontSize: 25, background: { color: '#000' }},
          color: 'white',
          visible: true,
          drawBehind: true,
          rightButtons: [{id: 'settingsModal', icon: require('../../img/person.png')}],
          leftButtons: [{ id: 'createNewPortfolio', icon: require('../../img/addPortfolio.png') }]
        }
      } 
    }

  constructor(props) {
    super(props);

    this.state = {
     holdingsstore: this.props.holdingsstore
    }
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted 
    this.createPortfolio = this.createPortfolio.bind(this);
    this.onActions = this.onActions.bind(this);
  }
  navigationButtonPressed({ buttonId }) { 
    if (buttonId == 'settingsModal') {
      showSettingsModal();
    }
    if (buttonId == 'createNewPortfolio') {
      this.onCreatePortfolioClick();
    }
  }

  //This function is called from child components
  onActions(action, portfolioId, portfolioName, symbols, showChange) {
    switch (action) {
      case 'addSymbols':
        showSearchModal(portfolioId, symbols, this.onActions);
        break;
      case 'saveSymbols':
        this.props.holdingsstore.addSymbols(portfolioId, symbols);
        break;
      case 'editPortfolio':
        showPorfolioEditModal(portfolioId, symbols, portfolioName);
        break;
      case 'editPortfolioDetails':
        showPorfolioEditDetailsModal(portfolioId, symbols);
        break;
      case 'toggleChange':  // toggles between the stock price and percent changes for each line item
        this.setState({ showChange: showChange })
        break;
      case 'toggleCollapse':  // toggles the collapse/expand (up/down arrows)
        this.onCollapseToggle(portfolioId)
        break;
    }
  }

  onCreatePortfolio(portfolioName) {
    this.props.holdingsstore.createPortfolio(portfolioName);
  }
  //Show the overlay window asking to name & create the portfolio (last parm is the callback function)
  onCreatePortfolioClick() {
    showCreatePortfolio(1, 'Create a new Portfolio?', '', this.createPortfolio);
  }
  //Called from the overlay confirmation window when user creates the portfolio
  createPortfolio(portfolioName) {
    this.state.holdingsstore.createPortfolio(portfolioName);
    Navigation.dismissOverlay('CreatePortfolio');
  }

  render() { 
    const { holdingsstore } = this.props; 
    const { authstore } = this.props;

    if (!authstore.userId) 
      return (<View style={{ backgroundColor: '#000', width: "100%", height: "100%" }}></View> )
     
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Balances holdingsstore={this.state.holdingsstore} />
        </View>
        <View style={styles.portfolioListView}>
          <PortfolioList holdingsstore={this.state.holdingsstore}
            onActions={this.onActions.bind(this)}
            parentOnCreatePortfolio={this.onCreatePortfolio.bind(this)}
            parentOnCreatePortfolioClick={this.onCreatePortfolioClick.bind(this)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#000',
    width: "100%",
    height: "100%",
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#000',
    width: '90%',
    marginTop: 100,
    alignItems: 'center',
  },
  portfolioListView: {
    paddingTop: 10, 
    width: "90%", 
    height: "100%", 
    alignItems: 'center' 
  }

});
