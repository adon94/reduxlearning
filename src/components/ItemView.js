import React, { Component } from 'react'
import {
    ListView,
    NetInfo,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native'
import Item from './Item'
import { Navigation } from 'react-native-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as ItemsActions from '../actions/items'

class ItemView extends Component {
    constructor(props) {
        super(props)
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
            <Item name={rowData.title}
                removable={this.props.connected}
                onRemove={() => this._remove(rowData.id)} />
        )
    }

    render() {
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
                <ListView
                    dataSource={this.dataSource.cloneWithRows(items)}
                    enableEmptySections={true}
                    renderRow={this.renderRow.bind(this)}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemView)

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