import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../services/firebase';

export default function NewPostScreen({ navigation }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
    if (!result.cancelled) setImage(result.uri);
  };

  const handlePost = async () => {
    try {
      let imageUrl = '';
      if (image) {
        const res = await fetch(image);
        const blob = await res.blob();
        const filename = `posts/${Date.now()}-${auth.currentUser.uid}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'posts'), {
        author: auth.currentUser.email,
        content,
        imageUrl,
        likes: [],
        comments: [],
        createdAt: serverTimestamp()
      });

      setContent('');
      setImage(null);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write your post..."
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <Button title="Pick Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Post" onPress={handlePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 5 },
  image: { width: '100%', height: 200, borderRadius: 10, marginTop: 10 }
});
