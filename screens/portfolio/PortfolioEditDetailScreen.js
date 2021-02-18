// QuoteLookupScreen.js
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import HoldingList from '../../components/portfolio/HoldingList';

@inject('holdingsstore')
@observer
export default class PortfolioEditDetailScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: "Holdings", color: 'white', fontSize: 25, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
          leftButtons: [{ id: 'cancelButton', text: 'Cancel', color: 'red' }],
       }
      }
    }

 constructor(props) {
    super(props);

    this.state = {
      portfolioId: this.props.portfolioId,
      symbols: this.props.symbols,
      company: this.props.company,
      taxlots: this.props.holdingsstore.TaxLots,
      deletedSymbols: [],
      updated: false,    
      error: false
    }
   
    this.closeModal = this.closeModal.bind(this);
    this.parentDeleteSymbols = this.parentDeleteSymbols.bind(this);
    this.parentNavigate = this.parentNavigate.bind(this);

    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'saveButton') {
       // this.closeModal();
    }
    if (buttonId == 'cancelButton') {
      this.closeModal();
    }
  }

  closeModal() {
       Navigation.dismissModal(this.props.componentId);
  }

  parentDeleteSymbols(symbol) {
    this.state.deletedSymbols.push(symbol);
    delete this.state.symbols[symbol];
    this.setState({ updated: true });
  }

  parentNavigate(portfolioId, symbol, company, shareQty){
    var i = 0;
    var o = this.props.holdingsstore.getTaxLots(portfolioId, symbol);
    if(o) 
       i = o.length;

    if (i<1) {
          Navigation.push('MyStack', {
            component: {
              name: 'TaxLotEditDetailScreen',
              passProps: {
                portfolioId: portfolioId,
                taxlotId:  i ? o[0].id : null,
                symbol:    i ? o[0].symbol : symbol,
                company: i ? o[0].company : company,
                quantity:  i ? o[0].quantity : 0,
                tradeDate: i ? o[0].tradeDate : null,
                price:     i ? o[0].price : 0
              },
              options: {
                animations: {
                  push: {
                    waitForRender: true
                  }
                }
              }

            },
          });
    }
    else {   
        Navigation.push('MyStack', {
          component: {
            name: 'TaxLotListScreen',
            passProps: {
              taxlots: o,
              portfolioId: portfolioId,
              symbol: symbol,
              company: company
            },
            options: {
              animations: {
                push: {
                  waitForRender: true
                }
              }
            }
          },
        });
   }
  }

  render() {
    const { holdingsstore } = this.props;
    const symbols = this.state.symbols;

    const showHoldingsList = symbols == null ? null :
      <HoldingList holdingsstore={holdingsstore} portfolioId={this.props.portfolioId} company={this.state.company} symbols={this.state.symbols} parentNavigateReference={this.parentNavigate.bind(this)} parentReference={this.parentDeleteSymbols.bind(this)} />

    return (
      <View style={styles.main}>
        <View style={styles.view} >
          { showHoldingsList }
      </View>
      </View> 
    ) 
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#000',
    top: 0,
    alignItems: 'center',
  },
  view: {
    width: '100%', 
    height: '100%', 
    marginTop: 5, 
    backgroundColor: '#000'
  }
  
});


