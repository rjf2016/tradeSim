// LoginScreen.js
import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView} from 'react-native';
import { inject, observer } from 'mobx-react'
import { goToSignUp, showForgotPasswordModal } from '../utils/Navigation'
import { GoogleSigninButton } from 'react-native-google-signin';
import LoginForm from '../../components/login/LoginForm';
import SplashScreen from 'react-native-splash-screen';

@inject('authstore')
@observer
export default class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      authstore: this.props.authstore,
      username: this.props.authstore.user.email,
      pwd: '',
      userInfo: null,
      error: ''
    }

    this.onSignUpNavigate = this.onSignUpNavigate.bind(this);
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onGoogleLoginSetup = this.onGoogleLoginSetup.bind(this);
    this.onGoogleLogin = this.onGoogleLogin.bind(this);
    this.onGoogleLogout = this.onGoogleLogout.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.onForgotNavigate = this.onForgotNavigate.bind(this);
  }

  componentDidMount() {
    SplashScreen.hide();
  }
  
onGoogleLoginSetup(){
  this.state.authstore.setupGoogleSignin();
}

async onGoogleLogin(){
  this.state.authstore.setupGoogleSignin();
  this.state.authstore.GooglesignIn();
}

onGoogleLogout(){
  this.state.authstore.onLogoffGoogle();
}

onSignOut(){
  this.state.authstore.signOut();
}

async onLoginClick(username, password) {
  await this.state.authstore.signIn(username, password
    ).then(userData => {
      if (userData === undefined)
        this.setState({ error: '' })
      else
         this.setState({error: userData})
    }
    ).catch((error) => {
      console.log(error)
    }
    );
  }

  onSignUpNavigate() {
    goToSignUp(this.props);
  }
  onForgotNavigate(email) {
    showForgotPasswordModal();
  }

  render() {
    const { authstore } = this.props;
    const e = this.state.error;

    return ( 
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={styles.loginContainer}>
          <View style={styles.viewLogin}>
            <Image source={require('../../img/trade-sim-new-logo.png')}></Image>
            <Text style={styles.tradeSimText}>Trade Sim</Text>
            <Text style={styles.errorText}> {e} </Text>
            
          </View>
          
          <LoginForm  username={this.state.username} pwd={this.state.pwd} props={this.props} callbackForgot={this.onForgotNavigate} callbackLogin={this.onLoginClick} callbackSignUp={this.onSignUpNavigate} />
       
          <View style={styles.viewLogin}>
              <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
              onPress={this.onGoogleLogin} />
          </View>
          <View style={styles.viewLogin}>
            <TouchableOpacity styles={styles.buttonContainer}
              onPress={this.onSignOut}>
              <Text style={styles.labels}></Text>
              
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  viewLogin: {
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  tradeSimText: {
       textAlign: "center",
       fontWeight: "500",
       fontSize: 38,
       color: 'white',
     },
  labels: {
    color: 'white',
    fontSize: 12, 
    fontFamily: 'Avenir-Black',
  },
  errorText: {
    paddingTop: 20,
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Avenir-Black',
  }
   })
