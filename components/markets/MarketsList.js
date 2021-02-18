import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
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
  flatlistView: {
    width: "100%"
  }
})



  

