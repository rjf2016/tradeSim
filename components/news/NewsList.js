import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'
import { View, Text, TouchableHighlight, Linking, FlatList, StyleSheet, Image, RefreshControl } from 'react-native'
import moment from 'moment-business-days';

'use strict';

@inject('holdingsstore')  //listen for add new symbols
@observer 
export default class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data: this.props.data,
        isRefreshing: false
    }
    this.renderRow = this.renderRow.bind(this);
    this.onPress = this.onPress.bind(this);
  }

  onPress(symbol) {
     this.props.parentReference(symbol);
  }

  fetchIt() {
    return this.props.cbFetchNews();  //fetchNews
  }

  async fetchNews() {
    try {
      var msg = await this.fetchIt();
    } catch (err) {
      console.log(err);
    }
  }

  onRefreshList() {
    if (this.state.isRefreshing)  // eliminate duplicate calls while a refresh was already called
      return;

    this.setState({ isRefreshing: true }); // true isRefreshing flag for enable pull to refresh indicator

    this.fetchNews().then(res => {
      this.setState({ isRefreshing: false }); // true isRefreshing flag for enable pull to refresh indicator  
    });
  }

  buildNewsList(news) {
    var s = [];

    if(!news)
      return;

    Object.entries(news).forEach(entry => {
      const [mykey, value] = entry;
          s.push({
                  symbol: mykey,
                  headline: value.headline,
                  summary: value.summary,
                  source: value.source,
                  image: value.image,
                  url: value.url,
                  datetime: moment(value.datetime).format("MM/DD h:mma")
           });     
    });
    return s;
  }

  renderRow(postKey) {    
    return (  
        <View>
          <View style={styles.container}>
          <TouchableHighlight onPress={() => Linking.openURL(postKey.item['url'])} >
            <View style={{ width: '70%', height: "100%", backgroundColor: 'black'}}>
              <View style={{ backgroundColor: 'black', height: '80%', paddingTop: 5 }}>
                <Text style={{ color: 'white', fontFamily: 'Avenir-Black', fontSize: 11, textAlign: 'left' }}>
                  {postKey.item["headline"]}
                </Text>
                <View style={{  backgroundColor: 'black', height:'20%', flex:1, justifyContent:'flex-end'}}>
                  <Text style={{  color: 'grey', fontFamily: 'Avenir-Black', fontSize: 11, textAlign: 'left'}}>
                      {postKey.item["source"]}  {postKey.item["datetime"]}
                  </Text>
                </View>
              </View>          
            </View>
         </TouchableHighlight>
             <View style={{flex:1, alignItems:'flex-end', width: '30%', height: '100%', paddingTop: 5 }}>
         
              <TouchableHighlight onPress={() => Linking.openURL(postKey.item['url'])} >  
               <Image
                   style={{ width: 100, height: 90, resizeMode: 'cover' }}
                    source={{uri: postKey.item["image"] }}
                />
              </TouchableHighlight>
                         
            </View>         
          </View>
        </View>
    ) 
  }

render() {
  const { data } = this.props;

  if (!data) {
    return <View>
      <Text style={{ backgroundColor: 'black', height: 26, color: 'white', top: 10, marginLeft: 5, fontSize: 18, width: "100%", textAlign: 'center' }}>
        Loading News....</Text>
    </View>
  }

  const news = this.buildNewsList(data)
 
    return (
        <View>
          <FlatList
            style={styles.flatlistView}
            keyboardShouldPersistTaps="always" 
            ref={ref => this.listRef = ref}
            data={news}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
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
    flex: 1,
    flexDirection: "row",
    backgroundColor: '#000',
    borderBottomWidth: .25,
    borderColor: 'grey',
    height: 100,
    paddingTop: 1,
    padding: 1,
    width: "100%",
  },
  companyRow: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#000',
    height: 30,
    padding: 1,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    backgroundColor: '#000',
    height: 30,
    marginTop: 40,
    width: "100%",
    alignItems: "center"
  },
  flatlistView: {
    width: "100%",
    height: "100%",
    marginTop: 2
  },
  TextViewStyle:
  {
    borderRadius: 5,
    width: 80,
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
    color: 'white', fontSize: 18, textAlign: 'right', right: 3, width: 80, height: 40, fontFamily: 'Avenir-Black'
  }
})



  

