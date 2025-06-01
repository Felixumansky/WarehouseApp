// screens/AddEditItemScreen.tsx
import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Keyboard,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../types';
import {saveItemsApi, getItemsApi} from '../api';
import uuid from 'react-native-uuid'; // ✅ החלפנו את הייבוא
import {launchImageLibrary} from 'react-native-image-picker';
import {Item} from '../types';
type AddEditItemNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddEditItem'
>;
type AddEditItemRouteProp = RouteProp<RootStackParamList, 'AddEditItem'>;

interface Props {
  navigation: AddEditItemNavigationProp;
  route: AddEditItemRouteProp;
}

const AddEditItemScreen: React.FC<Props> = ({navigation, route}) => {
  const existing = route.params?.item;
  const [name, setName] = useState(existing?.name ?? '');
  const [quantity, setQuantity] = useState(String(existing?.quantity ?? '1'));
  const [description, setDescription] = useState(existing?.description ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [imageUri, setImageUri] = useState(existing?.imageUri ?? '');

  const pickImage = async () => {
    try {
      console.log('Starting image picker...');
      const result = await launchImageLibrary({mediaType: 'photo'});
      if (result.assets && result.assets.length > 0) {
        console.log('Image selected:', result.assets[0].uri);
        setImageUri(result.assets[0].uri ?? '');
      } else {
        console.log('No image selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בעת בחירת תמונה');
    }
    Keyboard.dismiss(); // 👈 סוגר את המקלדת אחרי בחירת תמונה
  };

  const save = async () => {
    try {
      console.log('Saving item...');
      const allItems = await getItemsApi();
      console.log(`Loaded ${allItems.length} existing items`);

      let actionMsg: string;

      if (existing) {
        const updatedItem: Item = {
          ...existing,
          name,
          quantity: Number(quantity),
          description,
          location,
          imageUri,
        };
        actionMsg = 'Item updated successfully';
        await saveItemsApi(updatedItem);
        console.log('Updated item:', updatedItem);
      } else {
        const newItem: Item = {
          id: uuid.v4().toString(),
          name,
          quantity: Number(quantity),
          description,
          location,
          imageUri,
        };
        actionMsg = 'Item created successfully';
        await saveItemsApi(newItem);
        console.log('Created new item:', newItem);
      }

      Alert.alert('הצלחה', actionMsg);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('שגיאה', 'אירעה שגיאה בעת שמירת הפריט');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="שם"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="כמות"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="תיאור"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="מיקום"
        value={location}
        onChangeText={setLocation}
        style={styles.input}
      />

      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
        <Text style={styles.pickImageButtonText}>בחר תמונה</Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.image} />
      ) : null}

      <View style={styles.saveButtonContainer}>
        <Button title="שמור" onPress={save} />
      </View>
    </View>
  );
};

export default AddEditItemScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  input: {borderWidth: 1, marginBottom: 12, padding: 8, borderRadius: 4},
  pickImageButton: {
    backgroundColor: '#FF9800', // צבע כתום
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
    // ללא borderRadius → לא עגול
  },
  pickImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {width: 200, height: 200, marginVertical: 12, alignSelf: 'center'},
  saveButtonContainer: {marginTop: 20},
});
