// PortfolioEdiScreen.js
import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableHighlight } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import SymbolList from '../../components/portfolio/SymbolList';
import { showAlert } from '../utils/Navigation';

@inject('holdingsstore')
@observer
export default class PortfolioEditScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: "Edit Portfolio", color: 'white', fontSize: 25, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
         rightButtons: [{ id: 'saveButton', text: 'Save', color: 'lightgreen'}],
         leftButtons: [{ id: 'cancelButton', text: 'Cancel', color: 'red' }],
       }
      }
    }

 constructor(props) {
    super(props);
  
    this.state = {
      portfolioId: this.props.portfolioId,
      portfolioName: this.props.portfolioName,
      symbols: this.props.symbols,
      deletedSymbols: [],
      updated: false,    
      error: false,
    }
    this.closeModal = this.closeModal.bind(this);
    this.parentDeleteSymbols = this.parentDeleteSymbols.bind(this);

    this.deletePortfolio = this.deletePortfolio.bind(this);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'saveButton') {
      
      if(this.state.portfolioName != this.props.portfolioName)
        this.props.holdingsstore.updatePortfolioName(this.state.portfolioId, this.state.portfolioName);
      
      if(this.state.deletedSymbols)
          this.props.holdingsstore.deleteSymbols(this.state.portfolioId, this.state.deletedSymbols);
      
        this.closeModal();
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

  handleChange = text => {
    this.setState({
      portfolioName: text
    });
  } 

//Show the overlay window asking to confirm deletion (last parm is the callback function)
  showDeleteWarning() {
    showAlert(1, 'Delete this Portfolio?', '', this.deletePortfolio);
  }
 
//Called from the overlay confirmation window when user deletes the portfolio
  deletePortfolio() {
    this.props.holdingsstore.deletePortfolio(this.state.portfolioId);
    Navigation.dismissOverlay('Alert');
    this.closeModal();
  }

  render() {
    const symbols = this.state.symbols;

    const showSymbolList = symbols == null ? null :
        <SymbolList portfolioId={this.props.portfolioId} 
                    portfolioName={this.props.portfolioName} 
                    symbols={this.state.symbols} 
                    parentReference={this.parentDeleteSymbols.bind(this)} />

    return (
      <View style={styles.container}>     
        <TextInput
          style={styles.portfolioText}
          placeholder="Name your portfolio"
          autoFocus={false}   
          placeholderTextColor='grey'
          keyboardType={'default'}
          onChangeText={text => this.handleChange(text)}
          value={this.state.portfolioName}
        />

        <View style={styles.symbols} >
           { showSymbolList }
      </View>
      
        <View style={styles.deletePortfolio}>
          <TouchableHighlight onPress={() => this.showDeleteWarning()}>
          <Text style={{ color: 'red', fontSize: 14 }}>Delete Portfolio </Text>
          </TouchableHighlight>
        </View>
       
      </View> 
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#000',
    top: 1,
    alignItems: 'center',
   
  },
  deletePortfolio: {
    position: 'absolute',
    bottom: 30,
  },
  portfolioText: {
    width: '95%', 
    height: 40, 
    marginTop: 125, 
    fontSize: 20, 
    borderRadius: 5, 
    color: 'white', 
    backgroundColor: '#252526', 
    fontFamily: 'Avenir-Black', 
    fontWeight: 'bold'
  },
  symbols: {
      width: '95%', 
      height: '75%' 
    }
});


