import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import {Button, IconButton, TextInput} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  UNIVERSAL_ENTRY_POINT_ADDRESS,
  API_GET_USER_PROFILE_KEY,
  API_REFRESH_TOKEN_KEY,
  API_UPDATE_USER_PROFILE_KEY,
} from '@env';
import ActivityIndicator from '../components/ActivityIndicator';
import {connect} from 'react-redux';

class EditProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_details: {},
      isLoading: true,
      avatar: '',
    };
  }

  componentDidMount() {
    this.setState({user_details: this.props.profile_info, isLoading: false});
    // this._getUserInfo();
  }

  _getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token');
    axios
      .get(UNIVERSAL_ENTRY_POINT_ADDRESS + API_GET_USER_PROFILE_KEY, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then((res) => {
        console.log(res);
        this.setState({user_details: res.data, isLoading: false});
      })
      .catch((err) => {
        console.log({...err});
        alert(err.response.data.message || 'Error Detected!!');
        this.setState({
          err_msg: err.response.data.message || 'Error Detected!!',
          isLoading: false,
        });
      });
  };

  _handleTextInput = (e, input_name) => {
    this.setState({
      user_details: {
        ...this.state.user_details,
        [input_name]: e.nativeEvent.text,
      },
    });
  };

  _onImagePicker = () => {
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
            // console.log(img_data);
            this.state.user_details.avatar =
              `data:${img_data.mime};base64,` + img_data.data;
            this.state.avatar = `data:${img_data.mime};base64,` + img_data.data;
            this.setState({
              user_details: this.state.user_details,
              avatar: this.state.avatar,
            });
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
        console.log(err);
      });
  };

  _onSubmit = async () => {
    const {user_details, avatar} = this.state;
    const token = await AsyncStorage.getItem('token');
    const userProfileData = {
      username: user_details.username,
      full_name: user_details.full_name,
      profile_picture: avatar,
      bio: user_details.bio,
      web_url: user_details.web_url,
    };
    axios
      .post(
        UNIVERSAL_ENTRY_POINT_ADDRESS + API_UPDATE_USER_PROFILE_KEY,
        userProfileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        console.log(res);
        delete userProfileData.profile_picture;
        this.props.changeProfileInfo({...userProfileData, avatar});
        alert(res.data.message);
      })
      .catch((err) => {
        console.log({...err});
      });
  };

  render() {
    const {user_details, isLoading} = this.state;
    return (
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View
              style={{
                marginTop: 20,
                marginHorizontal: 14,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{marginTop: 10}}
                onPress={() => this._onImagePicker()}>
                <Image
                  borderRadius={100 / 2}
                  style={{
                    resizeMode: 'cover',
                    height: 100,
                    width: 100,
                    overflow: 'hidden',
                    borderColor: '#eeeeee',
                    borderWidth: 1,
                  }}
                  source={
                    user_details.avatar
                      ? {uri: user_details.avatar}
                      : require('../assets/default_avatar.jpg')
                  }
                />
              </TouchableOpacity>
              <View style={{width: '100%'}}>
                <View style={{marginTop: 14}}>
                  <TextInput
                    value={user_details.username}
                    mode="flat"
                    style={{backgroundColor: 'transparent'}}
                    label="Username"
                    onChange={(e) => this._handleTextInput(e, 'username')}
                    onSubmitEditing={() => this.fullName.focus()}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <TextInput
                    value={user_details.full_name}
                    mode="flat"
                    style={{backgroundColor: 'transparent'}}
                    label="Full Name"
                    ref={(input) => {
                      this.fullName = input;
                    }}
                    onChange={(e) => this._handleTextInput(e, 'full_name')}
                    onSubmitEditing={() => this.bio.focus()}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <TextInput
                    value={user_details.bio}
                    mode="flat"
                    style={{backgroundColor: 'transparent'}}
                    label="Bio"
                    multiline
                    numberOfLines={1}
                    ref={(input) => {
                      this.bio = input;
                    }}
                    onChange={(e) => this._handleTextInput(e, 'bio')}
                    onSubmitEditing={() => this.webURL.focus()}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <TextInput
                    mode="flat"
                    value={user_details.web_url}
                    style={{backgroundColor: 'transparent'}}
                    label="Web URL"
                    ref={(input) => {
                      this.webURL = input;
                    }}
                    onChange={(e) => this._handleTextInput(e, 'web_url')}
                  />
                </View>
                <View style={{marginTop: 30, marginBottom: 20}}>
                  <Button onPress={this._onSubmit} mode="contained">
                    Submit
                  </Button>
                </View>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile_info: state.profile_info,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeProfileInfo: (profile_info) => {
      dispatch({type: 'CHANGE_PROFILE_INFO', payload: profile_info});
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
