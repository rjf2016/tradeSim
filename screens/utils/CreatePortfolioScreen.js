import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';

export default class CreatePortfolioScreen extends Component {
  static options() {
    return {
      overlay: {
        interceptTouchOutside: true,
      }
    }
  }

  constructor(props) {
    super(props);

    this.state = {
       componentId: props,
       title: props.title,
       message: props.message,
       cbFunction: props.cbFunction,
       portfolioName: ''
    }
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }
  
  dismiss() {
      Navigation.dismissOverlay('CreatePortfolio');
      return 1;
  }
  handleChange = text => {
    this.setState({
      portfolioName: text
    });  
  } 

  handleCallback() {
   this.state.cbFunction(this.state.portfolioName)
  }

render() {
  return (
    <View style={styles.root}>
      <View style={styles.alert}>
        <View style={{ height:100 }}>
          <Text style={styles.title}>{this.state.title}</Text>
          <Text style={styles.message}>{this.state.message}</Text>
          <TextInput
            style={{ width: 200, height: 22, fontSize: 20, borderRadius: 5, color: 'white', backgroundColor: '#252526', fontFamily: 'Avenir-Black', fontWeight: 'bold' }}
            placeholder="Name your portfolio"
            autoFocus={false}  
            placeholderTextColor='grey'
            keyboardType={'default'}
            onChangeText={text => this.handleChange(text)}
            value={this.state.portfolioName}
          />
      </View>
      <View style={{ flexDirection:'row'}}> 
          <View style={{ width: 80, right: 20 }}>
            <TouchableOpacity onPress={this.handleCallback.bind(this)} style={styles.appButtonContainer}>
              <Text style={styles.appButtonText}>Create</Text>
            </TouchableOpacity>
          </View>  
          <View style={{ width: 80, left: 20 }}>
            <TouchableOpacity onPress={this.dismiss} style={styles.appButtonContainer}> 
              <Text style={styles.appButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
      </View>
     </View>        
    </View>
  );
 }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000050',
  },
  alert: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    opacity: 0.85,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
    width: 250,
    elevation: 4,
    padding: 16,
    borderRadius: 20
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#252526",
    borderColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontFamily: 'Avenir-Black'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  message: {
    marginVertical: 8,
  },
});