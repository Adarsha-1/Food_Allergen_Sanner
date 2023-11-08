import React from 'react';
import { UserContextProvider } from './context/UserContext';
import AppNavigator from './Navigation/AppNavigator';

const App = () => {
  return (
    <UserContextProvider>
      <AppNavigator />
    </UserContextProvider>
  
  )
};

export default App;
