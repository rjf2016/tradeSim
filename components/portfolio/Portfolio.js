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
    this.setState({loading: false });
  }

  onParentActions(action, portfolioId, portfolioName, symbols, showChange) {
   this.props.onActions(action, portfolioId, portfolioName, symbols, showChange);
  }
  
  buildSymbolList(holdings){
    const rowArray = []; 

    if (!holdings)
       return [];

    Object.entries(holdings).forEach(entry => {
      const [key, value] = entry;

      //Formatting the % or $ for when user clicks (toggles)
      let price = this.state.holdingsstore.SymbolPrices.find(x => x.symbol === value.symbol);
      if(price === undefined)
         return null;
  
      const sign = price.change >= 0 ? "+" : ""
      const color = price.change > 0 ? 'green' : price.change < 0 ? 'red' : '#252526'
      const dataType = this.props.showChange ? "" : "%"
   
      this.symbolList.push({ symbol: value.symbol, company: value.company });

      rowArray.push(<TouchableHighlight key={value.symbol}>
        <View key={value.symbol}>

          <View style={styles.container} key={value.symbol}>
            <TouchableHighlight style={{ flex: 1, width: 100}} onPress={() => this.onParentActions('showQuoteDetailModal', null, null, value.symbol, null)} >
            <Text style={{ flex: 1, color: 'white', width: 100, fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{value.symbol}</Text>
            </TouchableHighlight>
            <View>
              <Text style={{ flex: 1, color: 'white', width: 80, fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'right' }}>{price.latestPrice}</Text>
            </View>
            
            <TouchableHighlight style={[styles.valueChangeText, { backgroundColor: color, borderRadius: 3 }]} onPress={() => this.onParentActions('toggleChange', null, null, null, this.props.showChange == true ? false : true)} >
                <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Avenir-Black' }}>
                {sign}{this.props.showChange ? parseFloat(price.change).toFixed(2) : parseFloat(price.changePercent * 100).toFixed(2)}{dataType}
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

performanceData(balances, collapsed) {
  if(!balances) 
     return null;
  
  if (collapsed) {
    let colorTotal = balances.totalGain < 0 ? { color: 'red' } : { color: 'lightgreen' };
    let Total = balances.totalGain < 0 ? this.currencyFormat(parseFloat(balances.totalGain)) + " (" + balances.totalGainPct + ")" : this.currencyFormat(parseFloat(balances.totalGain)) + " (+" + balances.totalGainPct + ")"
    return <Text style={[styles.textPerformance, colorTotal]}>Total: {Total}</Text>
  }
  else {
    let colorDay = balances.todayGain < 0 ? { color: 'red' } : { color: 'lightgreen' };
    let Day = balances.todayGain < 0 ? this.currencyFormat(parseFloat(balances.todayGain)) + " (" + balances.todayGainPct + ")" : this.currencyFormat(parseFloat(balances.todayGain))  + " (+" + balances.todayGainPct + ")"
    return <Text style={[styles.textPerformance, colorDay]}>Day: {Day}</Text>
  }
}
currencyFormat(num) {
    if(!num || num == undefined) return '$0';
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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

    const balances = this.props.holdingsstore.getBalances(data.id);  // get the performance information for holdings in this portfolio

    // ----- Collapsed View -----
    if (this.state.collapsed.includes(data.id)) 
    return (
      <View style={{ borderRadius: 10, backgroundColor: '#252526', width: "100%" }}> 
      <View style={styles.container}>
          <View style={[styles.portfolioHeader, { flex: 1, flexDirection: 'column', alignItems: 'flex-start' }]}>
            <View><Text style={[styles.portfolioHeader, { height: 20 }]}>{data.portfolioName}</Text></View>
            <View><Text style={[styles.portfolioHeader, { height: 20, fontSize: 14 }]}>{this.performanceData(balances, 1)}</Text></View>
          </View>
          <View>
          <TouchableHighlight onPress={() => this.onParentActions('toggleCollapse', data.id, null, null, null)}>
            <View style={styles.portfolioHeader}>
              <Image source={require('../../img/chevronDown.png')} style={{ resizeMode: 'cover', height: 22, width: 22 }} />
            </View>
          </TouchableHighlight>
        </View>
       </View>
       </View>
    );

    // ----- Expanded View -----
    return (
      <View style={{ borderRadius: 10, backgroundColor: '#252526', width: "100%"}}>
          <View style={styles.container}>
          <View style={[styles.portfolioHeader, { flex: 1, flexDirection:'column', alignItems:'flex-start'}]}>
            <View><Text style={[styles.portfolioHeader, { height: 20}]}>{data.portfolioName}</Text></View>
            <View><Text style={[styles.portfolioHeader, { height: 20, fontSize:14}]}>{this.performanceData(balances, 0)}</Text></View>
           </View>
          <View>
                <TouchableHighlight onPress={() => this.onParentActions('toggleCollapse', data.id, null, null, null)}>
                <View style={styles.portfolioHeader}> 
                    <Image style={{ height: 22, width: 22 }} source={require('../../img/chevronUp.png')} /> 
                  </View>
                </TouchableHighlight>
              </View>
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
              <View style={styles.addSymbol}>        
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
    left: 8,
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
  textPerformance: {
  width: 50, 
  color: 'white', 
  fontSize: 12, 
  textAlign: 'right',
  fontFamily: 'Avenir-Black'
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
    height: 36,
    width: "97%",
    backgroundColor: '#252526',
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
  portfolioDetails: {
    backgroundColor: '#252526',
    textAlign: 'center',
    fontSize: 12,
    color: 'lightgreen',
    fontFamily: 'Avenir-Black',
    height: 20,
    width: 100
  }
})