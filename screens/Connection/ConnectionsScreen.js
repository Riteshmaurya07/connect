import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { auth, db } from '../../services/firebase';
import { collection, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore';

export default function ConnectionsScreen() {
  const [users, setUsers] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);

  const currentUserId = auth.currentUser.uid;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'users', currentUserId), (docSnap) => {
      setCurrentUserData(docSnap.data());
    });

    return unsub;
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, 'users'));
      const filtered = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.uid !== currentUserId);
      setUsers(filtered);
    };
    fetchUsers();
  }, []);

  const sendRequest = async (receiver) => {
    const senderRef = doc(db, 'users', currentUserId);
    const receiverRef = doc(db, 'users', receiver.uid);

    await updateDoc(senderRef, {
      requestsSent: [...(currentUserData?.requestsSent || []), receiver.uid],
    });

    await updateDoc(receiverRef, {
      requestsReceived: [...(receiver.requestsReceived || []), currentUserId],
    });
  };

  const acceptRequest = async (senderUid) => {
    const senderRef = doc(db, 'users', senderUid);
    const receiverRef = doc(db, 'users', currentUserId);

    await updateDoc(senderRef, {
      connections: [...(currentUserData?.connections || []), currentUserId],
      requestsSent: (currentUserData?.requestsSent || []).filter(uid => uid !== currentUserId),
    });

    await updateDoc(receiverRef, {
      connections: [...(currentUserData?.connections || []), senderUid],
      requestsReceived: (currentUserData?.requestsReceived || []).filter(uid => uid !== senderUid),
    });
  };

  const renderUser = ({ item }) => {
    const isConnected = currentUserData?.connections?.includes(item.uid);
    const hasSent = currentUserData?.requestsSent?.includes(item.uid);
    const hasReceived = currentUserData?.requestsReceived?.includes(item.uid);

    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.fullName}</Text>

        {isConnected ? (
          <Text style={styles.connected}>✅ Connected</Text>
        ) : hasSent ? (
          <Text>⏳ Request Sent</Text>
        ) : hasReceived ? (
          <Button title="Accept Request" onPress={() => acceptRequest(item.uid)} />
        ) : (
          <Button title="Connect" onPress={() => sendRequest(item)} />
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.uid}
      renderItem={renderUser}
      ListEmptyComponent={<Text style={styles.empty}>No users found</Text>}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  card: { padding: 15, marginBottom: 15, borderWidth: 1, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  connected: { color: 'green', marginTop: 5 },
  empty: { textAlign: 'center', marginTop: 20 }
});
