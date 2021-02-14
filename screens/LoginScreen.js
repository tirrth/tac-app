import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import { AuthContext } from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [user_identifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  // const {login, googleLogin, fbLogin} = useContext(AuthContext);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/tac_logo.png')}
        style={styles.logo}
      />

      <FormInput
        labelValue={user_identifier}
        onChangeText={(userIdentifier) => setUserIdentifier(userIdentifier)}
        placeholderText="Email, username or phone"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton
        buttonTitle="Sign In"
        isClickable={user_identifier && password ? true : false}
        onPress={() => login(user_identifier, password)}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle="Sign In with Facebook"
            btnType="facebook"
            color="#4867aa"
            backgroundColor="#e6eaf4"
            // onPress={() => fbLogin()}
          />

          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            // onPress={() => googleLogin()}
          />
        </View>
      ) : null} */}

      <TouchableOpacity
        style={{...styles.forgotButton, marginTop:0}}
        onPress={() => navigation.navigate('SignupOne')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? <Text style={{fontWeight:'bold'}}>Create here</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  logo: {
    height: 130,
    width: 130,
    resizeMode: 'cover',
    marginBottom:40
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 24,
    fontWeight:'bold',
    marginBottom: 20,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2e64e5',
    // fontFamily: 'Lato-Regular',
  },
});
