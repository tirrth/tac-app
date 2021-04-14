import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import DrawerContent from './DrawerContent';
import {Icon} from 'native-base';
import ShopScreen from '../screens/ShopScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddEditPlatform from '../screens/AddEditPlatform';
import WebViewScreen from '../screens/WebViewScreen';
import QRCodeScreen from '../screens/QRCodeScreen';

const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerTitle: 'Edit Profile'}}
      />
      <HomeStack.Screen
        name="AddEditPlatform"
        component={AddEditPlatform}
        options={{headerTitle: 'Add / Edit Platform'}}
      />
      <HomeStack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{header: () => null}}
      />
      <HomeStack.Screen
        name="QRCodeScreen"
        component={QRCodeScreen}
        options={{header: () => null}}
      />
    </HomeStack.Navigator>
  );
};

const AppDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="HomeRoot" component={HomeStackScreen} />
      <Drawer.Screen name="Shop" component={ShopScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

export default AppDrawer;
