import React, { Component } from "react";
import { StyleSheet, Text, View, Linking, TouchableHighlight, Image } from "react-native";
import { inject, observer } from 'mobx-react'

@inject('holdingsstore')
@observer 
export default class Portfolio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      showChange: this.props.showChange,
      symbols: this.props.symbols,
      holdingsstore: this.props.holdingsstore,
      collapsed: this.props.collapsed
    }

    this.symbolList = [];
  }

  componentDidMount() { 
    this.setState({ 
          loading: false
    });
  }

  onParentActions(action, portfolioId, portfolioName, symbols, showChange) {
   this.props.onActions(action, portfolioId, portfolioName, symbols, showChange);
  }
  
  symbolPriceLookup(symbol) {
    var o = {}
    const symbolprices = this.state.holdingsstore.SymbolPrices;
    
    for (var i = 0; i < symbolprices.length; i++) {
      if (symbolprices[i].symbol == symbol) {
        o.latestPrice = symbolprices[i].latestPrice;
        o.change = symbolprices[i].change,
        o.changePercent = symbolprices[i].changePercent,
        o.company = symbolprices[i].company;
        return o;
      }
    }
    return o;  
  }
  buildSymbolList(holdings){
    const rowArray = []; 

    if (!holdings)
       return [];

    Object.entries(holdings).forEach(entry => {
      const [key, value] = entry;
      
      let v = this.symbolPriceLookup(value.symbol)
     
      const sign = v.change >= 0 ? "+" : ""
      const dataType = this.props.showChange ? "" : "%"
   
      this.symbolList.push({ symbol: value.symbol, company: value.company });

      rowArray.push(<TouchableHighlight key={value.symbol}>
        <View key={value.symbol}>
          <View style={styles.container} key={value.symbol}>
            <Text style={{ flex: 1, color: 'white', width: 100, fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{value.symbol}</Text>
            <View>
              <Text style={{ flex: 1, color: 'white', width: 80, fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'right' }}>{v.latestPrice}</Text>
            </View>
           
            <TouchableHighlight style={[styles.valueChangeText, v.change > 0 ? { backgroundColor: 'green', borderRadius: 3 } : { backgroundColor: 'red', borderRadius: 3 }]} onPress={() => this.onParentActions('toggleChange', null, null, null, this.props.showChange == true ? false : true)} >
                <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Avenir-Black' }}>
                  {sign}{this.props.showChange ? parseFloat(v.change).toFixed(2) : parseFloat(v.changePercent * 100).toFixed(2)}{dataType}
                </Text>
              </TouchableHighlight>
          </View>
          <View style={{ flex: 1, left: 5, flexDirection: "column", width: '100%' }}><Text style={{ color: 'silver', fontSize: 12, height: 20 }}>{value.company}</Text></View>
        </View>
      </TouchableHighlight>
      );
    });
     return rowArray;
  }


portfolioLink(data) {
  return <View style={styles.details}>
        <View style={{ width: '80%' }}>
        <TouchableHighlight onPress={() => this.onParentActions('editPortfolioDetails', data.id, null, data.holdings, null)}>
          <Text style={styles.portfolioDetails}>Portfolio Details...</Text>
        </TouchableHighlight>
        </View>
        <View style={{ width: '20%' }}>
              <TouchableHighlight onPress={() => Linking.openURL('https://iexcloud.io')} >
                  <Text style={styles.iexCloud}>IEX Cloud</Text>
              </TouchableHighlight>
        </View>
        </View>
  
}

  render() { 
    const { data } = this.props.data;
    this.symbolList = [];

    let symbols = this.buildSymbolList(data.holdings);

    let portfolioDetailsLink = symbols.length > 0 ? this.portfolioLink(data) : <View style={styles.details}></View>

    if (this.state.loading || !symbols )
      return(<View><Text></Text></View>);

    // ----- Collapsed View -----
    if (this.state.collapsed.includes(data.id)) 
    return (
      <View style={{ borderRadius: 10, backgroundColor: '#252526', width: "100%" }}> 
      <View style={styles.container}>
          <Text style={styles.portfolioHeader}>{data.portfolioName}</Text>
          <TouchableHighlight onPress={() => this.onParentActions('toggleCollapse', data.id, null, null, null)}>
            <View style={styles.portfolioHeader}>
              <Image source={require('../../img/chevronDown.png')} style={{ resizeMode: 'cover', height: 22, width: 22 }} />
            </View>
          </TouchableHighlight>
        </View>
       </View>
    );

    // ----- Expanded View -----
    return (
      <View style={{ borderRadius: 10, backgroundColor: '#252526', width: "100%"}}>
          <View style={styles.container}>
             <Text style={styles.portfolioHeader}>{data.portfolioName}</Text>
            <TouchableHighlight onPress={() => this.onParentActions('toggleCollapse', data.id, null, null, null)}>
             <View style={styles.portfolioHeader}> 
              <Image style={{ height: 22, width: 22 }} source={require('../../img/chevronUp.png')} /> 
              </View>
          </TouchableHighlight>
          </View>
         
        <View style={styles.addActionRow}>
          <View style={{ justifyContent: 'center', width:'70%' }}>
          <TouchableHighlight onPress={() => this.onParentActions('addSymbols', data.id, null, data.holdings, null)}>
              <View style={styles.addSymbol}>
                <Image style={{ height: 14, width: 14 }} source={require('../../img/circlePlus.png')}/> 
                <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Avenir-Black' }}> Add Symbol</Text>            
              </View>
          </TouchableHighlight>
        </View>
          <View style={{ justifyContent: 'center', width: '30%' }}>
            <TouchableHighlight onPress={() => this.onParentActions('editPortfolio', data.id, data.portfolioName, data.holdings, null)}>
              <View style={styles.editSymbols}>        
                <Image style={{ height: 14, width: 14 }} source={require('../../img/pencil.png')} /> 
                <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Avenir-Black' }}> Edit...</Text>
              </View>
          </TouchableHighlight>
        </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', width: '97%', marginTop: 5, bottom: 3, backgroundColor: '#252526'}}>        
            {symbols}
        </View>
        
          {portfolioDetailsLink}
       
        </View>
    );
   }
  }
 
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#252526',
    left: 5,
    top: 3,
    bottom: 3,
    paddingTop: 5,
    paddingBottom: 5,
    padding: 1,
    width: "95%",
    alignItems: 'center',
  },
  details: {
    flexDirection: "row",
    backgroundColor: '#252526',
    left: 10,
    top: 0,
    paddingTop: 5,
    width: "90%",
    alignItems: 'center',
  },
  addActionRow: {
    flexDirection: "row",
    backgroundColor: '#252526',
    left: 5,
    width: "97%",
    alignItems: 'center',
  },
  textData: {
    color: 'white',
    padding: 2,
    fontSize: 16,
    textAlign: 'left',
    width: "100%",
    height: 30
  },
  iexCloud: {
    color: 'white', 
    fontSize: 12, 
    textAlign: 'right',
    fontFamily: 'Avenir-Black',
  },
  valueChangeText: {
    width: 70,
    height: 22,
    padding: 2,
    backgroundColor: 'lightgreen',
    left: 10,
    alignItems: 'center',
  },
  portfolioHeader: {
    textAlign: 'left',
    fontSize: 16,
    color: 'white',
    fontFamily: 'Avenir-Black',
    height: 30,
    width: "97%"
  },
  addSymbol: {
    flexDirection: 'row',
    borderRadius: 7,
    backgroundColor: '#252526',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11,
    height: 20,
    width: 100
  },
  editSymbols: {
    flexDirection: 'row',
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#252526',
    borderColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    height: 20,
    width: 100
  },
  portfolioDetails: {
    backgroundColor: '#252526',
    textAlign: 'center',
    fontSize: 12,
    color: 'lightgreen',
    fontFamily: 'Avenir-Black',
    height: 20,
    width: 100
  },
  editList: {
    backgroundColor: '#252526',
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    fontFamily: 'Avenir-Black',
    height: 20,
    width: 100
  },
  holdingsText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
})