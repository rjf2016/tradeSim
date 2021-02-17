import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { LineChart } from 'react-native-chart-kit';


// For Now, Defaults to 1M Historical Chart Data only 
export default class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.props.chartData,
    }
  }

render() { 
  if(this.state.chartData === undefined)
    return null;

  var { height, width } = Dimensions.get('window');

  const data = {
    labels: this.state.chartData.labels,
    datasets: [
      {
        data: this.state.chartData.data,
        color: (opacity = 1) => `rgba(214, 265, 144, ${opacity})`, 
        strokeWidth: 3, // optional
      }
    ],
  };
  return <View style={{paddingBottom:5}}>
    <LineChart
    data={data}
    withDots={true}
    width={width}
    height={220}
    horizontalLabelRotation={180}
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "black",
      backgroundGradientTo: "black",
      decimalPlaces: 2, 
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      } 
    }}
  />
  <View style={{ flex: 1, flexDirection: 'row', justifyContent:'space-around', color:'white', backgroundColor:'lightgrey'}}>
        <Text>1D</Text><Text>5D</Text><Text style={{color:'blue', fontWeight:'bold'}}>1M</Text><Text>6M</Text><Text>1Y</Text><Text>5Y</Text>
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