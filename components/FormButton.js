import React from 'react';
import {Text, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {windowHeight, windowWidth} from '../utils/Dimensions';

const FormButton = ({buttonTitle, isClickable, loading, ...rest}) => {
  return (
    <TouchableOpacity style={{...styles.buttonContainer, backgroundColor:isClickable ? '#2e64e5' : 'rgba(46,100,229, 0.4)'}} disabled={isClickable ? false : true} {...rest}>
      {loading ? <ActivityIndicator color='#fff' size={25} /> : <Text style={styles.buttonText}>{buttonTitle}</Text>}
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    height: windowHeight / 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    
  },
});
