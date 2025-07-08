import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function PostJobScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handlePostJob = async () => {
    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        company,
        location,
        type,
        description,
        postedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      Alert.alert('Success', 'Job posted!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Job Title" style={styles.input} onChangeText={setTitle} />
      <TextInput placeholder="Company" style={styles.input} onChangeText={setCompany} />
      <TextInput placeholder="Location" style={styles.input} onChangeText={setLocation} />
      <TextInput placeholder="Job Type (e.g., Full-time)" style={styles.input} onChangeText={setType} />
      <TextInput
        placeholder="Description"
        multiline
        numberOfLines={4}
        style={[styles.input, { height: 100 }]}
        onChangeText={setDescription}
      />
      <Button title="Post Job" onPress={handlePostJob} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
});
