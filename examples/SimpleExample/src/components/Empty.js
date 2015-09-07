'use strict'

let React = require('react-native')
let {
  StyleSheet,
  Text,
  View
} = React

let Empty = React.createClass({
  render () {
    return (
      <View style={styles.container}>
        <Text>No content</Text>
      </View>
    )
  }
})

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = Empty
