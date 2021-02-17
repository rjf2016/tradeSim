import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import TaxLotList from '../../components/portfolio/TaxLotList';

@inject('holdingsstore')
@observer
export default class TaxLotListScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: '', color: 'white', fontSize: 18, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
         leftButtons: [{ id: 'cancelButton', text: '<', fontSize: 18, color: 'white' }],
       }
      }
    }

 constructor(props) {
    super(props);

    this.state = {
      portfolioId: this.props.portfolioId,
      symbol: this.props.symbol,
      company: this.props.company,
      holdingsstore: this.props.holdingsstore,    
      taxlots: this.props.taxlots
    }
   
    this.closeModal = this.closeModal.bind(this);
    
    this.navigateTaxLotDetail.bind(this);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  componentDidMount() {
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: this.props.symbol,
          color: 'white',
          fontFamily: 'Avenir-Black',
          fontSize: 18
        },
        leftButtons: [{ id: 'cancelButton', text: '<', fontSize: 18, color: 'white' }],
      }
    });
  }

    navigationButtonPressed({ buttonId }) {
    if (buttonId == 'cancelButton') {
      this.closeModal();
    }
  }

  closeModal() {
     Navigation.pop(this.props.componentId);
  }

  navigateTaxLotDetail(taxlotId, symbol, company, quantity, tradeDate, price) {
    Navigation.push('MyStack', {
      component: {
        name: 'TaxLotEditDetailScreen',
        passProps: {
          portfolioId: this.state.portfolioId,
          taxlotId: taxlotId,
          symbol: symbol,
          company: company,
          quantity: quantity,
          tradeDate: tradeDate,
          price: price,
          taxlots: this.state.taxlots  //new
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

  render() {
    const { holdingsstore } = this.state;
    const { taxlots } = this.state;
    return (
      <View style={styles.container}>
        <TaxLotList holdingsstore={holdingsstore} taxlots={taxlots} portfolioId={this.state.portfolioId} symbol={this.state.symbol} company={this.state.company} parentNavigateReference={this.navigateTaxLotDetail.bind(this)} />
      </View> 
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: "column",
    backgroundColor: '#000',
    top: 80,
    padding: 1,
    width: "100%",
  }
});


