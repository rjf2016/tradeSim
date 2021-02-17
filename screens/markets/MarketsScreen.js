import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { inject, observer} from 'mobx-react';
import MarketsList from '../../components/markets/MarketsList';
import { getMarkets } from '../../stores/QuotesStore';

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
      data: []
    }
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted    
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }
 async componentDidAppear() { 
    if(this.state.loading) {
      this.setState({ data: null, loading: false });
      try {
        const o = await getMarkets(0);
        this.setState({ data: o, loading: false });
      } catch (err) {
        console.log("Error Loading Markets....", err);
      }
    }
  }
 
  render() { 
   const { data } = this.state;

    return (
        <View style={styles.container}>      
         <View style={styles.marketsView}>
          <MarketsList data={data}  />
         </View> 
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    backgroundColor: '#000',
    width: "100%",
    alignItems: 'center',
  },
  marketsView: {
    paddingTop: 10, 
    width: "90%", 
    alignItems: 'center'
  }
});
