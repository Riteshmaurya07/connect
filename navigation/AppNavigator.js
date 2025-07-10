// navigation/AppNavigator.js
import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import FeedScreen from '../screens/Feed/FeedScreen';
import NewPostScreen from '../screens/Feed/NewPostScreen';
import JobListScreen from '../screens/Jobs/JobListScreen';
import PostJobScreen from '../screens/Jobs/PostJobScreen';
import ConnectionsScreen from '../screens/Connection/ConnectionsScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Button } from 'react-native';


const Tab   = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useSelector(s => s.user);
  // (you could also just check `user != null` here)
  return <MainTabs />;
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed"       component={FeedStack} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Jobs"       component={JobStack} />
      <Tab.Screen name="Chat"       component={ChatScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// A stack just for Feed → NewPost
function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FeedMain"
        component={FeedScreen}
        options={({ navigation }) => ({
          title: 'Feed',
          // header button to push NewPost
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('NewPost')}
              title="+"
            />
          ),
        })}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPostScreen}
        options={{ title: 'Create Post' }}
      />
    </Stack.Navigator>
  );
}

// A stack just for Jobs → PostJob
function JobStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="JobList"  options={{ title: 'Jobs' }} component={JobListScreen} />
      <Stack.Screen name="PostJob"  options={{ title: 'Post a Job' }} component={PostJobScreen} />
    </Stack.Navigator>
  );
}
