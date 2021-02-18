import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { View, Text, TouchableHighlight, FlatList, StyleSheet, RefreshControl, AppState } from 'react-native'
'use strict';

@inject('holdingsstore')
@observer 
export default class HoldingList extends Component {

  constructor(props) {
    super(props);
    this.state = {
        appState: AppState.currentState,
        holdingsstore: this.props,
        portfolioId: this.props.portfolioId,
        buttonPress: true,
        symbols: props.symbols,
        company: props.company
    }
    this.renderRow = this.renderRow.bind(this);
    this.onPress = this.onPress.bind(this);
  }
  formatNumber(num) {
    if(!num)
       return;
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
  onNavigate(symbol, company, shareQty) {
    this.props.parentNavigateReference(this.props.portfolioId, symbol, company, shareQty);
  }

buildHoldingsList(portfolioId, portfolios) {
    var s = [];

    Object.entries(portfolios).forEach(entry => {
      const [key, value] = entry;
      if(value.id == portfolioId){
        var o = value.holdings;
        Object.entries(o).forEach(entry => {
          const [key, value] = entry;    
          var q = this.props.holdingsstore.getShareQuantity(this.state.portfolioId, value.symbol);
          var p = this.props.holdingsstore.getCurrentPrices(value.symbol);
          s.push({symbol: value.symbol, company: value.company, quantity: q, latestPrice: p});
        });   
      }
    });
    return s;
  }

  renderRow(postKey) {
    var s = postKey.item["company"]; //.length > 18 ? postKey.item["company"].substring(0, 18) + "..." : postKey.item["company"];
    var holdingValue = postKey.item["quantity"] > 0 ? this.formatNumber(postKey.item["quantity"] * postKey.item["latestPrice"].latestPrice) :
      " - "
    return (
      <View>
        <View style={styles.container}>
          <View style={[styles.section, { width: '33%' }]}>
            <Text style={[styles.text, { textAlign: 'left' }]}>{postKey.item["symbol"]}</Text>
          </View>
          <View style={[styles.section, { width: '33%' }]}>
            <TouchableHighlight onPress={() => this.onNavigate(postKey.item["symbol"], postKey.item["company"], postKey.item["quantity"])} >
              <Text style={[styles.text, { textAlign: 'right', color:'lightgreen' }]}>
                {postKey.item["quantity"] == 0 ? "Add New" : this.formatNumber(postKey.item["quantity"])}
              </Text>
            </TouchableHighlight>
          </View>
          <View style={[styles.section, {width:'34%'}]}>
            <Text style={[styles.text, {textAlign: 'right'}]}>{holdingValue}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View style={[styles.container, {width:'100%'}]}>
            <Text style={styles.textSmall}>{s}</Text>
          </View>
        </View>
      </View>
    );
  }

render() {
  const { holdingsstore } = this.props;
  var portfoliolist = holdingsstore.Portfolios;
  
   let symbols = this.buildHoldingsList(this.state.portfolioId, portfoliolist);
  
    return (
      <View style={{height:'100%', top:70}}>
      
        <View style={styles.header}>
          <Text style={[styles.text, {width: "34%", textAlign: 'left'}]}>Symbol</Text>
          <Text style={[styles.text, { width: "30%", textAlign: 'right' }]}>Shares</Text>
          <Text style={[styles.text, { width: "36%", textAlign: 'right' }]}>Value</Text>
        </View>
        <View>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always" 
            ref={ref => this.listRef = ref}
            data={symbols}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                //onRefresh={this.onRefreshList.bind(this)}
              />
            }
          />
        </View>
      </View>
    );  
  }  
}

const styles = StyleSheet.create({
  container: {
    flex: 1, flexDirection: 'row', width: '100%'
  },
  section: {
    height: 25, backgroundColor: 'black',
  },
  text: {
    color: 'white', 
    fontFamily: 'Avenir-Black', 
    fontSize: 14, 
    padding: 2
  },
  textSmall: {
    color: 'grey',
    fontFamily: 'Avenir-Black',
    fontSize: 12,
    padding: 2,
    textAlign: 'left'
  },
  header: {
    flexDirection: "row",
    backgroundColor: '#000',
    height: 30,
    marginTop: 40,
    width: "100%",
    alignItems: "center"
  },
  flatlistView: {
    width: "100%",
    height: "100%",
    marginTop: 2
  },
})



  

