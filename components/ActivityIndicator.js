import React, { Component } from 'react';
import { ActivityIndicator as Loader, View } from 'react-native';

export default class ActivityIndicator extends Component {
    render() {
        return (
            <View style={{height:'100%', width:'100%', position:'absolute', top:0, left:0, justifyContent:'center', alignItems:'center'}}>
                <Loader color={'purple'} size={25} />
            </View>
        )
    }
}
