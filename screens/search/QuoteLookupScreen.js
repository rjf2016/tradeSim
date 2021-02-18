import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableHighlight, Keyboard, StyleSheet } from 'react-native';
import { observer, inject} from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'
import { Navigation } from 'react-native-navigation';

@inject('quotesstore')
@inject('holdingsstore')
@observer
export default class QuoteLookupScreen extends Component {
   static options() {
     return {
       topBar: { title: { text: 'Search', color: 'white', fontSize: 25 }, background: { color: '#000' },
         rightButtons: [{ id: 'saveButton', text: 'Save', color: 'lightgreen' }],
         leftButtons: [{ id: 'cancelButton', text: 'Cancel', color: 'red' }],
         }
      }
    }

 constructor(props) {
    super(props);

    this.state = {
      bestMatches: [],
      error: false,
      searchText: '',
      symbolsCached: this.props.symbols ? this.props.symbols : [],  // symbols already held
      newSymbols: [],  // symbols that are New;  will be saved 
      selectionMade: false  // set to true after first "new" symbol picked
    }
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  componentDidMount() {
    if(this.props.symbols) {
      var sArray = [];
      Object.entries(this.props.symbols).forEach(entry => {
          sArray.push(entry[1])
      });
      this.setState({ searchText: '', symbolsCached: sArray})
    }
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'saveButton') {
      this.closeModal();
    }
    if (buttonId == 'cancelButton') {
      Navigation.dismissModal(this.props.componentId);
    }
  }
  
  handleChange = text => {
    if (!text)
      return this.setState({ bestMatches: [], searchText: '' });

    this.setState({
      searchText: text.toUpperCase(),
    });
  };

  search(searchText) {
   // this.props.holdingsstore.searchForSymbols(searchText)  // uncomment to retrieve symbols from Firebase instead of market data API calls
    this.props.quotesstore.getSymbols(searchText)
      .then(res => {    
        this.setState({ bestMatches: res, error: res.error || null });
      })
      .catch(error => {
        console.log(error)
      });
  }
 
  closeModal() {
    if (this.state.selectionMade)
      this.props.saveSymbolsRef('saveSymbols', this.props.portfolioId, null, this.state.newSymbols, null);
      Navigation.dismissModal(this.props.componentId);
  }

  //Check if you already own this stock, if not, push it to newSymbols so it can later be 'saved'
  chosenItem(selectedItem) {   
    if (!this.symbolExists(selectedItem.item['symbol'])) {
      this.state.newSymbols.push({ symbol: selectedItem.item['symbol'], company: selectedItem.item['securityName'] });
      this.state.symbolsCached.splice(0, 0, { symbol: selectedItem.item['symbol'], company: selectedItem.item['securityName'] })
      this.setState({ selectionMade: true, bestMatches: [], searchText: ''}); 
    }  
  }
  symbolExists(symbol) {
    for (var i = 0; i < this.state.symbolsCached.length; i++) {
      if (this.state.symbolsCached[i].symbol == symbol)
        return true;
    }
    return false;
  }

  newSymbolExists(symbol) {
    for (var i = 0; i < this.state.newSymbols.length; i++) {
      if (this.state.newSymbols[i].symbol == symbol)
        return true;
    }
    return false;
  }

  render() {
    var heading = null;
 
    if (this.state.symbolsCached.length > 0 && this.state.searchText == '') {
      heading = <View style={{ width: '100%', top: 65, flexDirection: 'row'}}>
                  <View style={{ width: '50%' }}>
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold', textAlign: 'left', width:'100%'}}>Recent symbols</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                        <TouchableHighlight onPress={() => this.setState({searchText: '', bestMatches: [], symbolsCached: []})}>
                              <Text style={{ color: 'white', fontSize: 14, fontWeight:'bold', right:20, textAlign: 'right', width: '100%' }}>Clear</Text>
                        </TouchableHighlight>
                    </View>
              </View>;
      this.state.bestMatches = this.state.symbolsCached;
    }

    return (
      <View style={styles.main}>
        <View style={{ flex: 1, flexDirection: 'row', top:15}} >
         <TextInput style={styles.searchInput} placeholder="Search for a symbol" placeholderTextColor='gray' onChangeText={text => this.handleChange(text)}
          value={this.state.searchText} autoCorrect={false} clearButtonMode='always' />        
          <TouchableHighlight style={styles.searchHighlight} onPress={() => this.search(this.state.searchText)}>
            <Text style={styles.search}>Search</Text>
          </TouchableHighlight>      
        </View>
 
        {heading}
       
        <FlatList
          style={{marginTop:75, width:'100%', height:'100%'}}
          data={this.state.bestMatches ? this.state.bestMatches : this.state.symbolsCached}
          showsVerticalScrollIndicator={false}  
          keyboardShouldPersistTaps='always'
          renderItem={({ item, index }) => (
            <View key={item['symbol']} style={index % 2 ? { width: '95%', paddingLeft: 3, borderRadius: 4, left: 5, height: 48, backgroundColor: 'black' } : { width: '95%', paddingLeft: 3, borderRadius: 4, left: 5, height: 48, backgroundColor: '#252526' } }>
              <View style={styles.container}>
                <Text style={{ flex: 1, color: 'white', width: '100%', fontSize: 14, fontFamily: 'Avenir-Black', fontWeight: 'bold', textAlign: 'left' }}>{item['symbol']}</Text>
                <TouchableHighlight onPress={() => this.chosenItem({ item })}>
                  {this.symbolExists(item['symbol']) ? 
                      <FontAwesomeIcon icon={faCheckCircle} size={22} color={this.newSymbolExists(item['symbol']) ? 'lightgreen' : 'white'} /> 
                          : 
                          <FontAwesomeIcon color={'grey'} size={22} icon={faCircle} /> 
                    }   
                </TouchableHighlight>
              </View>
              <View style={{ flex: 1, flexDirection: "column", width: '100%' }}>
                <Text style={{ color: 'grey', fontFamily: 'Avenir-Black', fontSize: 12 }}>{item['securityName']}</Text>
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
   // backgroundColor: 'black',
 //   left: 5,
    top: 3,
    bottom: 3,
    paddingTop: 5,
    paddingBottom: 5,
    padding: 1,
    width: "97%",
    alignItems: 'center',
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
    borderRadius: 8,
    color: 'white',
    fontFamily: 'Avenir-Black'
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
    color: 'lightgreen',
    width: '90%',
    padding: 4,
    fontFamily: 'Avenir-Black'
  },
  searchHighlight: {
    padding: 0,
    height: 5,
    width: '30%'
  }
});


