import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native'

class LoginForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      auth: '',
      username: '',
      password: ''
    }
    this.onLoginClick = this.onLoginClick.bind(this);
  }

  onLoginClick() {
    this.props.callbackLogin(this.state.username, this.state.password);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput style={styles.input}
          autoCapitalize="none"
          onSubmitEditing={() => this.passwordInput.focus()}
          autoCorrect={false}
          returnKeyType="next"
          keyboardType='email-address'
          placeholder='Email'
          placeholderTextColor='gray'
          onChangeText={(text) => this.setState({ username: text })}
        />

        <TextInput style={styles.input}
          returnKeyType="go"
          ref={(input) => this.passwordInput = input}
          placeholder='Password'
          placeholderTextColor='gray'
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry />

        <TouchableOpacity style={styles.buttonContainer}
          onPress={this.onLoginClick}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.loginTextContainer}>
          <Text style={[styles.label, { textAlign: 'left' }]} onPress={this.props.callbackForgot}>Forgot password?</Text>
          <Text style={[styles.label, {textAlign: 'right'}]} onPress={this.props.callbackSignUp}>Sign up</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    padding: 10,
    color: 'white',
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 6,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'white',
    fontFamily: 'Avenir-Black'
  },
  buttonContainer: {
    backgroundColor: 'green',
    padding: 15,
    marginRight: 50,
    marginLeft: 50,
    borderRadius: 5
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700'
  },
  loginTextContainer: {
    marginTop: 10,
    marginRight: 50,
    marginLeft: 50,
    backgroundColor: 'black',
    flexDirection: 'row',
    paddingRight: 5,
    paddingLeft: 5
  },
  label: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontFamily: 'Avenir-Black'
  }
})
module.exports = LoginForm;