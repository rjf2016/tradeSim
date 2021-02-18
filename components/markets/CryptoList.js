import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { View, Text, FlatList, Image, StyleSheet, AppState } from 'react-native'
import { cryptoIcons, meta} from '../../utils/cryptoData'  // Debug: static for now;
'use strict';

@observer 
export default class CryptoList extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
        appState: AppState.currentState,
        data: this.props.data
    }
  }
 currencyFormat(num) {
  return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
 numFormat(num) {
    return  num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  render() { 
    const {data} = this.props;

    if (!data) {
      return <View>
        <Text style={{ backgroundColor: 'black', height:26, color: 'white', top: 10, marginLeft: 5, fontSize: 18, width: "100%", textAlign: 'center' }}>
            Loading Crypto....</Text>
        </View>
    }

    return (
      <View style={{height:'100%'}}>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always"
            ref={ref => this.listRef = ref}
            data={data}

           renderItem={({ item, index }) => (
             <View key={item.symbol} style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: 'lightgrey', height: 53 }}>
               <View style={styles.container}>
                 <View style={{ width: '15%' }}>
                   <Image source={cryptoIcons[item.symbol]}></Image>
                 </View>
                 <View style={{ width: '40%' }}>
                   <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{meta[item.symbol].friendlyName}</Text>
                   <Text style={{ color: 'grey', fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{meta[item.symbol].descr}</Text>
                 </View>
                 <View style={{ width: '45%' }}>
                   <Text style={{ color: 'white', padding: 2, fontSize: 16, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'right' }}>
                     {this.currencyFormat(parseFloat(item.latestPrice))}
                  </Text>
                   <Text style={{ color: item.change>0 ? 'lightgreen' : item.change<0 ? 'red' : 'white', padding: 2, fontSize: 14, fontFamily: 'Avenir-Black', textAlign: 'right' }}>
                     {this.numFormat(parseFloat(item.change))}
                   </Text>
                 </View>
               </View>
             </View>
          )}
            keyExtractor={(item, index) => item['symbol']} 
            extraData={this.state}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: '#252526',
    padding: 5,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    height:50
  },
  flatlistView: {
    width: "100%"
  }
})



  

