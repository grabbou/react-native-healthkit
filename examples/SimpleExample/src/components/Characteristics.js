'use strict'

let debug = require('debug')('RCTHealthKitExample:components:Characteristics')
let React = require('react-native')
let {
  NativeModules,
  StyleSheet,
  Text,
  View
} = React
let HealthKit = require('react-native-healthkit')

let StaticList = require('./StaticList')

let Characteristics = React.createClass({
  propTypes: {},

  getInitialState () {
    return {
      biologicalSex: HealthKit.BiologicalSex.NotSet
    }
  },

  componentWillMount () {
    HealthKit.getBiologicalSex((err, biologicalSex) => {
      if (err) throw new Error(err)
      this.setState({ biologicalSex })
    })
  },

  render () {
    let { err, result } = this.state

    return (
      <StaticList>
        <StaticList.Section>
          <StaticList.Item
            label='Biological Sex' />
        </StaticList.Section>
      </StaticList>
    )
  }
})

let styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64
  }
})

module.exports = Characteristics
