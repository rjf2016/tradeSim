import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, TouchableHighlight } from "react-native";
import { LineChart } from 'react-native-chart-kit';

export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.props.chartData,
      currentSelection: this.props.selection
    }
  }

render() { 
  if(this.props.chartData === undefined)
    return null;

  var { height, width } = Dimensions.get('window');

  const data = {
    labels: this.props.chartData.labels,
    datasets: [
      {
        data: this.props.chartData.data,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, 
        strokeWidth: "2", // optional
      }
    ],
  };
  return <View style={{paddingBottom:5}}>
    <LineChart
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16
      }}
    data={data}
    withDots={false}
    width={width}
    height={220}
    withShadow={true}
    withInnerLines={false}
    withOuterLines={true}
    withHorizontalLines={true}
      chartConfig={{
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false // optional
}}
  />
  <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-around', color:'white', backgroundColor:'lightgrey'}}>
      <TouchableHighlight onPress={() => this.props.refDrawChart('dynamic', false)} >
        <Text style={this.props.selection == 'dynamic' ? { color: 'blue', fontWeight: 'bold' } : null}>1D</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this.props.refDrawChart('5dm', false)} >
        <Text style={this.props.selection == '5dm' ? { color: 'blue', fontWeight: 'bold' } : null}>5D</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this.props.refDrawChart('1m', false)} >
        <Text style={ this.props.selection=='1m' ? {color:'blue', fontWeight:'bold'} : null}>1M</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this.props.refDrawChart('6m', false)} >
        <Text style={this.props.selection == '6m' ? { color: 'blue', fontWeight: 'bold' } : null}>6M</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this.props.refDrawChart('1y', false)} >
        <Text style={this.props.selection == '1y' ? { color: 'blue', fontWeight: 'bold' } : null}>1Y</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={() => this.props.refDrawChart('5y', false)} >
        <Text style={this.props.selection == '5y' ? { color: 'blue', fontWeight: 'bold' } : null}>5Y</Text>
        </TouchableHighlight>
      </View>
  </View>

  }
}
const styles = StyleSheet.create({
   container: {
    flex: 1,
    flexDirection: 'row',
    width: "100%",  
    padding: 2,
    backgroundColor: 'black', 
    borderWidth: .5,
    borderRadius: 7,
    borderColor: 'grey',
    height:200
  },
  priceText: {
    textAlign: 'left',
    fontSize: 32,
    color: 'white',
    fontFamily: 'Avenir-Black',
  },
  changeText: {
    textAlign: 'left',
    fontSize: 22,
    color: 'white',
    fontFamily: 'Avenir-Black',
  }
  
})