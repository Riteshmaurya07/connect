import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignup = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email,
                fullName,
                profileImage: '',
                bio: '',
                connections: [],
                requestsSent: [],
                requestsReceived: [],
            });

            Alert.alert('Success', 'Account created!');
        } catch (error) {
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <TextInput placeholder="Full Name" style={styles.input} onChangeText={setFullName} />
            <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} autoCapitalize="none" />
            <TextInput placeholder="Password" style={styles.input} onChangeText={setPassword} secureTextEntry />
            <Button title="Create Account" onPress={handleSignup} />
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Log in</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 },
    link: { color: 'blue', marginTop: 15, textAlign: 'center' }
});
