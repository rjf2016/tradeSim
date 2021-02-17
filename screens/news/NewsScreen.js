import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import { getNewsBySymbol } from '../../stores/NewsStore';
import NewsList from '../../components/news/NewsList';

@inject('holdingsstore')  //listen for add new symbols
@observer
export default class NewsScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: "News", color: 'white', fontSize: 25, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
       }
      }
    }

 constructor(props) {
    super(props);

    this.state = {
       holdingsstore: this.props.holdingsstore,
       loading: true,
       data: []
    }
  }

  componentDidMount() {
    this.navigationEventListener = Navigation.events().bindComponent(this);
  }

  async componentDidAppear() {
    if (this.state.loading) {
       this.fetchNews();
    }
  }

  async fetchNews() {
    try {
      const s = this.props.holdingsstore.UniqueSymbols;
      if (s) {
        const o = await getNewsBySymbol(s);
        this.setState({ data: o, loading: false });
      }
    } catch (err) {
      console.log("Error Loading News....", err);
    }
  }

  render() {
    const { data } = this.state;
  
    return (
      <View style={styles.container}>
        <View style={styles.newsView}>
          <NewsList data={data} cbFetchNews={this.fetchNews.bind(this)} />
      </View>
      </View> 
    ) 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#000',
    top: 0,
    alignItems: 'center',
  },
  newsView: {
    width: '100%',
    height: '100%',
    marginTop: 5,
    backgroundColor: '#000',

  }
});


