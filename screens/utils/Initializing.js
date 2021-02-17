import React, { Component } from 'react';
import {View} from 'react-native'
import { inject, observer } from 'mobx-react'
import Firebase from 'firebase';
import { goToLogin } from './Navigation'
import { goToPortfolioSummary } from './Navigation'
import SplashScreen from 'react-native-splash-screen';

@inject('authstore')
@observer
export default class Initializing extends Component { 
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    };
   
    Firebase.auth().onAuthStateChanged((user) => {  
      console.log(user)
      if (user != null) 
        goToPortfolioSummary();
      else 
        goToLogin();
    })
  }
  
  componentDidMount() {
    SplashScreen.hide();
  }
  
render() {
  return (
    <View style={{width:'100%', height:'100%', backgroundColor:'black'}}></View>
  );
}
}

