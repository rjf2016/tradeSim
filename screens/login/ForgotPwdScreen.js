import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Text, TouchableHighlight} from 'react-native';
import { inject, observer } from 'mobx-react'
import ForgotPwdForm from '../../components/login/ForgotPwdForm';
import { Navigation } from 'react-native-navigation';
import { goToLogin } from '../utils/Navigation';
@inject('authstore')
@observer
export default class ForgotPwdScreen extends Component {
  constructor(props) {
    super(props);
    
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
    
    this.state = {
      auth: this.props.authstore,
      email: '',
      info: '',
      error: ' '
    }
    this.onforgotPwdClick = this.onforgotPwdClick.bind(this);
  }

  //this function will use Firebase to send an email link to reset the password.
  onforgotPwdClick(email) {
    this.props.authstore.forgotPassword(email).then((userData) => {
      this.setState({ error: ' ' });
      this.setState({ info: 'Password Reset email sent!' });
      goToLogin();
      
    }
    ).catch((error) => {
      this.setState({error: error.message});
      setTimeout(() => { this.setState({error: ''}) }, 5000);
    }
    );
  }

  render() {
    const { authstore } = this.state;
    var e = this.state.error ? {color:'red'} : null;

    return (
      <KeyboardAvoidingView behavior="padding" style={style.container}>
        <Text style={style.textCaption}>Please enter your email address </Text>
        <Text style={[style.textCaption, e]}>{this.state.error}</Text>
        <Text style={[style.textCaption, {color:'lightgreen'}]}>{this.state.info}</Text>
        <View style={style.loginContainer}>    
          <ForgotPwdForm callbackForgotPwd={this.onforgotPwdClick} />
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
    fontSize: 18,
    textAlign: 'center'
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})