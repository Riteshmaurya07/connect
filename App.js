// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null; // or a SplashScreen

  return (
    <Provider store={store}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </Provider>
  );
}
