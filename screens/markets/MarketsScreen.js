import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { inject, observer} from 'mobx-react';
import MarketsList from '../../components/markets/MarketsList';
import CryptoList from '../../components/markets/CryptoList';
import { getMarkets } from '../../stores/QuotesStore';
import { getCrypto } from '../../stores/QuotesStore';

@inject('quotesstore')
@observer
export default class MarketsScreen extends Component {
  static options() {
      return {
      topBar: {
          title: { text: "Markets", color: 'white', fontSize: 25, background: { color: '#000' }},
          color: 'white',
          visible: true,
          drawBehind: true,
        }
      } 
    }

  constructor(props) {
    super(props);
   
    this.state = {
      quotesstore: this.props.quotesstore,
      loading: true,
      activeTab: 1,  //default to Movers Tab;
      data: [],
      cryptoData: []
    }

    this.fetchData = this.fetchData.bind(this);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted    
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

async fetchData(tab) {

  if(tab == 1) {
    if (this.state.data.length) {
      this.setState({ loading: false, activeTab: 1 });
      return;
    }
    const o = await getMarkets(0);
    this.setState({ data: o, loading: false, activeTab: 1 });
  }
  else {
    if (this.state.cryptoData.length) {
      this.setState({ loading: false, activeTab: 2 });
      return;
    }
    const o = await getCrypto();
    this.setState({ cryptoData: o, loading: false, activeTab: 2});
  }
}

 async componentDidAppear() { 

    if(this.state.loading) {
      this.setState({ loading: false });
      try {
       // For Testing, keep this commented to avoid market data charges
       if(this.state.activeTab == 1) {
          this.fetchData(1);
       }
       else {
         this.fetchData(2);
       }
      } catch (err) {
        console.log("Error Market Data", err);
      }
    }
  }


  render() { 

    if(!this.state.data.length)
      return <View style={styles.container}></View>;

    const data = this.state.activeTab == 1 ? this.state.data : this.state.cryptoData;

    return (
        <View style={styles.container}>   
            <View style={{ flexDirection:'row', width:'90%', height:25, top:95, justifyContent:'center'}}> 
            <View style={[{ width: '50%', height:35, borderRadius: 3, borderWidth: 1, borderColor: 'silver', justifyContent: 'center', alignItems: 'center' }, this.state.activeTab == 1 ? { backgroundColor: 'blue' } : { backgroundColor: 'black' }]}>
                    <TouchableHighlight onPress={() => this.fetchData(1)}>
                      <Text style={{ color: 'white', fontSize:18, fontFamily: 'Avenir-Black'}}>Movers</Text>
                    </TouchableHighlight>
                </View> 
               <View style={[{ width: '50%', height:35, borderRadius: 3, borderWidth: 1, borderColor: 'silver', justifyContent: 'center', alignItems: 'center' }, this.state.activeTab == 2 ? { backgroundColor: 'blue' } : { backgroundColor: 'black' }]}>
                    <TouchableHighlight onPress={() => this.fetchData(2)}>
                     <Text style={{color: 'white', fontSize: 18, fontFamily: 'Avenir-Black' }}>Crypto</Text>
                    </TouchableHighlight>
                </View> 
            </View>   
            <View style={styles.marketsView}>
              { this.state.activeTab == 1 ? <MarketsList data={data} /> : <CryptoList data={data} /> }
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#000',
    width: "100%",
    alignItems: 'center',
  },
  marketsView: {
    top: 105,
    width: "90%", 
  }
});
