import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import axios from 'axios';
import {UNIVERSAL_ENTRY_POINT_ADDRESS, API_REGISTER_USER_KEY} from '@env';

const SignupScreenTwo = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const {login} = useContext(AuthContext);

  const _emptyKeyCheck = (email, phone) => {
    if (email && phone) {
      return {email, phone};
    } else if (phone) {
      return {phone};
    } else {
      return {email};
    }
  };

  const _onRegister = () => {
    let header_data = _emptyKeyCheck(props.email, props.phone);
    header_data = {
      ...header_data,
      username: username,
      password: password,
      full_name: fullname,
      gender_id: 1,
    };

    axios
      .post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_REGISTER_USER_KEY, header_data)
      .then((res) => {
        console.log(res);
        login(props.email, password);
      })
      .catch((err) => {
        console.log({...err});

        const key_arr = Object.keys(err.response.data);
        let err_msg = '';
        key_arr.map((key_name) => {
          err_msg += err.response.data[key_name];
        });
        alert(err_msg || `Found an issue, Please try again later!`);
      });
  };

  return (
    <ScrollView style={{backgroundColor: '#f9fafd', height: '100%'}}>
      <View style={styles.container}>
        <FormInput
          labelValue={username}
          onChangeText={(username) => setUsername(username)}
          placeholderText="Username"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          labelValue={fullname}
          onChangeText={(fullname) => setFullname(fullname)}
          placeholderText="Full Name"
          iconType="user"
          autoCorrect={false}
        />
        <FormInput
          labelValue={password}
          onChangeText={(password) => setPassword(password)}
          placeholderText="Password"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />
        <FormInput
          labelValue={confirm_password}
          onChangeText={(confirm_password) =>
            setConfirmPassword(confirm_password)
          }
          placeholderText="Confirm Password"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />

        {/* <FormInput
          labelValue={password}
          onChangeText={(userPassword) => setPassword(userPassword)}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={(userPassword) => setConfirmPassword(userPassword)}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        /> */}

        <FormButton
          buttonTitle="Sign Up"
          isClickable={
            username && fullname && password && confirm_password === password
          }
          onPress={() => _onRegister()}
        />

        <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
            By registering, you confirm that you accept our{' '}
          </Text>
          <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
            <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
              Terms of service
            </Text>
          </TouchableOpacity>
          <Text style={styles.color_textPrivate}> and </Text>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Privacy Policy
          </Text>
        </View>

        {/* {Platform.OS === 'android' ? (
          <View>
            <SocialButton
              buttonTitle="Sign Up with Facebook"
              btnType="facebook"
              color="#4867aa"
              backgroundColor="#e6eaf4"
              onPress={() => {}}
            />
      
            <SocialButton
              buttonTitle="Sign Up with Google"
              btnType="google"
              color="#de4d41"
              backgroundColor="#f5e7ea"
              onPress={() => {}}
            />
          </View>
        ) : null} */}

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.navButtonText}>
            Have an account? <Text style={{fontWeight: 'bold'}}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2e64e5',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',

    color: 'grey',
  },
});

const mapStateToProps = (state) => {
  return {
    email: state.email,
    phone: state.phone,
  };
};

export default connect(mapStateToProps)(SignupScreenTwo);
