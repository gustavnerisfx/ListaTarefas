import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@perfil';
const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) setProfile(JSON.parse(json));
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const saveProfile = async ({ username, email, photo }) => {
    const next = {
      username,
      email,
      photo: photo ?? null,
      createdAt: profile?.createdAt ?? Date.now(),
    };
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setProfile(next);
      return true;
    } catch (e) {
      return false;
    }
  };

  const removeProfile = async () => {
    setProfile(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProfileContext.Provider value={{ profile, loaded, saveProfile, removeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
