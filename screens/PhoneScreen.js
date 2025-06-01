import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhoneScreen = ({navigation}) => {
  const [phone, setPhone] = useState('');

  const sendOtp = async () => {
    try {
      await AsyncStorage.setItem('userId', phone);
      // TODO: Add your OTP sending logic here
      // navigation.navigate('OtpScreen');
      console.log('Phone number saved:', phone);
    } catch (error) {
      console.error('Error saving userId', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בשמירת מספר הטלפון');
    }
  };

  return (
    <View style={{padding: 16}}>
      <TextInput
        placeholder="מספר טלפון"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={{fontSize: 18, marginBottom: 12}}
      />
      <Button title="שלח קוד" onPress={sendOtp} />
    </View>
  );
};

export default PhoneScreen;
