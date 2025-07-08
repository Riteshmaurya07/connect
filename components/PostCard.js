import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostCard({ post }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{post.author}</Text>
      <Text>{post.content}</Text>
      {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} />}
      <View style={styles.actions}>
        <TouchableOpacity><Text>👍 {post.likes?.length || 0}</Text></TouchableOpacity>
        <TouchableOpacity><Text>💬 {post.comments?.length || 0}</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  image: { height: 200, width: '100%', borderRadius: 10, marginTop: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }
});
