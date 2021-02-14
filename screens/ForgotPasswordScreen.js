import axios from 'axios';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    StyleSheet,
    ScrollView, 
    ToastAndroid
} from 'react-native';
import FormButton from '../components/FormButton';
import { UNIVERSAL_ENTRY_POINT_ADDRESS, API_FORGOT_PASSWORD_KEY, API_FORGOT_PASSWORD_OTP_VERIFICATION_KEY } from '@env';
import FormInput from '../components/FormInput';

const ForgotPasswordScreen = (props) => {
    const [user_identifier, setUserIdentifier] = useState("");
    const [confirmation_code, setConfirmationCode] = useState("");
    const [isConfirmationCodeInputVisible, setConfirmationCodeVisibility] = useState(false);
    const [responseID, setResponseID] = useState("");
    const [responseOTP, setResponseOTP] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");

    const _onNextPress = () => {
        axios.post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_FORGOT_PASSWORD_KEY, 
        {
            user_identifier: user_identifier
        })
        .then(res => {
            console.log(res);
            setResponseID(res.data.user_id);
            setResponseOTP(`${res.data.otp}`);
            setConfirmationCodeVisibility(true);
        })
        .catch(err => {
            console.log({...err});
            alert(err.response.data.message);
            setConfirmationCodeVisibility(false);
        })
    }

    const _onSubmitPress = () => {
        if(confirmation_code == responseOTP){
            axios.post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_FORGOT_PASSWORD_OTP_VERIFICATION_KEY,
            {
                user_identifier: user_identifier,
                otp: confirmation_code,
                password: password,
                confirm_password: confirm_password
            })
            .then(res => {
                console.log(res);
                ToastAndroid.showWithGravityAndOffset(
                    "Password Updated Successfully",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                props.navigation.navigate('Login');
            })
            .catch(err => {
                console.log({...err});
            })
        }
        else{
            alert("Incorrect OTP!");
        }        
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <Image
                source={require('../assets/tac_logo.png')}
                style={styles.logo}
            />

            {isConfirmationCodeInputVisible ?
            <View style={{alignItems:'center', marginBottom:20}}>
                <Text style={{textAlign:'center', textTransform:"uppercase", fontWeight:'bold', marginBottom:10, fontSize:16}}>Enter Confirmation Code</Text>
                <Text style={{textAlign:'center'}}>Enter the confirmation code that we sent to {responseID}.</Text>
                <Text style={{textAlign:'center', color:'blue', marginTop:10}}>Resend Confirmation Code</Text>
            </View> : null}

            <FormInput
                labelValue={user_identifier}
                onChangeText={(userIdentifier) => setUserIdentifier(userIdentifier)}
                placeholderText="Email, username or phone"
                iconType="user"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            {isConfirmationCodeInputVisible ?
            <>
                <FormInput
                    labelValue={confirmation_code}
                    onChangeText={(otp) => setConfirmationCode(otp)}
                    placeholderText="Confirmation Code"
                    iconType="codesquare"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormInput
                    labelValue={password}
                    onChangeText={(pass) => setPassword(pass)}
                    placeholderText="Password"
                    iconType="lock"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormInput
                    labelValue={confirm_password}
                    onChangeText={(conf_pass) => setConfirmPassword(conf_pass)}
                    placeholderText="Confirm Password"
                    iconType="lock"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </>
            : null}

            {!isConfirmationCodeInputVisible ?
            <FormButton
                buttonTitle={"Next"}
                isClickable={user_identifier  ? true : false}
                onPress={() => _onNextPress()}
            />
            :
            <FormButton
                buttonTitle={"Submit"}
                isClickable={confirmation_code.length ===  4 && password && confirm_password  ? true : false}
                onPress={() => _onSubmitPress()}
            />
            }
        </ScrollView>
    );
}

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    logo: {
      height: 130,
      width: 130,
      resizeMode: 'cover',
      marginBottom:40
    },

    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50
    },
});