// import React from 'react';
// import {View, Text, StyleSheet} from 'react-native';

// export default class ProfileScreen extends React.Component {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.text}>{this.props.route.params.id}</Text>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#f9fafd',
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   text: {
//     fontSize: 20,
//     color: '#333333',
//   },
// });

import React, {Component} from 'react';
import {View, Text, StyleSheet, ImageBackground, FlatList} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {IconButton} from 'react-native-paper';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  UNIVERSAL_ENTRY_POINT_ADDRESS,
  API_GET_USER_PROFILE_INFO_KEY,
  API_ON_PLATFORM_TAP_KEY,
} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Linking} from 'react-native';
import {Alert} from 'react-native';

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

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_info: {},
      user_platforms: [],
    };
  }

  componentDidMount() {
    this._getUserProfileInfo();
  }

  _getUserProfileInfo = async () => {
    const user_uuid = this.props.route.params.id;
    if (user_uuid) {
      axios
        .get(
          UNIVERSAL_ENTRY_POINT_ADDRESS +
            API_GET_USER_PROFILE_INFO_KEY +
            '/' +
            user_uuid,
        )
        .then((res) => {
          this.setState({user_info: res.data});
          this.setState({
            user_platforms: res.data.platforms,
          });
          // console.log(res);
        })
        .catch((err) => {
          console.log({...err});
        });
    }
  };

  _onPlatformPress = async (
    redirection_url,
    is_user_added_platform,
    user_id,
    platform_id,
  ) => {
    console.log(platform_id);
    const alreadyVisitedUserPlatforms = await AsyncStorage.getItem(
      'alreadyVisitedUserPlatforms',
    );
    let visited = false;
    if (alreadyVisitedUserPlatforms) {
      alreadyVisitedUserPlatforms.map((item) => {
        if (
          item.user_id == user_id &&
          item.platform_id == platform_id &&
          is_user_added_platform == is_user_added_platform &&
          redirection_url == redirection_url
        ) {
          visited = true;
        }
      });
    }

    if (!visited) {
      await axios
        .post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_ON_PLATFORM_TAP_KEY, {
          user_id: user_id,
          platform_id: platform_id,
          is_user_added_platform: is_user_added_platform,
        })
        .then(async (res) => {
          console.log(res);
          await AsyncStorage.setItem('alreadyVisitedUserPlatforms', [
            ...alreadyVisitedUserPlatforms,
            {
              user_id: user_id,
              platform_id: platform_id,
              is_user_added_platform: is_user_added_platform,
              redirection_url: redirection_url,
            },
          ]).catch((err) => {
            console.log(err);
          });
          const supported = Linking.canOpenURL(redirection_url);
          if (supported) {
            await Linking.openURL(redirection_url);
          } else {
            Alert.alert(`Don't know how to open this URL: ${redirection_url}`);
          }
        })
        .catch((err) => {
          console.log({...err});
        });
    } else {
      const supported = Linking.canOpenURL(redirection_url);
      if (supported) {
        await Linking.openURL(redirection_url);
      } else {
        Alert.alert(`Don't know how to open this URL: ${redirection_url}`);
      }
    }
  };

  _renderItem = ({item, index}) => {
    return (
      <View key={index}>
        {item.add_or_edit || item.empty ? (
          <View key={index} style={{alignItems: 'center', marginTop: 10}}>
            {!item.empty ? (
              <>
                <Card
                  style={{height: 80, width: 80, borderRadius: 10}}
                  onPress={() =>
                    this.props.navigation.navigate('AddEditPlatfrom')
                  }>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
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
                        icon={'plus'}
                        onPress={() =>
                          this.props.navigation.navigate('AddEditPlatfrom')
                        }
                      />
                    </View>
                  </View>
                </Card>
                <Text style={{marginTop: 5, color: '#8d8d8d', fontSize: 13}}>
                  Add / Edit
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
            <Card
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                height: 80,
                width: 80,
              }}
              onPress={() =>
                this._onPlatformPress(
                  item.redirection_url,
                  item.is_user_added_platform,
                  item.is_user_added_platform
                    ? item.user_id
                    : item.get_user_platform_relation.user_id,
                  item.id,
                )
              }>
              <View
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <ImageBackground
                  borderRadius={10}
                  style={{width: 70, height: 70}}
                  source={{uri: item.logo_url}}
                />
              </View>
            </Card>
            <Text style={{marginTop: 5, color: '#8d8d8d', fontSize: 13}}>
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
            <View
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
            </View>
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
        {/* <View style={{marginTop: 16}}>
          <Button
            mode="outlined"
            color="#8d8d8d"
            onPress={() => this.props.navigation.navigate('EditProfile')}>
            Edit Profile
          </Button>
        </View> */}
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
            {/* <View>
              <IconButton
                icon="menu"
                color="#fff"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </View> */}
            <View>
              <Text
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  color: '#fff',
                  fontSize: 20,
                  marginLeft: 20,
                }}>
                Tac App
              </Text>
            </View>
            <View>
              <IconButton
                color="#fff"
                icon={'qrcode'}
                onPress={() => console.log('Pressed!!')}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerIconsView: {
    flexDirection: 'row',
  },
});
