import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { View, Text, TouchableHighlight, FlatList, StyleSheet, AppState } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMinusSquare } from '@fortawesome/free-solid-svg-icons'
'use strict';

@observer 
export default class SymbolList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        appState: AppState.currentState,
        symbols: props.symbols
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

  renderRow(postKey) {
    return (
      <TouchableHighlight>
          <View style={styles.container}>
          <View style={{ width: '90%', height: 24}}>
              <View>
                <Text style={{ color: 'white', fontFamily: 'Avenir-Black', fontSize: 15, textAlign: 'left', paddingLeft: 10 }}>
                  {postKey.item["symbol"]}
                </Text>
              </View>
              <View>
                <Text style={{ color: 'grey', fontFamily: 'Avenir-Black', fontSize: 12, textAlign: 'left', paddingLeft: 10 }}>
                {postKey.item["company"]}
                </Text>
              </View>
            </View>
             
          <View style={{ width: '10%', height: 24, borderBottomWidth: .25, borderBottomColor: 'darkgrey'}}>
            <View style={{  }}>
                <TouchableHighlight onPress={() => this.onPress(postKey.item["symbol"])}>
                  
                <FontAwesomeIcon color={'red'} size={22} icon={faMinusSquare} /> 
           
                </TouchableHighlight>
              </View>
            <View style={{backgroundColor: '#000'}}><Text></Text>
              </View>
            </View>
          </View>
      </TouchableHighlight>
    )
  }

buildSymbolList(symbollist) {
  var s = [];

  Object.entries(symbollist).forEach(entry => {
    const [key, value] = entry;
    s.push({ symbol: value.symbol, company: value.company });   
  });
  return s;
}

render() {
    const symbollist = this.state.symbols;    
    let symbols = this.buildSymbolList(symbollist);
  
    return (
      <View style={{height:'100%'}}>
          <FlatList
            style={styles.flatlistView}
            ref={ref => this.listRef = ref}
            data={symbols}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
      </View>
    );   
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#000',
    height: 60,
    padding: 5,
    width: "100%",
    alignItems: 'center',
    borderBottomWidth: .25,
    borderBottomColor: 'darkgrey'
  },
  companyRow: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#000',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    height: 30,
    padding: 1,
    width: "100%"
  },
  flatlistView: {
    width: "100%",
    height: "100%",
   // top:1
  },
  TextViewStyle:
  {
    borderWidth: 1,
    borderRadius: 5,
   // borderColor: 'red',
    width: 80,
   // backgroundColor: 'red',
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
    color: 'white', fontSize: 18, textAlign: 'right', right: 3, width: 80, height: 40
  }
})



  

