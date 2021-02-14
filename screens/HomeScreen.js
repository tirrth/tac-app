import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {IconButton} from 'react-native-paper';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import vCard from 'react-native-vcards';
import {
  UNIVERSAL_ENTRY_POINT_ADDRESS,
  API_GET_USER_PROFILE_KEY,
  API_GET_USER_PROFILE_INFO_KEY,
  API_GET_USER_PLATFORMS_KEY,
  API_GET_CUSTOMISED_PLATFORMS_KEY,
  API_SEND_MAIL,
} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {Alert} from 'react-native';
import {Badge} from 'react-native-paper';
import RNFS from 'react-native-fs';
import {ToastAndroid} from 'react-native';
import {Pressable} from 'react-native';
import {TouchableHighlight} from 'react-native';

const media = [
  {
    name: 'Instagram',
    logo_url: require('../assets/social_media_logo_1.png'),
  },
  {
    name: 'Facebook',
    logo_url: require('../assets/social_media_logo_2.png'),
  },
  {
    name: 'Spotify',
    logo_url: require('../assets/social_media_logo_3.png'),
  },
  {
    name: 'Paypal',
    logo_url: require('../assets/social_media_logo_4.png'),
  },
  {
    name: 'Youtube',
    logo_url: require('../assets/social_media_logo_5.png'),
  },
  {
    empty: true,
  },
];

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_info: {},
      user_platforms: [],
    };
  }

  componentDidMount() {
    this._getUserInfo();
    // this._getUserPlatforms();
  }

  _getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_USER_PROFILE_KEY, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then((res) => {
        // console.log(res);
        this._getUserProfileInfo(res.data.uuid);
        // this.setState({user_info: res.data});
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onToastMessageSent = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  };

  _onVCardPress = async () => {
    //create a new vCard
    let contact = vCard();

    //set properties
    contact.firstName = 'Eric';
    contact.middleName = 'J';
    contact.lastName = 'Nesser';
    contact.organization = 'ACME Corporation';
    contact.photo.attachFromUrl(
      'https://avatars2.githubusercontent.com/u/5659221?v=3&s=460',
      'JPEG',
    );
    contact.workPhone = '312-555-1212';
    contact.birthday = new Date('01-01-1985');
    contact.title = 'Software Developer';
    contact.url = 'https://github.com/enesser';
    contact.note = 'Notes on Eric';

    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
    const writeGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (!readGranted || !writeGranted) {
      console.log('Read and write permissions have not been granted');
      return;
    }
    var path = `${RNFS.ExternalStorageDirectoryPath}/TacApp`;
    RNFS.mkdir(path);
    path += '/eric-nesser.vcf';

    //save to file
    contact
      .saveToFile(path)
      .then((res) => {
        this._onToastMessageSent(
          `File Successfully Donwloaded to path ${path}`,
        );
      })
      .catch((err) => {
        console.log({...err});
      });

    //get as formatted string
    console.log(contact.getFormattedString());
  };

  _getUserProfileInfo = async (user_uuid) => {
    axios
      .get(
        UNIVERSAL_ENTRY_POINT_ADDRESS +
          API_GET_USER_PROFILE_INFO_KEY +
          '/' +
          user_uuid,
      )
      .then((res) => {
        this.setState({user_info: res.data, uuid: user_uuid});
        this.setState({
          user_platforms: [
            {
              customised: true,
              name: 'VCF Card',
              redirection_func: () => this._onVCardPress(),
              logo_url: {
                uri:
                  'https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/256/Contacts-icon.png',
              },
              icon: 'minus',
            },
            ...res.data.platforms,
            {
              customised: true,
              name: 'Add / Edit',
              redirection_func: () =>
                this.props.navigation.navigate('AddEditPlatfrom'),
              logo_url: null,
              icon: 'plus',
            },
          ],
        });
        // console.log(res);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  //   _getUserPlatforms = async () => {
  //     const token = await AsyncStorage.getItem('token');
  //     axios
  //       .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_USER_PLATFORMS_KEY, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         // res.data.platforms = res.data.platforms.filter((item) => item.get_user_platform_relation);
  //         this.setState({user_platforms: res.data.platforms});
  //         this._getCustomisedPlatforms();
  //       })
  //       .catch((err) => {
  //         console.log({...err});
  //       });
  //   };

  //   _getCustomisedPlatforms = async (previous_data) => {
  //     const token = await AsyncStorage.getItem('token');
  //     axios
  //       .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_CUSTOMISED_PLATFORMS_KEY, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         // console.log(res);
  //         this.setState({
  //           user_platforms: [
  //             ...this.state.user_platforms,
  //             ...res.data.user_added_platforms,
  //             {customised: true},
  //           ],
  //         });
  //         // res.data.user_added_platforms.map(item => item.is_user_added_platform = true);
  //         // this.setState({ platform_info: [...previous_data, ...res.data.user_added_platforms, { customised: true }] })
  //         // console.log(this.state.platform_info);
  //       })
  //       .catch((err) => {
  //         console.log({...err});
  //       });
  //   };

  _onPlatformPress = async (redirection_url) => {
    // this.props.navigation.navigate('WebViewScreen', {
    //   url: redirection_url,
    // });
    const supported = Linking.canOpenURL(redirection_url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(redirection_url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${redirection_url}`);
    }
  };

  _renderItem = ({item, index}) => {
    return (
      <View key={index}>
        {item.customised || item.empty ? (
          <View key={index} style={{alignItems: 'center', marginTop: 10}}>
            {!item.empty ? (
              <>
                <Card
                  style={{height: 80, width: 80, borderRadius: 10}}
                  onPress={item.redirection_func}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {item.logo_url ? (
                      <ImageBackground
                        borderRadius={10}
                        style={{width: 70, height: 70}}
                        source={item.logo_url}
                      />
                    ) : (
                      <View
                        style={{
                          height: 70,
                          width: 70,
                          backgroundColor: '#eeeeee',
                          borderRadius: 10,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <IconButton
                          color="#8d8d8d"
                          icon={item.icon}
                          onPress={item.redirection_func}
                        />
                      </View>
                    )}
                  </View>
                </Card>
                <Text
                  style={{
                    marginTop: 5,
                    color: '#8d8d8d',
                    fontSize: 13,
                    textTransform: 'capitalize',
                  }}>
                  {item.name}
                </Text>
              </>
            ) : (
              <View
                style={{height: 80, width: 80, backgroundColor: 'transparent'}}
              />
            )}
          </View>
        ) : (
          <View key={index} style={{alignItems: 'center', marginTop: 10}}>
            {/* <View style={{height:90, borderRadius:10, backgroundColor:'#8d8d8d'}}> */}
            <Card
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: 80,
                width: 80,
              }}
              onPress={() => this._onPlatformPress(item.redirection_url)}>
              <View
                style={{position: 'absolute', top: 0, right: 0, zIndex: 1000}}>
                <Badge style={{backgroundColor: '#4285F4'}}>
                  {item.is_user_added_platform
                    ? item.taps
                    : item.get_user_platform_relation.taps}
                </Badge>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                {item.logo_url ? (
                  <ImageBackground
                    borderRadius={10}
                    style={{width: 70, height: 70}}
                    source={{uri: item.logo_url}}
                  />
                ) : (
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      height: 70,
                      width: 70,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#8d8d8d',
                        textAlign: 'center',
                        padding: 10,
                      }}>
                      Logo
                    </Text>
                  </View>
                )}
              </View>
            </Card>
            {/* </View> */}
            <Text
              style={{
                marginTop: 5,
                color: '#8d8d8d',
                fontSize: 13,
                textTransform: 'capitalize',
              }}>
              {item.name}
            </Text>
          </View>
        )}
      </View>
    );
  };

  _listHeaderComponent = () => {
    const {user_info} = this.state;
    return (
      <View style={{paddingHorizontal: 15, marginBottom: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}>
          <View style={{alignItems: 'center', marginRight: 4}}>
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('EditProfile')}
              style={{
                borderWidth: 2,
                borderRadius: 100,
                borderColor: '#eeeeee',
              }}>
              <ImageBackground
                borderRadius={50}
                style={{width: 90, height: 90}}
                source={
                  user_info.avatar
                    ? {uri: user_info.avatar}
                    : require('../assets/default_avatar.jpg')
                }
              />
            </TouchableHighlight>
            {/* <Text style={{marginTop: 6, color: '#8d8d8d', fontWeight: '700'}}>
              Taps: 78
            </Text> */}
          </View>
          <View style={{flex: 1, marginLeft: 6}}>
            <View>
              <Text
                style={{fontWeight: 'bold', fontSize: 22, color: '#4285F4'}}>
                {user_info.full_name}
              </Text>
            </View>
            <Text
              style={{flexWrap: 'wrap', color: '#8d8d8d', fontWeight: '700'}}>
              {user_info.bio}
            </Text>
            {/* Nothing is eternal. Thank you, come again. Sometimes we could always use a little magic – don’t hide the magic within you */}
          </View>
        </View>
        <View style={{marginTop: 16}}>
          <Button
            mode="outlined"
            color="#8d8d8d"
            onPress={() => this.props.navigation.navigate('EditProfile')}>
            Edit Profile
          </Button>
        </View>
      </View>
    );
  };

  _formatData = (data, numColumns) => {
    const numOfFullRows = Math.floor(data.length / numColumns);
    let numOfElementsLastRow = data.length - numOfFullRows * numColumns;
    while (numOfElementsLastRow !== numColumns && numOfElementsLastRow !== 0) {
      data.push({empty: true});
      numOfElementsLastRow++;
    }

    return data;
  };

  _onEmailSend = async () => {
    const token = await AsyncStorage.getItem('token');
    const email_id = 'tirthgajera5885@gmail.com';
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_SEND_MAIL,
        {email: email_id},
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      )
      .then((res) => console.log(res))
      .catch((err) => console.log({...err}));
  };

  render() {
    return (
      <View style={{backgroundColor: '#f9faff', height: '100%'}}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#4285F4',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              height: 60,
              paddingHorizontal: 6,
            }}>
            <View>
              <IconButton
                icon="menu"
                color="#fff"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </View>
            <View>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: 20,
                }}>
                Tac
              </Text>
            </View>
            <View>
              <IconButton
                color="#fff"
                icon={'qrcode'}
                onPress={() =>
                  this.props.navigation.navigate('QRCodeScreen', {
                    qr_value: this.state.user_info.uuid,
                  })
                }
              />
            </View>
          </View>
          <View>
            <FlatList
              numColumns={3}
              ListHeaderComponent={this._listHeaderComponent}
              data={this._formatData(this.state.user_platforms, 3)}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.uuid}
              columnWrapperStyle={{justifyContent: 'space-evenly'}}
            />
          </View>
          <View></View>
        </SafeAreaView>
        {/* <TouchableHighlight
          style={{backgroundColor: 'red', padding: 10}}
          onPress={() => this._onEmailSend()}>
          <Text>button</Text>
        </TouchableHighlight> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerIconsView: {
    flexDirection: 'row',
  },
});
