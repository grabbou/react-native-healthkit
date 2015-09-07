'use strict'

let React = require('react-native')
let {
  Children,
  ListView,
  PixelRatio,
  PropTypes,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React
let invariant = require('invariant')

function reactChildrenMap (children, predicate) {
  let result = []
  Children.forEach(children, (child, index) => {
    result.push(predicate(child, index))
  })
  return result
}

let StaticList = React.createClass({
  propTypes: {
    onSelectRow: PropTypes.func
  },

  getInitialState () {
    let sections = reactChildrenMap(this.props.children, (child, index) => {
      invariant(
        child.type === StaticList.Section,
        'Only `StaticList.Section` elements are allowed as children of `StaticList`'
      )
      return {
        id: `${index}`,
        label: child.props.label,
        items: reactChildrenMap(child.props.children, (sectionChild, sectionChildIndex) => {
          invariant(
            sectionChild.type === StaticList.Item,
            'Only `StaticList.Item` elements are allowed as children of `StaticList.Section`'
          )
          return {
            id: `${index}:${sectionChildIndex}`,
            label: sectionChild.props.label,
            value: sectionChild.props.value,
            component: sectionChild.props.component
          }
        })
      }
    })

    let sectionIds = sections.map(s => s.id)
    let rowIds = sections.map(s => s.items.map(r => r.id))
    let dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      getSectionHeaderData: (sections, sectionId) =>
        sections.find(s => s.id === sectionId),
      getRowData: (sections, sectionId, rowId) =>
        sections
          .find(s => s.id === sectionId).items
          .find(r => r.id === rowId)
    }).cloneWithRowsAndSections(sections, sectionIds, rowIds);

    return { dataSource }
  },

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderSectionHeader={section => this.renderSectionHeader(section)}
        renderRow={row => this.renderRow(row)}
      />
    )
  },

  renderSectionHeader (section) {
    if (!section.label) {
      return <View />
    }

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.section}>
          {section.label}
        </Text>
      </View>
    );
  },

  renderRow (row) {
    return (
      <View style={styles.row}>
        <TouchableHighlight
          underlayColor='#f7f7f7'
          onPress={() => this.selectRow(row)}>
          <View style={styles.rowLabelContainer}>
            <Text style={styles.rowLabel}>
              {row.label}
            </Text>
            <Text style={styles.rowValue}>
              {row.value}
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.rowDivider} />
      </View>
    )
  },

  selectRow (row) {
    if (this.props.onSelectRow) { this.props.onSelectRow(row) }
  }
})

StaticList.Section = React.createClass({
  propTypes: {
    label: PropTypes.string,
    children: PropTypes.element
  },

  render () {
    invariant(false, '`StaticList.Section` may not be rendered outside of `StaticList`')
  }
})

StaticList.Item = React.createClass({
  propTypes: {
    label: PropTypes.node.isRequired,
    value: PropTypes.node,
    component: PropTypes.func
  },

  render () {
    invariant(false, '`StaticList.Item` may not be rendered outside of `StaticList`')
  }
})

let styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: '#eee',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    position: 'relative',
  },
  rowLabelContainer: {
    padding: 14,
    flexDirection: 'row'
  },
  rowLabel: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  rowValue: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlign: 'right'
  },
  rowDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 1 / PixelRatio.get(),
    backgroundColor: '#ddd',
  },
})

module.exports = StaticList
