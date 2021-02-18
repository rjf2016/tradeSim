import React, { Component } from 'react';
import { Text } from 'react-native';
import {View,StyleSheet,KeyboardAvoidingView, TouchableHighlight} from 'react-native';
import { inject, observer } from 'mobx-react'
import SignUpForm from '../../components/login/SignUpForm';
import { goToLogin } from '../utils/Navigation'

@inject('authstore')
@observer
export default class SignUpScreen extends Component {
 
  constructor(props) {
    super(props);
    
    this.state = {
      authstore: this.props.authstore,
      username: '',
      pwd: '',
      error: ' '
    }
    this.onSignUpClick = this.onSignUpClick.bind(this);
  }

  //this function is called from the SignupForm once person presses sign up with
  //their email and password.
  onSignUpClick(username, password) {
    //1. Register with Firebase
    //2. Send Confirmation     
    this.props.authstore.signUp(username, password).then((userData) => {

      goToLogin();
    }
    ).catch((error) => {
      this.setState({error: error.message});
    }
    );
  }

  render() {
    const { authstore } = this.state;

    var e = this.state.error ? {color:'red'} : null;
    return (
      <KeyboardAvoidingView behavior="padding" style={style.container}>
        <Text style={style.textCaptionLg}>To Sign-up for Trade Sim </Text>
        <Text style={style.textCaption}>Please enter a valid email address </Text>
        <Text style={style.textCaption}>and choose a password.</Text>
        <Text style={[style.textCaption, e]}>{this.state.error}</Text>
        <View style={style.loginContainer}>    
          <SignUpForm callbackSignUp={this.onSignUpClick} />
        </View>
        <View style={{alignItems:'center', bottom: 80}}>
          <TouchableHighlight onPress={() => goToLogin()}>
            <Text style={{ color: 'white', fontFamily: 'Avenir-Black' }}> Back to Login </Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>

    );
  }
}
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  textCaption: {
    top: 230,
    padding: 10,
    color: 'white',
    fontSize: 16,
    fontFamily: 'Avenir-Black',
    textAlign: 'center'
  },
  textCaptionLg: {
    top: 230,
    padding: 10,
    color: 'gold',
    fontSize: 18,
    fontFamily: 'Avenir-Black',
    textAlign: 'center'
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})