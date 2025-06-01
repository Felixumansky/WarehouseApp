import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import AddEditItemScreen from './screens/AddEditItemScreen';
import {RootStackParamList} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from './components/LogoutButton';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Login');

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      setInitialRoute(userId ? 'Main' : 'Login');
    };
    checkUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'כניסה'}}
        />
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={({navigation}) => ({
            title: 'רשימת פריטים',
            headerRight: () => <LogoutButton navigation={navigation} />,
          })}
        />

        <Stack.Screen
          name="AddEditItem"
          component={AddEditItemScreen}
          options={({navigation}) => ({
            title: 'הוספה / עריכה',
            headerRight: () => <LogoutButton navigation={navigation} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
