// screens/LoginScreen.tsx
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [phone, setPhone] = useState('');

  const validatePhone = (phone: string): boolean => {
    const trimmed = phone.trim();
    return /^\d{9,}$/.test(trimmed); // לפחות 9 ספרות, כולן ספרות
  };

  const handleLogin = async () => {
    if (!validatePhone(phone)) {
      Alert.alert('שגיאה', 'אנא הזן מספר טלפון תקין (לפחות 9 ספרות)');
      return;
    }

    await AsyncStorage.setItem('userId', phone.trim());
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>הכנס מספר טלפון:</Text>
      <TextInput
        placeholder="05X-XXXXXXX"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        maxLength={15}
      />
      <Button title="התחבר" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', padding: 16},
  label: {fontSize: 18, marginBottom: 8, textAlign: 'center'},
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
});
