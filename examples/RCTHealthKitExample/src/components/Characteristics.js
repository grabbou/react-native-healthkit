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
let {
  TypeIdentifiers
} = HealthKit
let findKey = require('lodash/object/findKey')

let StaticList = require('./StaticList')

let Characteristics = React.createClass({
  propTypes: {},

  getInitialState () {
    return {
      biologicalSex: HealthKit.BiologicalSex.NotSet
    }
  },

  componentWillMount () {
    HealthKit.requestAuthorizationToShareTypes({
      typesToShare: [],
      typesToRead: [
        TypeIdentifiers.Characteristic.BiologicalSex,
        TypeIdentifiers.Characteristic.BloogType,
        TypeIdentifiers.Characteristic.DateOfBirth
      ]
    }, (err, success) => {
      if (err) throw new Error(err)
      HealthKit.getBiologicalSex((err, biologicalSex) => {
        if (err) throw new Error(err)
        this.setState({ biologicalSex })
      })
    })
  },

  render () {
    let { biologicalSex } = this.state
    let biologicalSexKey = findKey(
      HealthKit.BiologicalSex,
      value => value === biologicalSex
    )

    return (
      <StaticList>
        <StaticList.Section>
          <StaticList.Item
            label='Biological Sex'
            value={biologicalSexKey} />
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
