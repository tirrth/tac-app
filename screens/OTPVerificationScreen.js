import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet, Pressable, Modal} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import { ScrollView } from 'react-native-gesture-handler';
import NFCReader from '../components/NFCReader';
import { connect } from 'react-redux';
import { UNIVERSAL_ENTRY_POINT_ADDRESS, API_OTP_VERIFICATION_KEY } from '@env';
import axios from 'axios';
// import { SafeAreaView } from 'react-native-safe-area-context';

const OTPVerificationScreen = (props) => {
  const [confirmationCode, setConfirmationCode] = useState("");
  const [nfcScan, setNfcScan] = useState(false);
//   const [timerMinute, setTimerMinute] = useState(1);
//   const [timerSecond, setTimerSecond] = useState(0);

//   React.useEffect(() => {
//     _timerCount();
//   }, []);

//   const _timerCountLoop = () => {
//     _timerCount();
//   }

//   const _timerCount = () => {
//     if(timerSecond === 0){
//         setTimerSecond(59);
//         setTimerMinute(timerMinute -  1);
//     }
    
//     if(timerMinute !== 0 || timerSecond !== 0){
//         setTimeout(() => {
//             setTimerSecond(timerSecond - 1);
//             _timerCountLoop();
//         }, 1000);
//     }
//   }

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

const _onPressNext = async () => {
    let header_data = _emptyKeyCheck(props.email, props.phone);
    header_data = {...header_data, otp: confirmationCode};
    try {
        await axios.post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_OTP_VERIFICATION_KEY, header_data)
        .then(res => {
            console.log(res);
            setNfcScan(true);
            // setTimeout(() => {
            //     setNfcScan(false);
            //     props.navigation.navigate('SignupTwo');
            // }, 1000);
        })
        .catch(err => {
            console.log({...err});
            alert(err.response.data.message);
            setNfcScan(false);
        })
    } catch (e) {
        console.log(e);
    }
}

//   const formButtonRef = React.useRef();

//   const FancyButton = React.forwardRef((props, ref) => (
//     <View ref={ref}>
//         {props.children}
//     </View>
//   ));

  return (
    <ScrollView style={{backgroundColor:'#f9fafd'}}>
      <View style={styles.container}>
        <View style={{alignItems:'center', marginBottom:20}}>
            <Text style={{textAlign:'center', textTransform:"uppercase", fontWeight:'bold', marginBottom:10, fontSize:16}}>Enter Confirmation Code</Text>
            <Text style={{textAlign:'center'}}>Enter the confirmation code that we sent to {props.email || props.phone}.</Text>
            <Text style={{textAlign:'center', color:'blue', marginTop:10}}>Resend Confirmation Code
            {/* {true ? ` in ${timerMinute}:${timerSecond}` : ``} */}
            </Text>
        </View>

        <FormInput
          labelValue={confirmationCode}
          onChangeText={(confirmation_code) => setConfirmationCode(confirmation_code)}
          placeholderText="Confirmation Code"
          iconType="codesquare"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <FormButton
            buttonTitle="Next"
            isClickable={confirmationCode.length === 4 ? true : false}
            loading={false}
            onPress={() => _onPressNext()}
        />
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.navButtonText}>Have an account? <Text style={{fontWeight:'bold'}}>Sign In</Text></Text>
        </TouchableOpacity>
      </View>
      {nfcScan ? <NFCReaderModal navigate={() => { setNfcScan(false); props.navigation.navigate('SignupTwo') }} /> : null}
    </ScrollView>
  );
};

class NFCReaderModal extends React.Component {
    render() {
        return (
            <View style={{height:'100%', width:'100%', position:'absolute', bottom:0, left:0, backgroundColor:'rgba(0,0,0,0.7)'}}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={true}
                    supportedOrientations='portrait'
                >
                        <View style={{height: '50%', marginTop: 'auto'}} showsVerticalScrollIndicator={false}>
                            <NFCReader navigate={() => this.props.navigate()} />
                        </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop:50
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
      email:state.email,
      phone:state.phone,
    }
};

export default connect(mapStateToProps)(OTPVerificationScreen);