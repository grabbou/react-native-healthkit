'use strict'

let React = require('react-native')
let {
  AppRegistry,
  NavigatorIOS,
  StyleSheet,
  Text,
  View,
} = React
let HealthKit = require('react-native-healthkit')

let Index = require('./src/components/Index')

let SimpleExample = React.createClass({
  getInitialState () {
    return { isHealthDataAvailable: false }
  },

  componentWillMount () {
    HealthKit.isHealthDataAvailable((err, result) => {
      this.setState({ err, isHealthDataAvailable: result })
    })
  },

  render () {
    let { isHealthDataAvailable } = this.state

    if (!isHealthDataAvailable) {
      return (
        <View style={styles.centered}>
          <Text>No health data available</Text>
        </View>
      )
    }

    return (
      <NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'RCTHealthKit',
          component: Index
        }}
      />
    )
  }
})

let styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

AppRegistry.registerComponent('SimpleExample', () => SimpleExample)
