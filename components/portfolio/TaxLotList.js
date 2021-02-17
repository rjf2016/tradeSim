import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { View, Text, TouchableHighlight, FlatList, StyleSheet, RefreshControl, AppState } from 'react-native'
'use strict';

@inject('holdingsstore')
@observer 
export default class TaxLotList extends Component {

  constructor(props) {
    super(props);

    this.state = {
        appState: AppState.currentState,
        holdingsstore: this.props.holdingsstore,
        portfolioId: this.props.portfolioId,
        taxlots: this.props.taxlots,
        symbol: this.props.symbol,
        company: this.props.company,
        buttonPress: true,
    }

     this.renderRow = this.renderRow.bind(this);
     this.onPress = this.onPress.bind(this);
  }
  formatNumber(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  formatShares(num){
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  currencyFormat(num) {
    return '$' + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  onPress(symbol) {
     this.props.parentReference(symbol);
  }

  onNavigate(taxlotId, symbol, quantity, tradeDate, price) {
    this.props.parentNavigateReference(taxlotId, symbol, this.state.company, quantity, tradeDate, price);
  }
  
  renderRow(postKey) {
  
    return (
          <View style={styles.container}>
                <View style={{ width: '100%'}}>
                <TouchableHighlight onPress={() => this.onNavigate(postKey.item["id"], postKey.item["symbol"], postKey.item["quantity"], postKey.item["tradeDate"], postKey.item["price"])} >
                 <View style={{ borderBottomWidth: 0.5, borderBottomColor: 'gray', height:40, justifyContent:'center'}}>
                    <Text style={{ color: 'white', fontFamily: 'Avenir-Black', fontSize: 14, textAlign: 'left', paddingLeft: 2 }}>
                        {this.formatNumber(postKey.item["quantity"])} shares / {this.formatNumber(postKey.item["price"])}
                    </Text>
                  </View>
                 </TouchableHighlight>
                </View>  
          </View>
    )
  }

buildTaxLotList(portfolioId, symbol) {
    return this.props.holdingsstore.getTaxLots(portfolioId, symbol);
  }

render() {
  const { holdingsstore } = this.state;
  var taxlots = this.buildTaxLotList(this.props.portfolioId, this.props.symbol);
  var portfoliolist = holdingsstore.Portfolios;
  var i = portfoliolist.length;

  if (!i || !portfoliolist) {
    return <View style={{ backgroundColor: '#000'}}>
      <Text style={{ backgroundColor: '#000', height: 26, color: 'white', top: 1, marginLeft: 5, fontSize: 18, width: "100%", textAlign: 'center' }}>
        No Tax Lots</Text>
    </View>
  }
  
    return (
      <View style={{ width: '100%', top: 15, backgroundColor: '#000'}}>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always"
            ref={ref => this.listRef = ref}
            data={taxlots}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
              />
            }
          />
        <TouchableHighlight onPress={() => this.onNavigate(null, this.props.symbol, '', null, '')} >
          <View style={{ justifyContent: 'center', height: 40, width: '100%', backgroundColor: '#000' }}>
            <Text style={{ color: 'lightgreen', fontFamily: 'Avenir-Black', fontSize: 15 }}>+ Add Lots</Text>
          </View>
        </TouchableHighlight>
        </View>
    );
    
  }
  
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   flexDirection: "row",
    backgroundColor: '#000',
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatlistView: {
    width: "100%",
    backgroundColor: '#000' 
  },
  TextViewStyle:
  {
    borderRadius: 5,
    width: 80,
    height: 30

  },
  textData: {
    color: 'white', 
    fontSize: 20, 
    textAlign: 'left', 
    width: 110,
    height: 30
  },
  quantity: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    width: 40,
    height: 30
  },
  numberData: {
    color: 'white',
    fontSize: 20,
    textAlign: 'right',
    width: 120,
    height: 30
  },
  linkData: {
    color: 'white',
    fontSize: 20,
    textAlign: 'right',
    width: 40,
    height: 30
  },
  valueData:{
    color: 'white', fontSize: 18, textAlign: 'right', right: 3, width: 80, height: 40, fontFamily: 'Avenir-Black'
  }
})



  

