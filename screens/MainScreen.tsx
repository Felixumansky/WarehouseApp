// screens/MainScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {I18nManager} from 'react-native';
import {getItemsApi, deleteItemApi} from '../api';
import {Item} from '../types';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

interface Props {
  navigation: MainScreenNavigationProp;
}

const MainScreen: React.FC<Props> = ({navigation}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Current user1:', userId);

      const data = await getItemsApi();
      console.log('Loaded items:', data.length);
      setItems(data);
      setFilteredItems(data);
    };

    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const deleteItem = async (id: string) => {
    Alert.alert('אישור מחיקה', 'האם אתה בטוח שברצונך למחוק?', [
      {text: 'ביטול', style: 'cancel'},
      {
        text: 'מחק',
        style: 'destructive',
        onPress: async () => {
          const filtered = items.filter(i => i.id !== id);
          await deleteItemApi(id);
          setItems(filtered);
          handleSearch(searchQuery, filtered);
        },
      },
    ]);
  };

  const handleSearch = (query: string, list: Item[] = items) => {
    setSearchQuery(query);
    const filtered = list.filter(
      item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()) ||
        item.location?.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredItems(filtered);
  };

  const renderItem = ({item}: {item: Item}) => (
    <View style={styles.card}>
      <Image
        source={item.imageUri ? {uri: item.imageUri} : undefined}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.name} (x{item.quantity})
        </Text>
        <Text>{item.description}</Text>
        <Text>{item.location}</Text>
      </View>
      <View style={styles.buttonColumn}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('AddEditItem', {item})}>
          <Text style={styles.buttonText}>ערוך</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteItem(item.id)}>
          <Text style={styles.buttonText}>מחק</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{flex: 1}}>
      <TextInput
        placeholder="חפש לפי שם, תיאור או מיקום"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 80}}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditItem', {})}>
        <Text style={styles.addButtonText}>הוסף פריט</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  logoutContainer: {
    position: 'absolute',
    top: 0,
    [I18nManager.isRTL ? 'right' : 'left']: 0,
    zIndex: 10,
  },

  header: {fontSize: 20, textAlign: 'center', marginTop: 60, marginBottom: 10},
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
    padding: 8,
    borderRadius: 4,
  },
  card: {
    flexDirection: 'row', // במקום 'row-reverse'
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  info: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonColumn: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
    marginRight: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {backgroundColor: '#2196F3'},
  deleteButton: {backgroundColor: '#f44336'},
  buttonText: {color: '#fff', fontWeight: 'bold'},
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 24,
  },
  addButtonText: {color: 'white', fontSize: 16},
});
