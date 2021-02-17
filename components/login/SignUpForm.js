import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native'

class SignupForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    }
    this.onSignUpClick = this.onSignUpClick.bind(this);
  }

  onSignUpClick() {
    Keyboard.dismiss();
    this.props.callbackSignUp(this.state.username, this.state.password);
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
          clearButtonMode='always'
        />

        <TextInput style={styles.input}
          returnKeyType="go"
          ref={(input) => this.passwordInput = input}
          placeholder='Password'
          placeholderTextColor='gray'
          onChangeText={(text) => this.setState({ password: text })}
          secureTextEntry 
          clearButtonMode='always'
          />

        <TouchableOpacity style={styles.buttonContainer}
          onPress={this.onSignUpClick}>
          <Text style={styles.buttonText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
module.exports = SignupForm;