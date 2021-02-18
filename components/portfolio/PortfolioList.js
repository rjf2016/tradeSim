import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { View, TouchableHighlight, FlatList, StyleSheet, RefreshControl, AppState } from 'react-native'
import Portfolio from './Portfolio'; 
'use strict';

@inject('holdingsstore')
@observer 
export default class PortfolioList extends Component {

  constructor(props) {
    super(props);
    this.state = {
        appState: AppState.currentState,
        holdingsstore: this.props.holdingsstore,
        showChange: true,
        portfolioName: '',
        warningMsg: '',
        collapsed: []    // array of portfolio Ids that are collapsed

    }
    this.renderRow = this.renderRow.bind(this);
    this.onActions = this.onActions.bind(this);
  }

  handleChange = text => {
    this.setState({
      portfolioName: text
    });
  } 

//This function is called from the Portfolio component
 onActions(action, portfolioId, portfolioName, symbols, showChange) {
   switch (action) {
     case 'addSymbols':
       this.props.onActions(action, portfolioId, null, symbols, null);  // call parent to showSearchScreen modal
       break;
     case 'editPortfolio':
       this.props.onActions(action, portfolioId, portfolioName, symbols, null );  //call parent to showSearchScreen modal
       break;
     case 'editPortfolioDetails':
       this.props.onActions(action, portfolioId, null, symbols, null);
       break;
     case 'showQuoteDetailModal':
        this.props.onActions(action, null, null, symbols, null);
        break;
     case 'toggleChange':  // toggles between the stock price and percent changes for each line item
       this.setState({ showChange: showChange })
       break;
     case 'toggleCollapse':
       this.onCollapseToggle(portfolioId);
       break;  
    }
 }
 
  onCollapseToggle(portfolioId) {
    //toggle collapse for a given Portfolio
    var array = this.state.collapsed; 
    const index = array.indexOf(portfolioId);
    if (index > -1) 
        array.splice(index, 1);
    else 
        array.push(portfolioId);

    this.setState({ collapsed: array })
  }

fetchIt() {
  return this.props.holdingsstore.main();  //reprice all portfolios
  }
  
  async fetchHoldingsData() {
    try {
     var msg = await this.fetchIt();
      return "SUCCESS";
    } catch (err) {
       console.log(err);
    }
}

 onRefreshList() {   
    if (this.state.isRefreshing)  // eliminate duplicate calls while a refresh was already called
         return;

    this.setState({ isRefreshing: true }); 
    
    this.fetchHoldingsData().then(res => {
        this.setState({ isRefreshing: false });  
     });
 }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
   AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this.fetchHoldingsData();
    }
    this.setState({appState: nextAppState});
  };

  renderRow(postKey) {
    const data = Object.fromEntries(Object.entries(postKey.item));
    const id = data.id;
    return (
      <TouchableHighlight>
        <View>
          <View style={styles.container}>
            <Portfolio data={{ data }}
              id={id}
              onActions={this.onActions.bind(this)}
              collapsed={this.state.collapsed}
              showChange={this.state.showChange}
              holdingsstore={this.state.holdingsstore} />
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  render() {
    const { holdingsstore } =  this.props;    

    if (holdingsstore.IsLoading.loading)
      return (<View style = {{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', height: '100%' }} ></View>)

    const portfoliolist = holdingsstore.Portfolios;

    return (
      <View style={{ flex: 1, flexDirection: 'column', height: '100%', backgroundColor:'black'}}>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always"
            ref={ref => this.listRef = ref}
            data={portfoliolist}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => item.id}
            extraData={this.state}
            refreshControl={
             <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.onRefreshList.bind(this)}
             />
            }
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
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



  

