import React, { useState }      from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker          from 'expo-image-picker';
import { useSelector }           from 'react-redux';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage }           from '../../services/firebase';

export default function NewPostScreen({ navigation }) {
  const [text,       setText]    = useState('');
  const [imageUri,   setImageUri]= useState(null);
  const [uploading,  setUploading]= useState(false);
  const user = useSelector(s => s.user);

  // 1) PICK AN IMAGE
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return Alert.alert('Permission required', 'We need access to your photos.');
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality:    0.7,
    });
    if (!result.cancelled) {
      setImageUri(result.uri);
    }
  };

  // 2) UPLOAD & GET URL
  const uploadImageAsync = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob     = await response.blob();
    const filename = `posts/${Date.now()}_${user.uid}.jpg`;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        null,
        err => {
          setUploading(false);
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          resolve(url);
        }
      );
    });
  };

  // 3) HANDLE POST
  const handlePost = async () => {
    if (!text.trim() && !imageUri) {
      return Alert.alert('Oops', 'Please add text or select an image.');
    }

    try {
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImageAsync(imageUri);
      }

      await addDoc(collection(db, 'posts'), {
        text:       text.trim() || '',
        imageUrl,                                // may be null
        authorName: user.displayName || user.email,
        createdAt:  serverTimestamp(),
      });

      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What's on your mind?"
        multiline
        value={text}
        onChangeText={setText}
      />

      <Button title="Choose Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      {uploading 
        ? <ActivityIndicator size="large" style={{ marginTop: 16 }} />
        : <Button title="Post" onPress={handlePost} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 6,
  },
});
