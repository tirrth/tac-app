import React from 'react'
import { View, Text } from 'react-native'
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import LottieView from 'lottie-react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';

class NFCReader extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            is_nfc_enable: true,
        }
    }

    componentDidMount() {
        NfcManager.start().then(res => console.log(res)).catch(err => { console.log(err); this.setState({ is_nfc_enable: false }) });
        NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
            console.warn('tag', tag);
            NfcManager.setAlertMessageIOS('I got your tag!');
            NfcManager.unregisterTagEvent().catch(() => 0);
        });
    }

    componentWillUnmount() {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.unregisterTagEvent().catch(() => 0);
    }

    render() {
        const { is_nfc_enable } = this.state;
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{justifyContent:'space-evenly', alignItems:'center', height:'100%'}}>
                {!is_nfc_enable &&
                <>
                    <View>
                        <LottieView source={require('../assets/nfc-fail.json')} resizeMode='cover' autoPlay loop style={{ width:'80%'}} />
                    </View>
                    <IconButton style={{marginTop:-80}} icon='arrow-right' color='#000' onPress={() => this.props.navigate()} />
                    <Text style={{textAlign:'center', fontWeight:'bold', textTransform:'uppercase', fontSize:16, marginTop:-30, padding:0}}>NFC not supported in your device</Text>
                </>}

                {/* <Text>Go Back to Home</Text>
                <Text>Next</Text> */}
            {/* <Text>NFC Demo</Text>
            <TouchableOpacity 
                style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
                onPress={this._test}
            >
                <Text>Test</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: 'black'}}
                onPress={this._cancel}
            >
                <Text>Cancel Test</Text>
            </TouchableOpacity> */}
            </ScrollView>
        )
    }

    _cancel = () => {
        NfcManager.unregisterTagEvent().catch((err) => console.log(err));
    }

    _test = async () => {
        try {
            await NfcManager.registerTagEvent().then(res => console.log(res)).catch(err => console.log("err",err));
        } catch (ex) {
            NfcManager.unregisterTagEvent().catch((err) => console.log(err));
        }
    }
}

export default NFCReader