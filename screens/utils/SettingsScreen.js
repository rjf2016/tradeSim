import React, { Component } from 'react';
import { View, Text, Image, Switch, Linking, TouchableOpacity, TouchableHighlight, StyleSheet } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { inject, observer } from 'mobx-react'
import { goToLogin } from './Navigation'

@inject('authstore')
@observer
export default class SettingsScreen extends Component {
  
  constructor(props) {
    super(props);
   
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted 
    this.closeModal = this.closeModal.bind(this);
    this.onGoogleLogout = this.onGoogleLogout.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.state = {
      adsStatus: this.props.authstore.userPaid,
      isEnabled: this.props.authstore.api_isProduction
    }
  }
  
  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'closeModal') {
      this.closeModal();
    }
  }

  onGoogleLogout() {
    this.props.authstore.onLogoffGoogle().then( x => {
     this.closeModal(); 
    });
  }

  onSignIn() {
    this.props.authstore.onSignOut();   
  }

 async onSignOut() { 
   try {
        if(this.props.authstore.user.providerData[0].providerId == 'password') {
            await this.props.authstore.signOut().then( x => {
            this.closeModal();
              goToLogin();
            });
        }
        if (this.props.authstore.user.providerData[0].providerId == 'google.com') {
          await this.props.authstore.onLogoffGoogle().then(x => {
            goToLogin();
          });
        } 
   } catch (error) {
     this.error = error.message;
     console.log("Signout Error: " + error.message)
   }
  }

  closeModal() {
    Navigation.dismissModal(this.props.componentId);
  }

  onChangeFunction(newState) {
    this.setState(newState);
    this.props.authstore.setProductionAPIStatus(newState.isEnabled)
  }

  render() {
    const { authstore } = this.props;

    var authenticatedUserMessage = this.props.authstore.user ? 
      <Text style={{ top: 0, color: 'white', textAlign: 'center', fontSize: 18, height: 40 }}></Text> :
      <TouchableOpacity onPress={this.onSignIn}> 
          <Text style={styles.buttonText}>SignIn</Text> 
      </TouchableOpacity>
          
    return (
      <View style={styles.main}>
        <Image source={require('../../img/trade-sim-new-logo.png')}></Image>
        {authenticatedUserMessage}
        <TouchableHighlight style={styles.submitSignOut} onPress={this.onSignOut} underlayColor='#252526'>
          <Text style={styles.buttonSignoutText}>Sign-out</Text>
        </TouchableHighlight>

       <View style={styles.termsView}>
          <View style={{ width: 36, backgroundColor: 'black', height: 25, justifyContent:'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => Linking.openURL('https://iexcloud.io')} >
              <Image
                style={{ resizeMode: 'center'}}
                source={require('../../img/icon-white.png')}
              />
            </TouchableOpacity>
           </View>
          <View style={{ width: 300, height: 25, justifyContent: 'center', }}>
            <TouchableOpacity
                  style={styles.submit}
                  onPress={() => Linking.openURL('https://iexcloud.io')}
                  underlayColor='lightblue'>
              <Text style={styles.termsText}>Data provided by IEX Cloud</Text>
            </TouchableOpacity>
           </View>
        </View>
        <View style={{ height:35, alignItems:'center', width:'50%', backgroundColor: 'black' }}>
          <Text style={styles.termsText}>Use Production API</Text>
          <Switch
            trackColor={{ false: "#767577", true: "lightgreen" }}
            thumbColor={this.state.isEnabled ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => this.onChangeFunction({ isEnabled: value })}
            value={this.state.isEnabled}
          />
          
        </View>
        
      </View>     
    )
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsView: {
    flexDirection: 'row',
    backgroundColor: 'black',
    top: 180,
    paddingLeft:15,
    alignItems: 'center',
    width: 330,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'grey',
  },
  termsText: {
    fontSize: 16,
    color:'white',
    fontFamily: 'Avenir-Black'
  },
  submitSignOut: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#000',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    height: 32
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center',
    color: 'white'
  },
  buttonText: {
    fontSize: 18,
    height: 50,
    color: 'white',
    alignItems: 'center',
  },
  submit: {
    bottom: 0,
    width: '90%',
    height:64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  buttonSignoutText: {
    fontSize: 18,
    height: 24,
    color: 'white',
  
  },
  button: {
    color: 'black',
    fontSize: 18,
    width: "100%",
    height: 22,
    textAlign: 'center',
  }
});
