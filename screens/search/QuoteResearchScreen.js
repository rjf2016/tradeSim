import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableHighlight, Keyboard, StyleSheet } from 'react-native';
import { observer, inject} from 'mobx-react';
import { showQuoteDetailModal } from '../utils/Navigation';

@inject('holdingsstore')
@observer
export default class QuoteResearchScreen extends Component {
   static options() {
     return {
       topBar: { title: { text: 'Search', color: 'white', fontSize: 25 }, background: { color: '#000' } }
      }
    }

 constructor(props) {
    super(props);

    this.state = {
      bestMatches: [],
      error: false,
      searchText: '',
      selectionMade: false  // set to true after first "new" symbol picked
    }
    this.onPress = this.onPress.bind(this);  
  }

  onPress(fund) {
    this.setState({ searchText: this.state.searchText });  
  }

  handleChange = text => {
    if(!text)
      return this.setState({ bestMatches: [], searchText: '' });
  
    this.setState({ searchText: text.toUpperCase(),
    }); 
  };

 search(searchText) {
   Keyboard.dismiss();

   if(!searchText)
     return;

    this.props.holdingsstore.searchForSymbols(searchText)
      .then(res => {
        this.setState({
          bestMatches: res,  
          error: res.error || null
        });
      })
      .catch(error => {
        console.log(error)
      });
}
  
cancelText() {
  this.setState({ bestMatches: [], searchText: '' }); 
}

chosenItem(selectedItem) { 
  this.setState({ bestMatches: [], searchText: '' })
  showQuoteDetailModal(selectedItem.item.symbol, selectedItem.item.companyName);
  Keyboard.dismiss();
}

render() {
    return (
      <View style={styles.main}>
        <View style={{ flex: 1, flexDirection: 'row', top:1}} >
         <TextInput
          style={styles.searchInput}
          placeholder="Search for a symbol"
          placeholderTextColor='gray'
          onChangeText={text => this.handleChange(text)}
          value={this.state.searchText}
          autoCorrect={false}
          clearButtonMode='always'
        />
         
          <TouchableHighlight style={styles.searchHighlight} onPress={() => this.search(this.state.searchText)}>
            <Text style={styles.search}>Search</Text>
         </TouchableHighlight>
         </View>

        <FlatList
          style={{marginTop:60, width:'100%', height:'100%'}}
          data={this.state.bestMatches ? this.state.bestMatches : this.state.symbolsCached}
          showsVerticalScrollIndicator={false}  
          keyboardShouldPersistTaps='always'
          renderItem={({ item, index }) => (
            <View key={item['symbol']} style={index % 2 ? { width: '95%', paddingLeft: 3, borderRadius: 4, left: 5, height: 42, backgroundColor: 'black' } : { width: '95%', paddingLeft: 3, borderRadius: 4, left: 5, height: 42, backgroundColor: '#252526' }}>
              <View style={styles.container}>
                 <TouchableHighlight onPress={() => this.chosenItem({ item })}>
                  <Text style={{ color: 'white', fontFamily: 'Avenir-Black', fontWeight:'bold', fontSize: 14, textAlign: 'left', width: '100%' }}>{item['symbol']}</Text>   
                </TouchableHighlight>
              </View>
              <View style={styles.containerColumn}>
                <TouchableHighlight onPress={() => this.chosenItem({ item })}>
                  <Text style={{ color: 'silver', fontFamily: 'Avenir-Black', fontSize: 12, textAlign: 'left', width: '100%' }}>{item['company'].length > 60 ? item['company'].substring(0, 60) + "..." : item['company']}</Text>
                </TouchableHighlight>
              </View>
            </View>
           )} 
          keyExtractor={(item, index) => item['symbol']} 
        />
      </View>     
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: "100%",
    padding: 5,
    flexDirection: 'column',
    backgroundColor: '#000',
    top: 0,
    alignItems: 'center',
  },
  container: {
    flexDirection: "row",
    top: 3,
    bottom: 3,
    padding: 0,
    width: "100%",
    alignItems: 'center',
  },
  containerColumn: {
    flexDirection: "column",
    top: 3,
    bottom: 3,
    padding: 0,
    width: "100%",
    alignItems: 'flex-start',
  },
  flatview: {
    marginLeft: 5,
    backgroundColor: '#000',
    top: 10,
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    borderRadius: 2,
    color: 'white'
  },
  searchInput: {
    marginLeft: 5,
    marginTop: 1,
    height: 30,
    padding: 4,
    width: '70%',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'white',
    fontFamily: 'Avenir-Black',
    borderRadius: 8,
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  },
  search: {
    backgroundColor: '#000',
    top: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    height: 30,
    textAlign: 'center',
    fontFamily: 'Avenir-Black',
    color: 'lightgreen',
    width: '90%',
    padding: 4,
  },
  searchHighlight: {
    padding: 0,
    height: 5,
    width: '30%'
  }
});


