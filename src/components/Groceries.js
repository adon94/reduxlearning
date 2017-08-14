import React, { Component } from 'react'
import {
  Button,
  ListView,
  NetInfo,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native'
import Item from './Item'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from '../actions/items'

class Groceries extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newItem: ''
    }
  }

  componentWillMount() {
    this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.props.loadOfflineItems()

    if (NetInfo) {
      NetInfo.isConnected.fetch().done(isConnected => {
        if (isConnected) {
          this.props.checkConnection()
        } else {
          this.props.goOffline()
        }
      })
    } else {
      this.props.checkConnection()
    }
  }

  renderRow(rowData) {
    console.log(this.props.connected)
    return (
      <TouchableHighlight onPress={() => this.openItem()} underlayColor="white">
        <Item name={rowData.title}
          removable={this.props.connected}
          onRemove={() => this._remove(rowData.id)} />
      </ TouchableHighlight>
    )
  }

  _add() {
    this.props.addItem(this.state.newItem);

    this.setState({ newItem: '' })
    setTimeout(() => this.refs.newItem.focus(), 1)
  }

  _remove(id) {
    this.props.removeItem(id)
  }

  openItem() {
    console.log(this.props);
    // Navigation.showModal({
    //   screen: "groceries.itemView", // unique ID registered with Navigation.registerScreen
    //   title: "Item", // title of the screen as appears in the nav bar (optional)
    //   passProps: {}, // simple serializable object that will pass as props to the modal (optional)
    //   navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
    //   navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    //   animationType: 'slide-up' // 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
    // });
    this.props.navigator.push({
      screen: "groceries.itemView",
      title: "Item View"
    });
  }

  render() {
    console.log('PROPS!')
    console.log(this.props)
    let items, readonlyMessage
    if (this.props.connected) {
      items = this.props.onlineItems
    } else if (this.props.connectionChecked) {
      items = this.props.offlineItems
      readonlyMessage = <Text style={styles.offline}>Offline</Text>
    } else {
      items = []
      readonlyMessage = <Text style={styles.offline}>Loading...</Text>
    }

    return (
      <View style={styles.container}>
        {readonlyMessage}
        <TextInput placeholder="Add item"
          style={styles.newItem}
          ref="newItem"
          editable={this.props.connected}
          value={this.state.newItem}
          onChangeText={(newItem) => this.setState({ newItem })}
          onSubmitEditing={() => this._add()} />


        <ListView
          dataSource={this.dataSource.cloneWithRows(items)}
          enableEmptySections={true}
          renderRow={this.renderRow.bind(this)}
        />
        <Button
          onPress={() => this.openItem()}
          title="Press Me" />
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    onlineItems: state.items.onlineList,
    offlineItems: state.items.offlineList,
    connectionChecked: state.items.connectionChecked,
    connected: state.items.connected
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ItemsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Groceries)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#F6F6F6'
  },
  newItem: {
    backgroundColor: '#FFFFFF',
    height: 42,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 20
  },
  offline: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    paddingTop: 5,
    paddingBottom: 5
  }
})