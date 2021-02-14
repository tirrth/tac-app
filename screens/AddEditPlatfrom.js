import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import {Button, Card} from 'react-native-paper';
import {IconButton, TextInput, Switch} from 'react-native-paper';
import {Header} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  UNIVERSAL_ENTRY_POINT_ADDRESS,
  API_ADD_PLATFORM_KEY,
  API_REMOVE_USER_ADDED_PLATFORM_KEY,
  API_REMOVE_PLATFORM_KEY,
  API_GET_ALL_PLATFORMS_KEY,
  API_EDIT_PLATFORM_KEY,
  API_GET_CUSTOMISED_PLATFORMS_KEY,
  API_ADD_CUSTOMISED_PLATFORM_KEY,
  API_GET_MEDIA_TYPES_KEY,
  API_EDIT_CUSTOMISED_PLATFORM_KEY,
} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker as RNPicker} from '@react-native-community/picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Icon} from 'native-base';
import {Alert} from 'react-native';
import {ToastAndroid} from 'react-native';
import {Pressable} from 'react-native';
import {Linking} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {Platform} from 'react-native';

const media = [
  {
    name: 'Instagram',
    base_url: '',
    user_id: '',
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
    add_or_edit: true,
  },
];

export default class AddEditPlatfrom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      platform_info: [],

      add_new_modal_toggle: false,
      is_edit_user_added_platform: false,
      edit_user_added_platform_details_for_modal: {},

      platform_detail_modal_toggle: false,
      remove_user_added_platform_toggle: false,
      platform_detail_for_modal: {},
    };
  }

  async componentDidMount() {
    await this._getAllPlaforms();
  }

  _getAllPlaforms = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_ALL_PLATFORMS_KEY, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        console.log('API_GET_ALL_PLATFORMS_KEY', res);
        // this.setState({ platform_info: res.data.platforms });
        res.data.platforms.map((item) => (item.is_user_added_platform = false));
        await this._getCustomisedPlatforms(res.data.platforms);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _getCustomisedPlatforms = async (previous_data) => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_CUSTOMISED_PLATFORMS_KEY, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        res.data.user_added_platforms.map(
          (item) => (item.is_user_added_platform = true),
        );
        this.setState({
          platform_info: [
            ...previous_data,
            ...res.data.user_added_platforms,
            {add_or_edit: true},
          ],
        });
        console.log(this.state.platform_info);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onPlatformPress = (platform_detail) => {
    // console.log(platform_detail);
    this.setState({
      platform_detail_for_modal: platform_detail,
      platform_detail_modal_toggle: !this.state.platform_detail_modal_toggle,
    });
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

  _onToastMessageSent = (message) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    this.props.navigation.reset({routes: [{name: 'AddEditPlatfrom'}]});
  };

  _onUserAddedPlatformPress = (platform_detail) => {
    //   alert("You can't edit user adde platform!! You can only delete it.");
    this.setState({
      edit_user_added_platform_details_for_modal: platform_detail,
      is_edit_user_added_platform: true,
      add_new_modal_toggle: true,
    });
  };

  _onRemoveUserAddedPlatformAlertPress = (uuid) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove this platform?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this._onRemoveUserAddedPlatformPress(uuid);
          },
        },
      ],
      {cancelable: false},
    );
  };

  _onRemoveUserAddedPlatformPress = async (uuid) => {
    const token = await AsyncStorage.getItem('token');
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_REMOVE_USER_ADDED_PLATFORM_KEY,
        {
          platform_uuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _renderItem = ({item, index}) => {
    return item.add_or_edit || item.empty ? (
      <View key={index} style={{alignItems: 'center', marginTop: 10}}>
        {!item.empty ? (
          <>
            <Card
              style={{height: 80, width: 80, borderRadius: 10}}
              onPress={() =>
                this.setState({
                  is_edit_user_added_platform: false,
                  add_new_modal_toggle: true,
                })
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
                      this.setState({
                        is_edit_user_added_platform: false,
                        add_new_modal_toggle: true,
                      })
                    }
                  />
                </View>
              </View>
            </Card>
            <Text style={{marginTop: 5, color: '#8d8d8d', fontSize: 13}}>
              Add New
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
          onLongPress={
            item.is_user_added_platform
              ? () =>
                  this.setState({
                    remove_user_added_platform_toggle: !this.state
                      .remove_user_added_platform_toggle,
                  })
              : null
          }
          onPress={() =>
            item.is_user_added_platform
              ? !this.state.remove_user_added_platform_toggle
                ? this._onUserAddedPlatformPress(item)
                : this.setState({
                    remove_user_added_platform_toggle: !this.state
                      .remove_user_added_platform_toggle,
                  })
              : this._onPlatformPress(item)
          }>
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
            {this.state.remove_user_added_platform_toggle &&
            item.is_user_added_platform ? (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  borderRadius: 10,
                  top: 0,
                  left: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <IconButton
                  color="#fff"
                  icon={'minus'}
                  onPress={() =>
                    this._onRemoveUserAddedPlatformAlertPress(item.uuid)
                  }
                />
              </View>
            ) : null}
          </View>
        </Card>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              marginTop: 5,
              color: '#8d8d8d',
              fontSize: 13,
              flex: 1,
              textAlign: 'center',
            }}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{backgroundColor: '#f9faff', height: '100%'}}>
        <SafeAreaView>
          <View style={{marginTop: 10}}>
            <FlatList
              numColumns={3}
              data={this._formatData(this.state.platform_info, 3)}
              renderItem={this._renderItem}
              keyExtractor={(item) => item.uuid}
              columnWrapperStyle={{justifyContent: 'space-evenly'}}
            />
          </View>
          {this.state.add_new_modal_toggle ? (
            <AddEditPlatfromModal
              is_edit_user_added_platform={
                this.state.is_edit_user_added_platform
              }
              user_added_platform_details={
                this.state.edit_user_added_platform_details_for_modal
              }
              navigation={this.props.navigation}
              modalClose={() =>
                this.setState({
                  add_new_modal_toggle: !this.state.add_new_modal_toggle,
                })
              }
            />
          ) : null}
          {this.state.platform_detail_modal_toggle ? (
            <PlatformDetailModal
              navigation={this.props.navigation}
              platform_detail={this.state.platform_detail_for_modal}
              modalClose={() =>
                this.setState({
                  platform_detail_modal_toggle: !this.state
                    .platform_detail_modal_toggle,
                })
              }
            />
          ) : null}
        </SafeAreaView>
      </View>
    );
  }
}

class AddEditPlatfromModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      isButtonLoading: false,

      platform_details: {
        platform_name: '',
        media_type_id: '',
        platform_logo: '',
        redirection_url: '',
        is_active: true,
      },
      updated_platform_logo: '',
      selected_source_to_upload: 'file',
      media_types: [],

      uploaded_file_name: '',
    };
  }

  componentDidMount() {
    if (this.props.is_edit_user_added_platform) {
      console.log(this.props.user_added_platform_details);
      if (this.props.user_added_platform_details.is_active) {
        this.props.user_added_platform_details.is_active = true;
      } else {
        this.props.user_added_platform_details.is_active = false;
      }
      this.props.user_added_platform_details.platform_name = this.props.user_added_platform_details.name;
      this.props.user_added_platform_details.platform_logo = this.props.user_added_platform_details.logo_url;
      this.setState({platform_details: this.props.user_added_platform_details});
    }
    this._getMediaTypes();
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 0);
  }

  _onChangeText = (key, val) => {
    this.setState({
      platform_details: {...this.state.platform_details, [key]: val},
    });
  };

  _getMediaTypes = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_MEDIA_TYPES_KEY, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.setState({
          media_types: res.data.media_types,
        });
        if (!this.props.is_edit_user_added_platform) {
          this.setState({
            platform_details: {
              ...this.state.platform_details,
              media_type_id: res.data.media_types[0].id,
            },
          });
        }
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onModalClose = () => {
    this.props.modalClose();
  };

  _onImagePicker = () => {
    const {is_edit_user_added_platform} = this.props;
    let imageValidSize = 5120; //In KB(5 MB);
    ImagePicker.openPicker({
      cropping: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then((img_data) => {
        if (
          img_data.mime === 'image/jpeg' ||
          img_data.mime === 'image/jpg' ||
          img_data.mime === 'image/png' ||
          img_data.mime === 'image/bmp'
        ) {
          if (Math.ceil(img_data.size / 1024) <= imageValidSize) {
            this.state.platform_details.platform_logo =
              `data:${img_data.mime};base64,` + img_data.data;
            this.setState({platform_details: this.state.platform_details});
            if (is_edit_user_added_platform) {
              this.setState({
                updated_platform_logo:
                  `data:${img_data.mime};base64,` + img_data.data,
              });
            }
            // console.log(img_data);
            // this.state.user_details.avatar = `data:${img_data.mime};base64,` + img_data.data;
            // this.state.avatar = `data:${img_data.mime};base64,` + img_data.data;
            // this.setState({ user_details: this.state.user_details, avatar: this.state.avatar });
          } else {
            alert('Image size exceeds 5 MB!!');
          }
        } else {
          alert(
            'Invalid Image Type. Only JPEG, PNG, JPG or BMP types allowed!!',
          );
        }
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onDocumentPickerPress = async () => {
    await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    })
      .then(async (res) => {
        let imageValidSize = 25600; //In KB(5 MB);
        console.log(res);

        if (Math.ceil(res.size / 1024) <= imageValidSize) {
          this.setState({uploaded_file_name: res.name});
          let response = await RNFS.readFile(res.uri, 'base64');
          this.setState({file_base64: `data:${res.type};base64,` + response});
        } else {
          alert(`File size exceeds ${imageValidSize / 1024} MB!!`);
        }
        // console.log(`${response}`);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onToastMessageSent = (message) => {
    this._onModalClose();
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    this.props.navigation.reset({routes: [{name: 'AddEditPlatfrom'}]});
  };

  _onSubmitPress = async () => {
    const {
      platform_details,
      file_base64,
      selected_source_to_upload,
    } = this.state;
    const token = await AsyncStorage.getItem('token');
    const data = {
      is_active: platform_details.is_active,
      platform_type_id: platform_details.media_type_id,
      platform_name: platform_details.platform_name,
      redirection_url:
        selected_source_to_upload === 'url'
          ? platform_details.redirection_url
          : file_base64,
      is_file_to_upload: selected_source_to_upload === 'url' ? false : true,
      logo_url: platform_details.platform_logo,
    };
    console.log(data);
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_ADD_CUSTOMISED_PLATFORM_KEY,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onEditPress = async () => {
    const {platform_details, updated_platform_logo} = this.state;
    const token = await AsyncStorage.getItem('token');
    const data = {
      platform_id: platform_details.id,
      is_active: platform_details.is_active,
      platform_type_id: platform_details.media_type_id,
      platform_name: platform_details.platform_name,
      logo_url: updated_platform_logo,
    };
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_EDIT_CUSTOMISED_PLATFORM_KEY,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onRemoveUserAddedPlatformAlertPress = (uuid) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove this platform?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this._onRemoveUserAddedPlatformPress(uuid);
          },
        },
      ],
      {cancelable: false},
    );
  };

  _onRemoveUserAddedPlatformPress = async (uuid) => {
    const token = await AsyncStorage.getItem('token');
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_REMOVE_USER_ADDED_PLATFORM_KEY,
        {
          platform_uuid: uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onFileDownloadClick = async (download_link) => {
    console.log(download_link);

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

    const fileExtention = (filename) => {
      return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
    };
    const file_extension = fileExtention(download_link);

    if (file_extension) {
      path += `/${parseInt(Math.random() * 1000000000)}.${file_extension}`;

      const DownloadFileOptions = {
        fromUrl: download_link,
        toFile: path,
        begin: (res) => DownloadBeginCallbackResult(res),
        progress: (res) => DownloadProgressCallbackResult(res),
      };
      const DownloadProgressCallbackResult = (res) => {
        // console.log(res);
      };
      const DownloadBeginCallbackResult = (res) => {
        // console.log('begin', res);
      };
      RNFS.downloadFile(DownloadFileOptions)
        .promise.then((res) => {
          this._onToastMessageSent(
            `File Successfully Donwloaded to path ${path}`,
          );
        })
        .catch((err) => console.log({...err}));
    } else {
      alert('File type is not valid!');
    }
  };

  _onFileOpenClick = (download_link) => {
    console.log(download_link);
    Linking.canOpenURL(download_link).then((supported) => {
      if (supported) {
        Linking.openURL(download_link);
      } else {
        console.log("Don't know how to open URI: " + download_link);
      }
    });
  };

  render() {
    const {platform_details} = this.state;
    const {is_edit_user_added_platform} = this.props;
    return (
      // <View
      //   style={{
      //     height: '100%',
      //     width: '100%',
      //     position: 'absolute',
      //     bottom: 0,
      //     left: 0,
      //     backgroundColor: 'rgba(0,0,0,0.7)',
      //   }}>
      <Modal animationType="slide" transparent={true} visible={true}>
        <SafeAreaView
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
              height: '70%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 14,
              }}>
              <IconButton
                icon="arrow-down"
                onPress={() => this._onModalClose()}
              />
            </View>
            <View style={{...styles.horizontalSeparator}} />

            {!this.state.isLoading ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{padding: 14}}>
                  <View style={{...styles.inputsGroup, paddingBottom: 40}}>
                    {/* <View style={{marginBottom:10, marginTop:12}}>
                                              <Text style={{fontWeight:'bold', fontSize:18}}>Add New Platform</Text>
                                          </View> */}

                    <TouchableOpacity
                      style={{
                        marginTop: 10,
                        alignSelf: 'center',
                        marginBottom: 10,
                      }}
                      onPress={() => this._onImagePicker()}>
                      {platform_details.platform_logo ? (
                        <Image
                          borderRadius={100 / 2}
                          style={{
                            resizeMode: 'cover',
                            height: 90,
                            width: 90,
                            overflow: 'hidden',
                            borderColor: '#eeeeee',
                            borderWidth: 1,
                          }}
                          source={{uri: platform_details.platform_logo}}
                        />
                      ) : (
                        <View
                          style={{
                            height: 90,
                            width: 90,
                            borderRadius: 100 / 2,
                            backgroundColor: '#f0f0f0',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderColor: '#eeeeee',
                            borderWidth: 1,
                          }}>
                          <Text
                            style={{
                              color: '#8d8d8d',
                              fontWeight: 'bold',
                              padding: 10,
                              textAlign: 'center',
                            }}>
                            Platform Logo
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                        Disable / Enable
                      </Text>
                      <Switch
                        color="blue"
                        value={platform_details.is_active}
                        onValueChange={(bool) =>
                          this.setState({
                            platform_details: {
                              ...platform_details,
                              is_active: bool,
                            },
                          })
                        }
                      />
                    </View>

                    <View style={{marginTop: 10}}>
                      <TextInput
                        value={platform_details.platform_name}
                        mode="outlined"
                        dense
                        label="Platform Name*"
                        style={{backgroundColor: 'white'}}
                        onChangeText={(text) =>
                          this._onChangeText('platform_name', text)
                        }
                        onSubmitEditing={() => this.lastName.focus()}
                      />
                    </View>

                    <View style={{marginBottom: 6, marginTop: 20}}>
                      <Text style={{fontWeight: 'bold', fontSize: 18}}>
                        Social Media Type
                      </Text>
                    </View>
                    <View
                      style={{
                        borderColor: '#8d8d8d',
                        borderWidth: 1,
                        borderRadius: 4,
                      }}>
                      <RNPicker
                        selectedValue={platform_details.media_type_id}
                        style={{height: 40}}
                        onValueChange={(itemValue, itemIndex) =>
                          this._onChangeText('media_type_id', itemValue)
                        }>
                        {this.state.media_types.map((media_type, index) => {
                          return (
                            <RNPicker.Item
                              key={index}
                              label={media_type.name}
                              value={media_type.id}
                            />
                          );
                        })}
                      </RNPicker>
                    </View>

                    {!is_edit_user_added_platform ? (
                      <>
                        <View style={{marginBottom: 6, marginTop: 20}}>
                          <Text style={{fontWeight: 'bold', fontSize: 18}}>
                            File Selection
                          </Text>
                        </View>
                        <View
                          style={{
                            borderColor: '#8d8d8d',
                            borderWidth: 1,
                            borderRadius: 4,
                          }}>
                          <RNPicker
                            selectedValue={this.state.selected_source_to_upload}
                            style={{height: 40}}
                            onValueChange={(itemValue, itemIndex) =>
                              this.setState({
                                selected_source_to_upload: itemValue,
                              })
                            }>
                            <RNPicker.Item
                              label="File To Upload"
                              value="file"
                            />
                            <RNPicker.Item
                              label="URL To Redirect"
                              value="url"
                            />
                          </RNPicker>
                        </View>
                        <View style={{marginTop: 10}}>
                          {this.state.selected_source_to_upload === 'url' ? (
                            <TextInput
                              value={platform_details.redirection_url}
                              mode="outlined"
                              dense
                              label="Redirection URL*"
                              style={{backgroundColor: 'white'}}
                              onChangeText={(text) =>
                                this._onChangeText('redirection_url', text)
                              }
                              onSubmitEditing={() => this.lastName.focus()}
                            />
                          ) : (
                            <Card
                              style={{
                                marginTop: 4,
                                height: 40,
                                width: '100%',
                                backgroundColor: '#f0f0f0',
                              }}
                              onPress={this._onDocumentPickerPress}>
                              <View
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                }}>
                                <Text style={{color: '#666'}}>
                                  {this.state.uploaded_file_name.length > 32
                                    ? this.state.uploaded_file_name.slice(
                                        0,
                                        32,
                                      ) + '...'
                                    : this.state.uploaded_file_name ||
                                      'Upload your File Here'}
                                </Text>
                                <AntDesign
                                  style={{marginLeft: 10}}
                                  name={'upload'}
                                  size={16}
                                  color="#666"
                                />
                              </View>
                            </Card>
                          )}
                        </View>
                      </>
                    ) : (
                      <>
                        <Card
                          style={{
                            marginTop: 20,
                            height: 40,
                            width: '100%',
                            backgroundColor: '#f0f0f0',
                          }}
                          onPress={() =>
                            this._onFileOpenClick(
                              platform_details.redirection_url,
                            )
                          }>
                          <View
                            style={{
                              width: '100%',
                              height: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text style={{color: '#666'}}>
                              Open your uploaded file
                            </Text>
                            <AntDesign
                              style={{marginLeft: 10}}
                              name={'download'}
                              size={16}
                              color="#666"
                            />
                          </View>
                        </Card>
                        <Card
                          style={{
                            marginTop: 10,
                            height: 40,
                            width: '100%',
                            backgroundColor: '#f0f0f0',
                          }}
                          onPress={() =>
                            this._onFileDownloadClick(
                              platform_details.redirection_url,
                            )
                          }>
                          <View
                            style={{
                              width: '100%',
                              height: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text style={{color: '#666'}}>
                              Dowload your uploaded file
                            </Text>
                            <AntDesign
                              style={{marginLeft: 10}}
                              name={'download'}
                              size={16}
                              color="#666"
                            />
                          </View>
                        </Card>
                      </>
                    )}
                    <View style={{marginTop: 30}}>
                      <Button
                        loading={this.state.isButtonLoading ? true : false}
                        mode="contained"
                        onPress={
                          is_edit_user_added_platform
                            ? () => this._onEditPress()
                            : () => this._onSubmitPress()
                        }>
                        {this.state.isButtonLoading
                          ? ``
                          : is_edit_user_added_platform
                          ? `Edit Platform`
                          : `Add Platform`}
                      </Button>

                      {is_edit_user_added_platform ? (
                        <Button
                          style={{marginTop: 10}}
                          color="red"
                          // loading={this.state.isButtonLoading ? true : false}
                          mode="outlined"
                          onPress={() =>
                            this._onRemoveUserAddedPlatformAlertPress(
                              platform_details.uuid,
                            )
                          }>
                          Delete Platform
                        </Button>
                      ) : null}
                    </View>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size={25} color="purple" />
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>
      // </View>
    );
  }
}

class PlatformDetailModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username_or_url: '',

      is_edit_platform_btn_toggle: false,
      isPlatformEnableToggle: false,
    };
  }
  componentDidMount() {
    console.log('platform_detail', this.props.platform_detail);
    if (this.props.platform_detail.get_user_platform_relation) {
      this.setState({
        is_edit_platform_btn_toggle: true,
        isPlatformEnableToggle: this.props.platform_detail
          .get_user_platform_relation.is_active
          ? true
          : false,
        username_or_url: this.props.platform_detail.get_user_platform_relation
          .platform_username,
      });
    } else {
      this.setState({isPlatformEnableToggle: true});
    }
  }

  _onToastMessageSent = (message) => {
    this.props.modalClose();
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    this.props.navigation.reset({routes: [{name: 'AddEditPlatfrom'}]});
  };

  _onEditPress = async () => {
    const token = await AsyncStorage.getItem('token');
    const data = {
      platform_username: this.state.username_or_url,
      platform_id: this.props.platform_detail.get_user_platform_relation
        .media_platform_id,
      is_active: this.state.isPlatformEnableToggle,
      is_url: this.props.platform_detail.base_url ? false : true,
    };
    axios
      .post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_EDIT_PLATFORM_KEY, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
        alert(`Invalid ${data.is_url ? 'URL' : 'Username'}`);
      });
  };

  _onAddPress = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(this.props.platform_detail);
    const data = {
      platform_username: this.state.username_or_url,
      platform_id: this.props.platform_detail.id,
      is_active: 1,
      is_url: this.props.platform_detail.base_url ? false : true,
    };

    axios
      .post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_ADD_PLATFORM_KEY, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this._onToastMessageSent(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
        alert(`Invalid ${data.is_url ? 'URL' : 'Username'}`);
      });
  };

  _onRemoveAlertPress = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove this platform?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this._onRemovePress();
          },
        },
      ],
      {cancelable: false},
    );
  };

  _onRemovePress = async () => {
    const token = await AsyncStorage.getItem('token');
    // platform_id: this.props.platform_detail.get_user_platform_relation.media_platform_id
    const data = {
      platform_uuid: this.props.platform_detail.get_user_platform_relation.uuid,
    };
    axios
      .post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_REMOVE_PLATFORM_KEY, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res);
        // alert(res.data.message);
        this._onToastMessageSent(res.data.message);
        this.setState({
          username_or_url: '',
          is_edit_platform_btn_toggle: false,
        });
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  _onPlatformPress = async (redirection_url) => {
    console.log(redirection_url);
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

  render() {
    const {platform_detail} = this.props;
    const {is_edit_platform_btn_toggle} = this.state;
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={true}
        onRequestClose={() => this.props.modalClose()}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              marginTop: 4,
              marginRight: 4,
            }}>
            <IconButton
              color="#fff"
              size={30}
              style={{transform: [{rotate: '45deg'}]}}
              icon="plus"
              onPress={() => this.props.modalClose()}
            />
          </View>
          <View
            style={{
              width: '85%',
              backgroundColor: '#fff',
              borderRadius: 4,
              paddingVertical: 20,
            }}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Pressable
                onPress={() =>
                  platform_detail.redirection_url
                    ? this._onPlatformPress(platform_detail.redirection_url)
                    : null
                }>
                <Image
                  borderRadius={80 / 2}
                  resizeMode="contain"
                  style={{height: 80, width: 80}}
                  source={{uri: platform_detail.logo_url}}
                />
              </Pressable>
              <Text style={{fontSize: 18, fontWeight: '700', marginTop: 10}}>
                {platform_detail.name}
              </Text>
            </View>
            <View style={{paddingHorizontal: 15, marginTop: 20}}>
              {is_edit_platform_btn_toggle ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <Text style={{fontSize: 16, fontWeight: '700'}}>
                    Disable / Enable
                  </Text>
                  <Switch
                    color="blue"
                    value={this.state.isPlatformEnableToggle}
                    onValueChange={(bool) =>
                      this.setState({
                        isPlatformEnableToggle: bool,
                      })
                    }
                  />
                </View>
              ) : null}
              <TextInput
                disabled={!this.state.isPlatformEnableToggle}
                mode="outlined"
                label={platform_detail.base_url ? 'username' : 'URL'}
                value={this.state.username_or_url}
                dense
                style={{backgroundColor: '#fff'}}
                onChangeText={(text) => this.setState({username_or_url: text})}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Button
                  mode="contained"
                  style={{flex: 1, marginRight: 6}}
                  onPress={
                    is_edit_platform_btn_toggle
                      ? () => this._onEditPress()
                      : () => this._onAddPress()
                  }>
                  {is_edit_platform_btn_toggle ? `Edit` : 'Add'}
                </Button>
                {is_edit_platform_btn_toggle ? (
                  <Button
                    mode="outlined"
                    color="red"
                    style={{flex: 1, marginLeft: 6}}
                    onPress={() =>
                      this._onRemoveAlertPress()
                    }>{`Remove`}</Button>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  horizontalSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#eeeeee',
  },

  elevation: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  productCard: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 6,
    marginHorizontal: 14,
  },

  pickerStyle: {
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#8d8d8d',
    borderRadius: 4,
    justifyContent: 'space-around',
  },
});
