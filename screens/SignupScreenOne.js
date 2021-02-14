import React, { useContext, useState } from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet, Pressable, Image} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import axios from 'axios';
import { UNIVERSAL_ENTRY_POINT_ADDRESS, API_SAVE_TEMP_USER_KEY } from '@env';

const SignupScreenOne = (props) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [registerMethodToggle, setRegisterMethodToggle] = useState(true);

  const _emptyKeyCheck = (email, phone) => {
    if(email && phone){
      return { email, phone }
    }
    else if(phone){
      return { phone }
    }
    else {
      return { email }
    }
  }

  const _onSubmit = async () => {
    const header_data = _emptyKeyCheck(email, phone);
    try {
      await axios.post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_SAVE_TEMP_USER_KEY , header_data)
        .then((res) => {
          console.log(res);
          props.navigation.navigate('OTPVerification');
          props.changeEmail(email);
          props.changePhone(phone);          })
        .catch((err) => {
          console.log({...err});
          alert(err.response.data.message || err.response.data.email || err.response.data.phone || 'There is some issue.');
        })
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView style={{backgroundColor:'#f9fafd'}} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image
          source={require('../assets/tac_logo.png')}
          style={styles.logo}
        />
        <View style={{flexDirection:'row', justifyContent:'space-between', width:'100%', marginBottom:20, marginTop:10}}>  
          <View style={{borderBottomWidth: registerMethodToggle ? 1.5 : 1, borderBottomColor: registerMethodToggle ? '#000' : '#8d8d8d', flex:1}}>
            <Pressable onPress={() => setRegisterMethodToggle(true)}>
              <Text style={{textAlign:'center', marginBottom:12, fontWeight: registerMethodToggle ? 'bold' : 'normal'}}>EMAIL ADDRESS</Text>
            </Pressable>
          </View>
          <View style={{borderBottomWidth: registerMethodToggle ? 1 : 1.5, borderBottomColor: registerMethodToggle ? '#8d8d8d' : '#000', flex:1}}>
            <Pressable onPress={() => setRegisterMethodToggle(false)}>
              <Text style={{textAlign:'center', marginBottom:12, fontWeight: registerMethodToggle ? 'normal' : 'bold'}}>PHONE NUMBER</Text>
            </Pressable>
          </View>
        </View>

      {registerMethodToggle ?
        <FormInput
          labelValue={email}
          onChangeText={(userEmail) => setEmail(userEmail)}
          placeholderText="Email"
          iconType="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        :
        <FormInput
          labelValue={phone}
          onChangeText={(userPhone) => setPhone(userPhone)}
          placeholderText="Phone"
          iconType="phone"
          keyboardType='number-pad'
          autoCapitalize="none"
          autoCorrect={false}
        />}

        <FormButton
          buttonTitle="Sign Up"
          isClickable={email || phone ? true : false}
          onPress={() =>  _onSubmit()}
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
          <Text style={styles.navButtonText}>Have an account? <Text style={{fontWeight:'bold'}}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  logo: {
    height: 130,
    width: 130,
    resizeMode: 'cover',
    marginBottom:40
  },

  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop:20
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
    fontSize: 16,
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

const mapDispatchToProps = (dispatch) => {
  return {
    changeEmail:(email) => { dispatch({type:'CHANGE_EMAIL', payload:email}) },
    changePhone:(phone) => { dispatch({type:'CHANGE_PHONE', payload:phone}) },
  }
};

export default connect(null, mapDispatchToProps)(SignupScreenOne);