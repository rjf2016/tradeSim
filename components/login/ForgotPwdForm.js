import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

class ForgotPwdForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      email: ''
    }
    this.onforgotPwdClick = this.onforgotPwdClick.bind(this);
  }

  onforgotPwdClick() {
    this.props.callbackForgotPwd(this.state.email);
  }

  render() {
    return (
      <View style={style.container}>
        <TextInput style={style.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.onforgotPwdClick()}
          autoCorrect={false}
          returnKeyType="next"
          keyboardType='email-address'
          placeholder='Email'
          placeholderTextColor='gray'
          onChangeText={(text) => this.setState({ email: text })}
        />

        <TouchableOpacity style={style.buttonContainer}
          onPress={this.onforgotPwdClick}>
          <Text style={style.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    padding: 20,
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
    color: 'black',
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 6,
  },
  buttonContainer: {
    backgroundColor: '#2980b6',
    paddingVertical: 15,
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
})
module.exports = ForgotPwdForm;