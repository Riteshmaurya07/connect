// screens/Feed/FeedScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

// Optional: factor out into a <PostCard> component later
function PostItem({ post }) {
  return (
    <View style={styles.postContainer}>
      <Text style={styles.postAuthor}>{post.authorName}</Text>
      {post.text?.length > 0 && <Text style={{ marginBottom: 8 }}>{post.text}</Text>}
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
    </View>
  );
}

export default function FeedScreen() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const postsRef = collection(db, 'posts');

  useEffect(() => {
    // listen to real‑time updates
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      const items = snapshot.docs.map(doc => ({
        id:   doc.id,
        ...doc.data()
      }));
      setPosts(items);
      setLoading(false);
    }, err => {
      console.error("FeedListener error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No posts yet. Tap “+” to create one!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <PostItem post={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  postAuthor: { fontWeight: 'bold', marginBottom: 4 },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 6,
  },
});
