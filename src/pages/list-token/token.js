import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Platform,
    StatusBar
} from 'react-native'
import Language from '../../i18n/i18n';
import GLOBALS from '../../helper/variables';
import Swipeout, { SwipeoutButtonProperties } from 'react-native-swipeout';
import IconMtr from 'react-native-vector-icons/MaterialIcons'
import { GetTokenOfNetwork, DeleteToken } from '../../../realm/walletSchema'
import Header from '../../components/header';
import Gradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/FontAwesome";


export default class ListToken extends Component {
    mounted: boolean = true;

    network: string = "Nexty";
    constructor(props) {
        super(props);
        this.state = {
            ArrayToken: []
        }
    }

    componentWillMount() {
        if (this.mounted) {
            this.LoadData(this.props.navigation.getParam('payload').network)
        }
    }
    componentWillUnmount() {
        this.mounted = false;
    }

    LoadData = (network) => {
        GetTokenOfNetwork(network)
            .then(list => {
                console.log('list', list)
                this.setState({ ArrayToken: list })
            })
    }

    deleteNote = (rowData) => {
        Alert.alert(
            Language.t('Token.AlertDelete.Title'),
            Language.t('Token.AlertDelete.Content'),
            [
                { text: Language.t('Token.AlertDelete.ButtonAgree'), onPress: () => { this.Delete(rowData['id']) } },
                { text: Language.t('Token.AlertDelete.ButtonCancel'), style: 'cancel' }
            ]
        )
    }

    Delete = (id) => {
        DeleteToken(id).then(ss => {
            this.LoadData(this.props.navigation.getParam('payload').network)
        }).catch(e => console.log(e))
    }

    render() {

        return (
            <Gradient
                colors={['#F0F3F5', '#E8E8E8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}>
                <StatusBar
                    backgroundColor={'transparent'}
                    translucent
                    barStyle="dark-content"
                />
                <Header
                    backgroundColor="transparent"
                    colorIconLeft="#328FFC"
                    colorTitle="#328FFC"
                    nameIconLeft="arrow-left"
                    title={Language.t('Token.Title')}
                    style={{ marginTop: 23 }}
                    pressIconLeft={() => this.props.navigation.goBack()}
                />
                {
                    this.state.ArrayToken.length > 0 ?

                        <FlatList
                            style={{ padding: GLOBALS.hp('2%') }}
                            data={this.state.ArrayToken}
                            extraData={this.state}
                            renderItem={({ item }) => {
                                if (item['name'] == "NTF") {
                                    item.disable = true
                                } else {
                                    item.disable = false
                                }
                                return (
                                    <View style={styles.Item}>
                                        <Text style={{ flex: 3, fontFamily: GLOBALS.font.Poppins, fontWeight: 'bold' }}>{item["name"]}</Text>
                                        <Text
                                            style={{ flex: 6, paddingHorizontal: GLOBALS.wp('1%'), fontFamily: GLOBALS.font.Poppins }}
                                            ellipsizeMode="tail"
                                            numberOfLines={1}
                                        >{item["balance"].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                                        {
                                            !item['disable'] ?
                                                <TouchableOpacity
                                                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => this.deleteNote(item)}
                                                >
                                                    <IconMtr name="highlight-off" color={GLOBALS.Color.danger} size={GLOBALS.wp('6%')} />
                                                </TouchableOpacity>
                                                : <View style={{ flex: 1 }} />
                                        }

                                    </View>
                                )
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="exclamation-circle" color="#d1d1d1" size={GLOBALS.hp('20%')} />
                        </View>
                    // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    //     <ActivityIndicator size='large' color={GLOBALS.Color.primary} style={{ flex: 1 }} />
                    // </View>
                }

            </Gradient>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    MainForm: {
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: -1,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.hp('2.5%'),
    },
    Item: {
        borderLeftWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderRightWidth: Platform.OS == 'ios' ? 0 : 0.2,
        borderColor: '#c1bfbf',
        flexDirection: 'row',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.24,
        shadowRadius: 2.27,
        elevation: 2,
        borderRadius: 5,
        padding: GLOBALS.hp('2.5%'),
        marginVertical: GLOBALS.hp('1%'),
    }
})