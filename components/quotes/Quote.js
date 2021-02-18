import React, { Component } from "react";
import { StyleSheet, Text, View, Linking, TouchableHighlight } from "react-native";

export default class Quote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: this.props.symbol,
      company: this.props.company,
      price: this.props.price,
      change: this.props.change
    }
  }

render() { 
      if(!this.props.price)
         return null;

  const c = this.props.change >= 0 ? "+" + this.props.change.toFixed(2) : this.props.change.toFixed(2);
      return <View style={styles.container}>
         <View style={{ width: '100%', flex: 1, flexDirection: 'row'}}>
          <View style={{ width: '80%', flex: 1, flexDirection: 'row'}}>
            <Text style={styles.symbolText}>{this.props.symbol}  </Text>
            <Text style={styles.priceText}>{this.props.price.toFixed(2)}</Text>
            <Text style={[styles.changeText, this.props.change >= 0 ? {color:'lightgreen'} : {color:'red'}]}>  {c}</Text>
          </View>
          
          <View style={{ width: '20%'}}>
            <TouchableHighlight onPress={() => Linking.openURL('https://iexcloud.io')} >
            <Text style={styles.iexText}>IEX Cloud</Text>
            </TouchableHighlight>
            </View>
       </View>
        <View>
          <Text style={styles.companyText}>{this.props.company}</Text>
          </View>
      </View>
  }
}
const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: 'column',
    width: "100%",  
    padding: 2,
    backgroundColor: 'black', 
    borderWidth: .5,
    borderRadius: 7,
    borderColor: 'grey',
  },
  priceText: {
    textAlign: 'left',
    fontSize: 32,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
  symbolText: {
    textAlign: 'left',
    fontSize: 32,
    color: 'grey',
    fontFamily: 'Avenir-Black',
  },
  companyText: {
    textAlign: 'left',
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Avenir-Black',
  },
  iexText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
  changeText: {
    textAlign: 'left',
    fontSize: 22,
    color: 'white',
    fontFamily: 'Avenir-Black',
  }
  
})