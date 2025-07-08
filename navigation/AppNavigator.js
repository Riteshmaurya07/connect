import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FeedScreen from '../screens/Feed/FeedScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ConnectionsScreen from '../screens/Connection/ConnectionsScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import JobListScreen from '../screens/Jobs/JobListScreen';
import NewPostScreen from '../screens/Feed/NewPostScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PostJobScreen from '../screens/Jobs/PostJobScreen';


const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
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

// function FeedStack() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="Feed" component={FeedScreen} />
//             <Stack.Screen name="NewPost" component={NewPostScreen} />
//         </Stack.Navigator>
//     );
// }

// function JobStack() {
//     return (
//         <Stack.Navigator>
//             <Stack.Screen name="JobList" component={JobListScreen} options={{ title: 'Jobs' }} />
//             <Stack.Screen name="PostJob" component={PostJobScreen} />
//         </Stack.Navigator>
//     );
// }

