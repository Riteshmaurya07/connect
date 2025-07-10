// navigation/AuthNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen  from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Log In' }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ title: 'Sign Up' }} 
      />
    </Stack.Navigator>
  );
}
