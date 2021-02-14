import React, {Component} from 'react';
import {WebView} from 'react-native-webview';

export default class WebViewScreen extends Component {
  render() {
    return (
      <WebView
        source={{uri: this.props.route.params.url || 'https://www.google.com'}}
      />
    );
  }
}
