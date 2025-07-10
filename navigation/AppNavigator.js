import React from 'react';
import { useSelector } from 'react-redux'; // to get user from redux
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from '../screens/Feed/FeedScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ConnectionsScreen from '../screens/Connection/ConnectionsScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import JobListScreen from '../screens/Jobs/JobListScreen';
import NewPostScreen from '../screens/Feed/NewPostScreen';
import PostJobScreen from '../screens/Jobs/PostJobScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useSelector(state => state.user); // your redux user state

  return user ? <MainTabs /> : <AuthStack />;
}

// 👉 Tabs for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={FeedStack} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Jobs" component={JobStack} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 👉 Auth stack for unauthenticated users
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// 👉 Stack inside Feed
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FeedHome" component={FeedScreen} options={{ title: 'Feed' }} />
      <Stack.Screen name="NewPost" component={NewPostScreen} />
    </Stack.Navigator>
  );
}

// 👉 Stack inside Jobs
function JobStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobList" component={JobListScreen} options={{ title: 'Jobs' }} />
      <Stack.Screen name="PostJob" component={PostJobScreen} />
    </Stack.Navigator>
  );
}
