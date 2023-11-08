import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_STATE = {
  loggedInUser: null,
};

export const UserContext = createContext(INITIAL_STATE);

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        loggedInUser: action.payload,
      };
    case 'LOGOUT':
      return {
        loggedInUser: null,
      };
    default:
      return state;
  }
};

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, INITIAL_STATE);

  // Retrieve user information from AsyncStorage on initial load
  useEffect(() => {
    (async () => {
      try {
        const storedUser = await AsyncStorage.getItem('loggedInUser');
        if (storedUser) {
          dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
        }
      } catch (error) {
        console.error('Error retrieving user data from AsyncStorage:', error);
      }
    })();
  }, []);

  // Save user information to AsyncStorage when it changes
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(state.loggedInUser));
      } catch (error) {
        console.error('Error saving user data to AsyncStorage:', error);
      }
    })();
  }, [state.loggedInUser]);

  return (
    <UserContext.Provider
      value={{
        loggedInUser: state.loggedInUser,
        dispatch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
