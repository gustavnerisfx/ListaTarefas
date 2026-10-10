import React from 'react';
import { TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../context/ProfileContext';
import UserAvatar from './UserAvatar';

export default function HeaderAvatar() {
  const navigation = useNavigation();
  const { profile } = useProfile();

  return (
    <TouchableRipple
      onPress={() => navigation.navigate('Perfil')}
      borderless
      style={{ borderRadius: 999 }}
      accessibilityLabel="Abrir perfil"
    >
      <UserAvatar photo={profile?.photo} name={profile?.username} size={38} />
    </TouchableRipple>
  );
}
