import React, {createContext, useState} from 'react';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { UNIVERSAL_ENTRY_POINT_ADDRESS, API_LOGIN_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  React.useEffect(() => {
    // AsyncStorage.removeItem('token');
    AsyncStorage.getItem('token').then(val => {
      console.log("previous_token",val);
      setToken(val);
    }).catch(err => {
      console.log(err);
      setToken(null);
    });
  }, []);

  const authContext = React.useMemo(() => {
    return {
      token,
      setToken,
      login: async (user_identifier, password) => {
        try {
          await axios.post(UNIVERSAL_ENTRY_POINT_ADDRESS + API_LOGIN_KEY ,
          {
            user_identifier: user_identifier,
            password: password
          })
          .then(res => {
            console.log(res);
            AsyncStorage.setItem('token', res.data.access_token);
            setToken(res.data.access_token);
            console.log(res.data.access_token);
          })
          .catch(err => {
            console.log({...err});
            alert(err.response.data.message || err.response.data.password || err.response.data.user_identifier || 'Credentials are not correct.');
          })
        } catch (e) {
          console.log(e);
        }
      },
      logout: async () => {
        AsyncStorage.removeItem('token');
        setToken(null);
      }
    }
  });

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
