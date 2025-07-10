import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { auth, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.log("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>No user data found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData.profileImage ? (
        <Image source={{ uri: userData.profileImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.email}>{userData.email}</Text>
      <Text style={styles.bio}>{userData.bio || "No bio yet."}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 50 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  placeholderImage: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', marginBottom: 20,
  },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { fontSize: 16, color: 'gray' },
  bio: { fontSize: 14, color: '#555', marginTop: 10 },
});
// This code defines a ProfileScreen component that fetches and displays the user's profile information.