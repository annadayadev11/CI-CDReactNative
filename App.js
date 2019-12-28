
import React, { Component } from 'react';

//this crashes is going to contain in the retest crash method  that we can use
import Crashes from 'appcenter-crashes';

//for appcenter analytics track
import Analytics from 'appcenter-analytics';

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';


export default class App extends Component {

  //now as soon as the application is created instead of the constructor we are going to be checking for the previous session if it did crash we're going to display an alert just like this.
  constructor(props) {
    super(props);

    this.state = {
      inflationRate: 0.0,
      riskFreeRate: 0.0,
      amount: 0.0,
      timeInYears: 1,
      afterInflation: 0.0,
      atRiskFree: 0.0,
      atRiskFreeAfterInflation: 0.0,
      difference: 0
    }

    this.checkPreviousSession();
  }

  calculateInflationImpact(value, inflationRate, time) {
    return value / Math.pow(1+inflationRate, time);
  }

  calculate() {
    afterInflation = this.calculateInflationImpact(this.state.amount, this.state.inflationRate/100, this.state.timeInYears);
    atRiskFree = this.state.amount * Math.pow(1+this.state.riskFreeRate/100, this.state.timeInYears);
    atRiskFreeAfterInflation = this.calculateInflationImpact(atRiskFree, this.state.inflationRate/100, this.state.timeInYears);
    difference = atRiskFreeAfterInflation - afterInflation;

    this.setState({
      afterInflation,
      atRiskFree,
      atRiskFreeAfterInflation,
      difference
    });
  }

  //we want to track when the app crushes so we can apologised in such event - this will prompt because the previous event the user opened the app got crash - so this time we are apologising
  async checkPreviousSession() {
    //this method is what appCenter already uses by default
    const didCrash = await Crashes.hasCrashedInLastSession();
    if (didCrash) {
      //if you want the report - the report is basically going to contain the information that we saw off or an appcenter the one that is send by default by appcenter over the application 
      const report = await Crashes.lastSessionCrashReport();
      alert("Sorry about that crash, we are working on a solution");
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={{ paddingTop: 70, textAlign: 'center', fontSize: 40 }}>Welcome</Text>
        {/* <Button title="Crash"
          onPress={() => Crashes.generateTestCrash() } /> */}
          <TextInput placeholder="Current inflation rate"
                   style={styles.textBox} keyboardType='decimal-pad'
                   onChangeText={(inflationRate) => this.setState({inflationRate})}/>
        <TextInput placeholder="Current risk free rate"
                   style={styles.textBox} keyboardType='decimal-pad'
                   onChangeText={(riskFreeRate) => this.setState({riskFreeRate})}/>
        <TextInput placeholder="Amount you want to save"
                   style={styles.textBox} keyboardType='decimal-pad'
                   onChangeText={(amount) => this.setState({amount})}/>
        <TextInput placeholder="For how long (in years) will you save?"
                   style={styles.textBox} keyboardType='decimal-pad'
                   onChangeText={(timeInYears) => this.setState({timeInYears})}/>
        <Button title="Calculate Inflation"
          //to identify the event itself
          //so everytime the calculate event is track its not only going to send to the appcenter but some other info will be sent along with it  
          //so when this event is track it will send the calculate inflation event as well as the other property such as internet gps etc.  
          onPress={() => {
                  this.calculate();
                  Analytics.trackEvent('calculate_inflation', { Internet: 'WiFi', GPS: 'Off' });
                }} />

        <Text style={styles.label}>{this.state.timeInYears} years from now you will still have ${this.state.amount} but it will only be worth ${this.state.afterInflation}.</Text>
        <Text style={styles.label}>But if you invest it at a risk free rate you will have ${this.state.atRiskFree}.</Text>
        <Text style={styles.label}>Which will be worth ${this.state.atRiskFreeAfterInflation} after inflation.</Text>
        <Text style={styles.label}>A difference of: ${this.state.difference}.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: 16
  },
  label: {
    marginTop: 10
  },
  textBox: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
