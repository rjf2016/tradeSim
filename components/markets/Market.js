import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableHighlight } from "react-native";
import { inject, observer } from 'mobx-react'

@inject('quotesstore')
@observer 
export default class Market extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showChange: this.props.showChange,
      data: props.data
    }
  }

numberFormat(num) {
    return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
onToggle(showChange) {
  const s = this.props.showChange == true ? false : true;
  this.props.refToggle(s);
}

buildSymbolList(holdings){
    const rowArray = []; 
  
    if (!holdings)
       return;

        const value = holdings;

        for(var i=0; i<value.length; i++) {
            const sign = value.change >= 0 ? "+" : ""
            const dataType = this.props.showChange ? "" : "%"

              rowArray.push(
                <View key={this.props.categoryName + "_" + value[i].symbol}>
                  <View style={styles.container}>
                    <View>
                    <Text style={{ flex: 1, color: 'white', width: 155, fontSize: 13, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{value[i].symbol}</Text>
                    </View>
                    <View>
                      <Text style={{ flex: 1, color: 'white', padding: 2, width: 80, fontSize: 13, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'right' }}>{value[i].latestPrice}</Text>
                    </View>
                    <TouchableHighlight onPress={() => this.onToggle(this.props.showChange)} >
                      <View style={[styles.valueChangeText, value[i].change > 0 ? { backgroundColor: 'green', borderRadius: 3 } : { backgroundColor: 'red', borderRadius: 3 }]}>
                        <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Avenir-Black' }}> 
                        {sign}{this.props.showChange ? parseFloat(value[i].change).toFixed(2) : parseFloat(value[i].changePercent*100).toFixed(2)}{dataType}
                      </Text>
                      </View>
                    </TouchableHighlight>
                      <Text style={{ color: 'white', fontSize: 13, textAlign: 'right', width: 40 }}>  </Text>
                  </View>
                  <View style={{ flex: 1, left: 5, flexDirection: "column", width: '100%' }}><Text style={{ color: 'darkgray', fontSize: 12, height: 20 }}>{value[i].companyName}</Text></View>
                </View>
              );
        } 
    return rowArray;
  }

render() { 
    const { data } = this.state;

    if(!data)
      return (<View><Text>Loading data...</Text></View>);

    const symbols = this.buildSymbolList(this.state.data);

    return (
      <View style={{ borderRadius: 10, backgroundColor: '#252526', width: "100%"}}>
        <View style={styles.categoryView}>
             <Text style={styles.categoryHeader}>{this.props.categoryName}</Text>
        </View>
         <View style={{ flex: 1, flexDirection: 'column', width: '97%', marginTop: 5, bottom: 3, backgroundColor: '#252526'}}>
          {symbols}
          </View>
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
    width: "97%",
    alignItems: 'center',
  },
  categoryView: {
    flexDirection: "row",
    left:5,
    right: 5,
    backgroundColor: '#252526',
    width: "97%",
    borderBottomColor:'white',
    borderBottomWidth: 1
  },
  textData: {
    color: 'white',
    padding: 2,
    fontSize: 13,
    textAlign: 'left',
    width: "100%",
    height: 30
  },
  valueChangeText: {
    color: 'white', 
    width: 70, 
    height:22,
    padding: 2,
    backgroundColor: 'black',
    left: 20,
    fontSize: 13, 
    fontFamily: 'Avenir-Black', 
    fontWeight: 'bold', 
    alignItems: 'center',
    textAlign: 'right'
  },
  categoryHeader: {
    textAlign: 'left',
    fontSize: 20,
    color: 'white',
    fontFamily: 'Avenir-Black',
    height: 30,
    width: "97%"
  },
  holdingsText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
})