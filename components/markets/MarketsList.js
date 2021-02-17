import React, { Component } from 'react';
import { observer } from 'mobx-react'
import { View, Text, FlatList, StyleSheet, AppState } from 'react-native'
import Market from './Market'; 
'use strict';

@observer 
export default class MarketsList extends Component {

  constructor(props) {
    super(props);
     
    this.state = {
        appState: AppState.currentState,
        showChange: true,
        data: this.props.data
    }
    this.renderRow = this.renderRow.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(showChange) {
    //toggle for the %, price change presses on the <Market> widget below
     this.setState({showChange: showChange})
  }
  renderRow(postKey) {   
    return (<View style={styles.container}>
      <Market data={postKey.item.data} refToggle={this.onToggle.bind(this)} showChange={this.state.showChange} refToggle={this.onToggle.bind(this)} categoryName={postKey.item.category} />
        </View>
    )  
  }

  render() { 
    const {data} = this.props;
  
    if (!data) {
      return <View>
        <Text style={{ backgroundColor: 'black', height:26, color: 'white', top: 10, marginLeft: 5, fontSize: 18, width: "100%", textAlign: 'center' }}>
            Loading Markets....</Text>
        </View>
    }

    return (
      <View style={{height:'100%'}}>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always"
            ref={ref => this.listRef = ref}
            data={data}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => item.id}
            extraData={this.state}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: 'black',
    paddingTop: 5,
    padding: 1,
    width: "100%",
    alignItems: 'center',
  },
  companyRow: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#252526',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    height: 30,
    padding: 1,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    backgroundColor: '#252526',
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    height: 30,
    marginBottom: 1,
    width: "100%",
    alignItems: "center"
  },
  flatlistView: {
    width: "100%"
  },
  TextViewStyle:
  {
    borderWidth: 1,
    borderRadius: 5,
    width: 80,
    height: 30

  },
  textData: {
    color: 'white', 
    fontSize: 20, 
    textAlign: 'left', 
    width: "100%",
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



  

