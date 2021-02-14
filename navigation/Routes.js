import React, {useContext, useState, useEffect} from 'react';
import 'react-native-gesture-handler';
import {Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthContext} from './AuthProvider';
import axios from 'axios';
import {UNIVERSAL_ENTRY_POINT_ADDRESS, API_REFRESH_TOKEN_KEY} from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsScreen from '../screens/SettingsScreen';
import linking from '../Linking';
import ProfileScreen from '../screens/ProfileScreen';
import {ActivityIndicator} from 'react-native';
const MainStack = createStackNavigator();

const Routes = () => {
  const {token, setToken} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    if (token) {
      axios
        .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_REFRESH_TOKEN_KEY, {
          headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
          setToken(res.data.access_token);
          AsyncStorage.setItem('token', res.data.access_token);
          setIsLoading(false);
          console.log(res);
        })
        .catch((err) => {
          console.log({...err});
          setToken(null);
          AsyncStorage.removeItem('token');
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <NavigationContainer
      linking={linking}
      fallback={
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color="blue" size={25} />
        </View>
      }>
      <MainStack.Navigator>
        {token ? (
          <MainStack.Screen
            name="AppStack"
            options={{header: () => null}}
            component={AppStack}
          />
        ) : (
          <MainStack.Screen
            name="AuthStack"
            options={{header: () => null}}
            component={AuthStack}
          />
        )}
        <MainStack.Screen
          options={{header: () => null}}
          name="Profile"
          component={ProfileScreen}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
