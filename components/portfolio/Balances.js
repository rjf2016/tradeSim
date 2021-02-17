import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableHighlight } from "react-native";
import { inject, observer } from 'mobx-react'

@inject('holdingsstore')
@observer 
export default class Balances extends Component {
  constructor(props) {
    super(props);
    this.state = {
      holdingsstore: this.props.holdingsstore,
      collapse: false
    }
  }

componentDidMount() { 
    this.setState({ loading: false });
}
  
numberWithCommas(x) {
   return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null
}

numberWithPercents(x) {
  return x ? "(" + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%)" : null
}

collapsed (totalPortfolioValue, todayGain, todayGainPct, totalGain, totalGainPct) {
  return (
    <View style={[styles.container, { height: 25 }]}>
      <View style={{ width: '94%', backgroundColor: 'black', justifyContent: 'center' }}>
        <Text style={styles.performanceSmall}>
          Day: <Text style={[styles.performance, { fontSize: 12 }, todayGain < 0 ? { color: 'red' } : { color: 'lightgreen' }]}>{this.numberWithCommas(todayGain)} {this.numberWithPercents(todayGainPct)}</Text>   Total: <Text style={[styles.performance, { fontSize: 12 }, totalGain < 0 ? { color: 'red' } : { color: 'lightgreen' }]}>{this.numberWithCommas(totalGain)} {this.numberWithPercents(totalGainPct)} </Text>
        </Text>
      </View>
      <TouchableHighlight onPress={() => this.collapse()}>
        <View style={{ width: '6%', backgroundColor: 'black' }}>
          <Image source={require('../../img/chevronDown.png')} style={{ resizeMode: 'cover', height: 22, width: 22 }} />
        </View>
      </TouchableHighlight>
    </View>
  )
}
expanded (totalPortfolioValue, todayGain, todayGainPct, totalGain, totalGainPct) {
  return (
    <View style={styles.container}>
      <View style={{ width: '94%' }}>
        <Text style={styles.totalValueDollarSignText}>$<Text style={styles.totalValue}>{this.numberWithCommas(totalPortfolioValue)}</Text></Text>
        <Text style={styles.totalReturnText}>Day's Gain:    <Text style={[styles.performance, todayGain < 0 ? { color: 'red' } : { color: 'lightgreen' }]}>
          {this.numberWithCommas(todayGain)} {this.numberWithPercents(todayGainPct)}
        </Text></Text>
        <Text style={styles.totalReturnText}>Total Gain:    <Text style={[styles.performance, totalGain < 0 ? { color: 'red' } : { color: 'lightgreen' }]}>
          {this.numberWithCommas(totalGain)} {this.numberWithPercents(totalGainPct)}
        </Text></Text>
      </View>
      <TouchableHighlight onPress={() => this.collapse()}>
        <View style={{ width: '6%' }}>
          <Image source={require('../../img/chevronUp.png')} style={{ resizeMode: 'cover', height: 22, width: 22 }} />
        </View>
      </TouchableHighlight>
    </View>
  )
}

collapse() {
  this.setState({collapse: !this.state.collapse})
}

render() { 
  const { holdingsstore } = this.props;
  const balances = holdingsstore.Balances;
  const b = Object.values(balances);

  if (b === undefined || Object.keys(b) == 0)
     return this.state.collapse ? this.collapsed(0, 0, 0, 0, 0) : this.expanded(0,0,0,0,0)

   var bal = {};
   Object.entries(balances).forEach(entry => {
     const [key, value] = entry;
     if (value.id == 'Total')
       bal = { totalPortfolioValue: value.performance.totalPortfolioValue, todayGain: value.performance.todayGain, 
               todayGainPct: value.performance.todayGainPct, totalGain: value.performance.totalGain, totalGainPct: value.performance.totalGainPct   
        }
    });

   if (!this.state.collapse) 
      return this.expanded(bal.totalPortfolioValue, bal.todayGain, bal.todayGainPct, bal.totalGain, bal.totalGainPct);
   else 
     return this.collapsed(bal.totalPortfolioValue, bal.todayGain, bal.todayGainPct, bal.totalGain, bal.totalGainPct);
   }
}
  
const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: 'row',
    width: "95%",  
    padding: 2,
    backgroundColor: 'black', 
    borderWidth: .5,
    borderRadius: 7,
    borderColor: 'grey',
  },
  totalValue: {
    textAlign: 'left',
    fontSize: 32,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
  performance: {
    textAlign: 'left',
    fontSize: 16,
    color: 'lightgreen',
    fontFamily: 'Avenir-Black'
  },
  performanceSmall: {
    color: 'white', fontSize: 11, fontFamily: 'Avenir-Black'
  },
  totalValueText: {
    textAlign: 'left',
    bottom: 5,
    fontSize: 24,
    color: '#ccb28f',
    fontFamily: 'Avenir-Black',
  },
  totalReturnText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#FDFEFE',
    fontFamily: 'Avenir-Black',
  },
  totalValueDollarSignText: {
    textAlign: 'left',
    fontSize: 22,
    color: 'white',
    fontFamily: 'Avenir-Black'
  },
})