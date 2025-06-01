// src/api.ts
import axios from 'axios';
import {Item} from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://warehouse-server-3v9m.onrender.com/api';

export const getItemsApi = async (): Promise<Item[]> => {
  console.log('getItemsApi userId');

  const userId = await AsyncStorage.getItem('userId');
  console.log('getItemsApi userId ' + userId);
  const resp = await axios.get<Item[]>(`${BASE_URL}/items`, {
    params: {userId},
  });
  console.log('getItemsApi resp ' + resp.data);

  return resp.data;
};

export const saveItemsApi = async (item: Item): Promise<Item> => {
  const userId = await AsyncStorage.getItem('userId');

  // אם יש id — זה update
  if (item.id) {
    const {id, ...body} = item;
    const resp = await axios.put<Item>(`${BASE_URL}/items/${id}`, body);
    return resp.data;
  }

  // אחרת — יצירה חדשה
  // אם רוצים לתמוך ב-upload.single("image"), אפשר להשתמש ב־FormData:
  const form = new FormData();
  form.append('name', item.name);
  form.append('description', item.description);
  form.append('quantity', item.quantity.toString());
  form.append('location', item.location);
  form.append('userId', userId);
  // אם יש קובץ תמונה ב־item.imageUrl ( URI מקומי ), נצרף אותו:
  if (item.imageUri) {
    form.append('image', {
      uri: item.imageUri,
      type: 'image/jpeg', // או המתאים
      name: 'photo.jpg',
    } as any);
  }

  const resp = await axios.post<Item>(`${BASE_URL}/items`, form, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return resp.data;
};

export const deleteItemApi = async (itemId: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/items/${itemId}`);
};

export const scanImageApi = async (
  fileUri: string,
  userId: string,
): Promise<{imageUrl: string}> => {
  const form = new FormData();
  form.append('image', {
    uri: fileUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);
  form.append('userId', userId);

  const resp = await axios.post<{imageUrl: string}>(
    `${BASE_URL}/scan-image`,
    form,
    {headers: {'Content-Type': 'multipart/form-data'}},
  );
  return resp.data;
};
