import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { auth, db } from '../../services/firebase';
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';

export default function ChatScreen() {
  const [conversations, setConversations] = useState([]);
  const [chattingWith, setChattingWith] = useState(null);
  const [messages, setMessages] = useState([]);

  const currentUser = auth.currentUser;

  // Fetch connections
  useEffect(() => {
    const userRef = doc(db, 'users', currentUser.uid);
    const unsub = onSnapshot(userRef, async (snapshot) => {
      const userData = snapshot.data();
      const connIds = userData?.connections || [];

      const usersSnap = await Promise.all(
        connIds.map(uid => onSnapshot(doc(db, 'users', uid), (docSnap) => {
          setConversations(prev => {
            const others = prev.filter(u => u.uid !== uid);
            return [...others, { uid, ...docSnap.data() }];
          });
        }))
      );
    });

    return () => unsub();
  }, []);

  // Load messages
  useEffect(() => {
    if (!chattingWith) return;

    const chatId = [currentUser.uid, chattingWith.uid].sort().join('_');
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })));
    });

    return unsubscribe;
  }, [chattingWith]);

  const onSend = useCallback(async (messages = []) => {
    const chatId = [currentUser.uid, chattingWith.uid].sort().join('_');

    const msg = messages[0];
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      _id: msg._id,
      text: msg.text,
      createdAt: new Date(),
      user: msg.user,
    });
  }, [chattingWith]);

  if (!chattingWith) {
    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userCard} onPress={() => setChattingWith(item)}>
            <Text style={styles.userText}>{item.fullName}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No connections to chat with</Text>}
        contentContainerStyle={{ padding: 20 }}
      />
    );
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{ _id: currentUser.uid, name: currentUser.email }}
    />
  );
}

const styles = StyleSheet.create({
  userCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userText: {
    fontSize: 18,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
  },
});
