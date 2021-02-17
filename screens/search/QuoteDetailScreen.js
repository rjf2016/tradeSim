import React, { Component } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import { getQuote, getChart } from '../../stores/QuotesStore';
import { getNewsBySymbol } from '../../stores/NewsStore';
import Quote from '../../components/quotes/Quote';
import QuoteDetail from '../../components/quotes/QuoteDetail';
import NewsList from '../../components/news/NewsList';
import Chart from '../../components/quotes/Chart';

@inject('quotesstore')
export default class QuoteDetailScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: "Detail", color: 'white', fontSize: 25, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
         leftButtons: [{ id: 'cancelButton', text: 'Cancel', color: 'red' }],
       }
      }
    }

 constructor(props) {
    super(props); 
    this.state = {
      symbol: this.props.symbol,
      company: this.props.company,
      loading: true,
      quoteData: {},
      chartData: [],
      newsData: []
    }
    
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'cancelButton') 
      Navigation.dismissModal(this.props.componentId);
  }

  async componentDidMount() {

    try {
      const symbol = this.props.symbol;
      if (symbol) {
        const data = [];
        data.push(getQuote(symbol));
        data.push(getChart(symbol, '1m', ''));
        data.push(getNewsBySymbol(symbol));
        const fetchedData = await Promise.all(data);
        this.setState({ quoteData: fetchedData[0], chartData: fetchedData[1], newsData: fetchedData[2], loading: false });
      }
    } catch (err) {
      console.log("Error Market Data", err);
    }
  }

  render() {    
   if(this.state.loading)
     return <View style={styles.container}></View>;

    return (
      <ScrollView style={styles.container}>        
        <Quote symbol={this.state.symbol} company={this.state.quoteData.companyName} price={this.state.quoteData.latestPrice} change={this.state.quoteData.change} />
        <Chart style={styles.chart} chartData={this.state.chartData} />    
        <QuoteDetail data={this.state.quoteData} />
        <NewsList data={this.state.newsData} />
      </ScrollView> 
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: 'column',
    backgroundColor: 'black',
    top: 1,
  },
  quote: {
    height:120
  },
  chart: {
    height:300
  }

});


