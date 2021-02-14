import React from 'react';
import { AuthContext } from '../navigation/AuthProvider';
import { View, StyleSheet }  from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Icon as SignOutIcon } from 'react-native-elements';
import { Icon } from 'native-base';
import AvatarImage from 'react-native-paper/lib/commonjs/components/Avatar/AvatarImage';
import Title from 'react-native-paper/lib/commonjs/components/Typography/Title';
import Caption from 'react-native-paper/lib/commonjs/components/Typography/Caption';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

function DrawerContent(props){
    const { logout } = React.useContext(AuthContext);

    const _signOut = async () => {
        props.navigation.closeDrawer();
        Alert.alert(
            'Confirmation',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: () => { logout() },
                }
            ],
            { cancelable: false }
        );
    }

    const { state } = props;
    const { index } = state;
    return (
        <View style={{ flex:1 }}>
            <DrawerContentScrollView {...props}>
                <View style={{...styles.userInfoSection,flexDirection:'row',marginTop: 50, marginBottom:20}}>
                    <AvatarImage 
                        source={{
                            uri: 'https://api.adorable.io/avatars/200/abott@adorable.png'
                        }}
                        size={70}
                    />
                    <View style={{alignSelf:'center', marginLeft:20}}>
                        <Title style={styles.title}>John Doe</Title>
                        <Caption style={styles.caption}>@j_doe</Caption>
                    </View>
                </View>
                {/* <DrawerItemList {...props} /> */}

                <View>
                    <DrawerItem
                        focused={index === 0 ? true : false}
                        icon={({color, size}) => (
                            <Icon name="home" style={{fontSize:size-2, color:color, marginLeft:10}} />
                        )}
                        label="Home"
                        onPress={() => props.navigation.reset({routes: [{ name: 'HomeRoot' }]})}
                    />

                    <DrawerItem 
                        focused={index === 1 ? true : false}
                        icon={({color, size}) => (
                            <Icon name="cart" style={{fontSize:size-2, color:color, marginLeft:10}} />
                        )}
                        label="Shop"
                        onPress={() => props.navigation.reset({routes: [{ name: 'Shop' }]})}
                    />

                    <DrawerItem 
                        focused={index === 2 ? true : false}
                        icon={({color, size}) => (
                            <Icon name="settings" style={{fontSize:size-2, color:color, marginLeft:10}} />
                        )}
                        label="Settings"
                        onPress={() => props.navigation.reset({routes: [{ name: 'Settings' }]})}
                    />
                </View>
            </DrawerContentScrollView>

            <SafeAreaView>
                <View style={styles.bottomDrawerSection}>
                    <DrawerItem 
                        icon={({color, size}) => (
                          <SignOutIcon 
                              name="exit-to-app" 
                              color={color}
                              size={size}
                          />
                        )}
                        label="Sign Out"
                        onPress={() => _signOut()}
                    />
                </View>
            </SafeAreaView>
        </View>
    );
}

export default DrawerContent;


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
        flex:1,
        marginLeft:10,
        marginRight:10,
        backgroundColor:'#e9e9e9',
        borderRadius:4,
        padding:20,
        paddingTop:10,
        paddingBottom:10,
    },
    title: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 13,
      lineHeight: 14,
      marginTop:-3
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 20,
    },
    bottomDrawerSection: {
        marginBottom: 10,
        borderColor: '#f1f1f1',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop:2,
        paddingBottom:2
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
