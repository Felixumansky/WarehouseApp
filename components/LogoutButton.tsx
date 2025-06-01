// components/LogoutButton.tsx
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const LogoutButton: React.FC<Props> = ({navigation}) => {
  const handleLogout = async () => {
    Alert.alert('התנתקות', 'האם אתה בטוח שברצונך להתנתק?', [
      {text: 'ביטול', style: 'cancel'},
      {
        text: 'התנתק',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userId');
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Text style={styles.logoutButtonText}>התנתק</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
