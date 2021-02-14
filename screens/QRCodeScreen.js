import React, {Component} from 'react';
import QRCode from 'react-native-qrcode-svg';
import {View, Text} from 'react-native';

export default class QRCodeScreen extends Component {
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <QRCode
          size={300}
          value={this.props.route.params.qr_value || 'https://tacconnect.in'}
        />
      </View>
    );
  }
  //   render() {
  //     return (
  //       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //         <Text style={{padding: 10}}>QR Code Screen</Text>
  //       </View>
  //     );
  //   }
}
