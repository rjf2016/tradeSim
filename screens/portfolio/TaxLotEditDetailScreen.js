import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableHighlight } from 'react-native';
import { observer, inject } from 'mobx-react'
import { Navigation } from 'react-native-navigation';
import DatePicker from 'react-native-datepicker'
import HoldingsStore from '../../stores/HoldingsStore';
import moment from 'moment-business-days';

@inject('holdingsstore')
@observer
export default class TaxLotEditDetailScreen extends Component {
   static options() {
     return {
       topBar: {
         title: { text: "", color: 'white', fontSize: 25, background: { color: '#000' } },
         color: 'green',
         visible: true,
         drawBehind: true,
         background: { color: '#000' },
         rightButtons: [{ id: 'saveButton', text: 'Done', color: 'lightgreen'}],
         leftButtons: [{ id: 'cancelButton', text: 'Cancel', color: 'red' }],
       }
      }
    }

 constructor(props) {
    super(props);
  
    this.state = {
      portfolioId: this.props.portfolioId,
      taxlotId: this.props.taxlotId,   // if null passed, new taxlot to insert (not an update)
      symbol: this.props.symbol,
      company: this.props.company,  //new
      price: this.props.price ? this.props.price : '',
      quantity: this.props.quantity ? this.props.quantity : '',
      tradeDate: this.props.tradeDate,
      date: this.props.tradeDate ? this.props.tradeDate : '',
    }
    this.closeModal = this.closeModal.bind(this);
    this.deleteTaxLot = this.deleteTaxLot.bind(this);
    Navigation.events().bindComponent(this); // <== Will be automatically unregistered when unmounted
  }

  componentDidMount() {  
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        title: {
          text: this.state.symbol,
          color: 'white',
          fontFamily: 'Avenir-Black',
          fontSize: 18
        }
      }
    }); 
  }
  
  navigationButtonPressed({ buttonId }) {
    if (buttonId == 'saveButton') {
     if (!this.state.taxlotId) {   //if null,  'new' tax lot being added
        HoldingsStore.addTaxLot(this.state.portfolioId, this.state.symbol, this.props.company, parseFloat(this.state.quantity), parseFloat(this.state.price), this.state.date)
        Navigation.pop(this.props.componentId);
      }
      else {  //  it's an update
        HoldingsStore.updateTaxLot(this.state.portfolioId, this.state.taxlotId, this.state.symbol, parseFloat(this.state.quantity), parseFloat(this.state.price), this.state.date)
        Navigation.pop(this.props.componentId);
      }
    }
    if (buttonId == 'cancelButton') {
      Navigation.pop(this.props.componentId);
    }
  }

  deleteTaxLot() {
    HoldingsStore.deleteTaxLot(this.state.portfolioId, this.state.symbol, this.state.taxlotId);
    Navigation.pop(this.props.componentId);
  }

  closeModal() {
    Navigation.dismissModal(this.props.componentId);
  }

  render() {  
    const todayDate = moment(new Date()).format("MM/DD/YYYY").toString();

    return (
      <View style={styles.main}>       
        <View style={{marginTop: 130, width: '100%', backgroundColor: '#000'}} >
          <Text style={styles.labelField}>Cost per Share</Text>
              <TextInput
                style={styles.valueField}
                placeholder=""
                autoFocus={false}   
                placeholderTextColor='lightgreen'
                numericvalue
                keyboardType={'decimal-pad'}
                onChangeText={text => { this.setState({ price: text }) }}
                value={String(this.state.price)}
              />
        </View>

        <View style={{ width: '100%', backgroundColor: '#000' }} >
        <Text style={styles.labelField}>Quantity of Shares</Text>
            <TextInput
              style={styles.valueField}
              placeholder=""
              autoFocus={false}   // this will auto-launch the keyboard
              placeholderTextColor='lightgreen'
              numericvalue
              keyboardType={'decimal-pad'}
              onChangeText={text => { this.setState({ quantity: text }) }}
              value={String(this.state.quantity)}
            />
            </View>

        <View style={{ width: '100%', height:300, backgroundColor: '#000' }} >
          <Text style={styles.labelField}>Trade Date</Text>
          <DatePicker
            style={styles.datePickerStyle}
            date={this.state.date} //initial date from state
            mode="date" //The enum of date, datetime and time
            placeholder="select date"
            format="MM-DD-YYYY"
            minDate="01-01-1970"
            maxDate={todayDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0, 
              },
              dateInput: {
                marginLeft: 36,
                borderWidth: 0,
                fontSize: 16,
                fontFamily: 'Avenir-Black',
                color: 'white'
              },
              dateText: {
                fontSize: 16,
                fontFamily: 'Avenir-Black',
                color: 'white'
              },
              placeholderText: {
                fontSize: 16,
                fontFamily: 'Avenir-Black',
                color: 'white'
              }
            }}
            onDateChange={(date) => { this.setState({ date: date }) }}
          />
        </View>

        <View style={styles.deleteTaxLot}>
          <TouchableHighlight onPress={() => this.deleteTaxLot()}>
            <Text style={{ color: 'red', fontSize: 14 }}>Delete Tax Lot </Text>
          </TouchableHighlight>
        </View>

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
    top: 1,
    alignItems: 'center',
  },
  deleteTaxLot: {
    position: 'absolute',
    bottom: 30,
  },
  labelField: {
    width:'100%',
    height: 18,
    fontSize: 12,
    textAlign: 'left',
    backgroundColor: '#000',
    color: 'lightgrey',
    fontFamily: 'Avenir-Black',
   
  },
  valueField: {
    width: '100%',
    fontSize: 16,
    height: 30,
    backgroundColor: '#000',
    color: 'white',
    fontFamily: 'Avenir-Black',
    borderBottomWidth: 0.5, 
    borderBottomColor: 'blue',
    marginBottom: 20
  },
  buttonText: {
    fontSize: 18,
    color: '#111',
    alignSelf: 'center'
  }
});
