'use strict'

let React = require('react-native')
let {
  StyleSheet
} = React

let StaticList = require('./StaticList')
let Characteristics = require('./Characteristics')
let Empty = require('./Empty')

let Index = React.createClass({
  render () {
    return (
      <StaticList onSelectRow={row => this.selectRow(row)}>
        <StaticList.Section label='Reading Data'>
          <StaticList.Item
            label='Characteristics'
            component={Characteristics} />
          <StaticList.Item
            label='Sample Queries'
            component={Empty} />
          <StaticList.Item
            label='Observer Queries'
            component={Empty} />
          <StaticList.Item
            label='Anchored Object Queries'
            component={Empty} />
          <StaticList.Item
            label='Statistics Queries'
            component={Empty} />
          <StaticList.Item
            label='Statistics Collection Queries'
            component={Empty} />
          <StaticList.Item
            label='Correlation Queries'
            component={Empty} />
          <StaticList.Item
            label='Source Queries'
            component={Empty} />
        </StaticList.Section>
        <StaticList.Section label='Writing Data'>
          <StaticList.Item
            label='Quantity Samples'
            component={Empty} />
          <StaticList.Item
            label='Category Samples'
            component={Empty} />
          <StaticList.Item
            label='Workouts'
            component={Empty} />
        </StaticList.Section>
      </StaticList>
    )
  },

  selectRow (row) {
    this.props.navigator.push({
      title: row.label,
      component: row.component,
      passProps: { row }
    })
  }
})

let styles = StyleSheet.create({
  container: { flex: 1 }
})

module.exports = Index
