import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class QuoteDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

// shortens the "Volume" and "Market Cap" numbers which are typically Billions or more (i.e. 8.1B)
abbreviateNumber(value) {
  if(!value)
    return;

  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "K", "M", "B", "T"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}

formatNumber(value, precision) {
  if(!value || value === undefined)
    return;

  return value.toFixed(precision)
}

render() { 
      if(!this.state.data)
         return null;

      return <View style={styles.container}>
        <View style={{width:'23%'}}>
        <Text style={styles.labelText}>Open:</Text>
          <Text style={styles.labelText}>High:</Text>
          <Text style={styles.labelText}>Low:</Text>
          <Text style={styles.labelText}>P/E:</Text>
        </View>
        <View style={{ width: '23%' }}>
          <Text style={styles.dataText}>{this.formatNumber(this.state.data.open, 2)}</Text>
          <Text style={styles.dataText}>{this.formatNumber(this.state.data.high, 2)}</Text>
          <Text style={styles.dataText}>{this.formatNumber(this.state.data.low, 2)}</Text>    
          <Text style={styles.dataText}>{this.state.data.peRatio}</Text>
        </View>
        <View style={{ width: '8%' }}></View>
        <View style={{ width: '23%' }}>
          <Text style={styles.labelText}>52w High:</Text>
          <Text style={styles.labelText}>52w Low:</Text>
          <Text style={styles.labelText}>Volume:</Text>
          <Text style={styles.labelText}>Mkt Cap:</Text>
        </View>
        <View style={{ width: '23%' }}>
          <Text style={styles.dataText}>{this.formatNumber(this.state.data.week52High, 2)}</Text>
          <Text style={styles.dataText}>{this.formatNumber(this.state.data.week52Low, 2)}</Text>
          <Text style={styles.dataText}>{this.abbreviateNumber(this.state.data.volume)}</Text>
          <Text style={styles.dataText}>{this.abbreviateNumber(this.state.data.marketCap)}</Text>
        </View>
      </View>
  }
}
const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: 'row',
    width: "100%",  
    padding: 5,
    backgroundColor: 'black', 
    borderWidth: .5,
    borderRadius: 7,
    borderColor: 'grey',
    height:100
  },
  labelText: {
    textAlign: 'left',
    fontSize: 16,
    color: 'grey',
    fontFamily: 'Avenir-Black',
  },
  dataText: {
    textAlign: 'right',
    fontSize: 16,
    color: 'white',
    fontFamily: 'Avenir-Black',
  }
  
})