import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext';
import { useTasks } from '../context/TasksContext';
import { formatDate, isOverdue } from '../utils/taskUtils';
import UserAvatar from '../components/UserAvatar';
import StatTile from '../components/StatTile';

const MAX_PHOTO_CHARS = 1500000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProfileForm({ initial, onDone }) {
  const { colors } = useTheme();
  const { saveProfile } = useProfile();
  const editing = !!initial;

  const [username, setUsername] = useState(initial?.username ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [photo, setPhoto] = useState(initial?.photo ?? null);
  const [errors, setErrors] = useState({});
  const [photoError, setPhotoError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const pickImage = async (fromCamera) => {
    setPhotoError('');
    try {
      const options = { allowsEditing: true, aspect: [1, 1], quality: 0.4, base64: true };
      let result;

      if (fromCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPhotoError('Permita o acesso à câmera para tirar a foto.');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) return;

      const asset = result.assets[0];
      const dataUri = asset.base64
        ? `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`
        : asset.uri;

      if (dataUri.length > MAX_PHOTO_CHARS) {
        setPhotoError('Essa imagem é muito grande. Escolha uma foto menor.');
        return;
      }
      setPhoto(dataUri);
    } catch (e) {
      setPhotoError('Não foi possível carregar a imagem.');
    }
  };

  const validate = () => {
    const found = {};
    if (username.trim().length < 3) found.username = 'Use pelo menos 3 caracteres.';
    if (!EMAIL_REGEX.test(email.trim())) found.email = 'Digite um e-mail válido.';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSave = async () => {
    setFormError('');
    if (!validate()) return;

    setSaving(true);
    const ok = await saveProfile({
      username: username.trim(),
      email: email.trim(),
      photo,
    });
    setSaving(false);

    if (ok) onDone?.();
    else setFormError('Não foi possível salvar. Tente uma foto menor.');
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="headlineSmall" style={[styles.title, { color: colors.onSurface }]}>
        {editing ? 'Editar perfil' : 'Crie sua conta'}
      </Text>
      <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant, marginBottom: 20 }}>
        {editing
          ? 'Atualize seus dados e sua foto.'
          : 'Escolha um nome de usuário, informe seu e-mail e adicione uma foto.'}
      </Text>

      <View
        style={[
          styles.photoCard,
          { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
        ]}
      >
        <UserAvatar photo={photo} name={username} size={140} />
        <Text variant="labelMedium" style={{ marginTop: 10, color: colors.onSurfaceVariant }}>
          {photo ? 'Prévia da foto de perfil' : 'Sem foto (opcional)'}
        </Text>

        <View style={styles.photoActions}>
          <Button mode="contained-tonal" icon="image-outline" onPress={() => pickImage(false)}>
            Galeria
          </Button>
          {Platform.OS !== 'web' && (
            <Button
              mode="contained-tonal"
              icon="camera-outline"
              onPress={() => pickImage(true)}
              style={{ marginLeft: 10 }}
            >
              Câmera
            </Button>
          )}
        </View>

        {photo && (
          <Button
            mode="text"
            icon="close"
            compact
            textColor={colors.error}
            onPress={() => setPhoto(null)}
          >
            Remover foto
          </Button>
        )}
        <HelperText type="error" visible={!!photoError}>
          {photoError}
        </HelperText>
      </View>

      {/* Dados */}
      <TextInput
        mode="outlined"
        label="Nome de usuário"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (errors.username) setErrors((e) => ({ ...e, username: undefined }));
        }}
        error={!!errors.username}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={30}
        left={<TextInput.Icon icon="account-outline" />}
      />
      <HelperText type="error" visible={!!errors.username}>
        {errors.username}
      </HelperText>

      <TextInput
        mode="outlined"
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
        }}
        error={!!errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        left={<TextInput.Icon icon="email-outline" />}
      />
      <HelperText type="error" visible={!!errors.email}>
        {errors.email}
      </HelperText>

      <HelperText type="error" visible={!!formError}>
        {formError}
      </HelperText>

      <Button
        mode="contained"
        icon={editing ? 'check' : 'account-plus-outline'}
        onPress={handleSave}
        loading={saving}
        disabled={saving}
        style={styles.save}
        contentStyle={styles.saveContent}
      >
        {editing ? 'Salvar alterações' : 'Criar conta'}
      </Button>
      {editing && (
        <Button mode="text" onPress={onDone} style={{ marginTop: 4 }}>
          Cancelar
        </Button>
      )}
    </ScrollView>
  );
}

function ProfileView({ onEdit }) {
  const { colors } = useTheme();
  const { profile, removeProfile } = useProfile();
  const { tasks, now } = useTasks();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const pending = tasks.filter((t) => !t.done);
  const overdueCount = pending.filter((t) => isOverdue(t, now)).length;
  const doneCount = tasks.length - pending.length;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
        ]}
      >
        <UserAvatar photo={profile.photo} name={profile.username} size={120} />
        <Text
          variant="headlineSmall"
          style={{ marginTop: 16, fontWeight: '700', color: colors.onSurface }}
        >
          {profile.username}
        </Text>
        <Text variant="bodyMedium" style={{ marginTop: 2, color: colors.onSurfaceVariant }}>
          {profile.email}
        </Text>
        <Text variant="bodySmall" style={{ marginTop: 10, color: colors.onSurfaceVariant }}>
          Conta criada em {formatDate(profile.createdAt)}
        </Text>
      </View>

      <View style={styles.stats}>
        <StatTile
          value={pending.length}
          label="Pendentes"
          backgroundColor={colors.primaryContainer}
          color={colors.onPrimaryContainer}
        />
        <View style={{ width: 10 }} />
        <StatTile
          value={overdueCount}
          label="Vencidas"
          backgroundColor={overdueCount > 0 ? colors.errorContainer : colors.surfaceVariant}
          color={overdueCount > 0 ? colors.onErrorContainer : colors.onSurfaceVariant}
        />
        <View style={{ width: 10 }} />
        <StatTile
          value={doneCount}
          label="Concluídas"
          backgroundColor={colors.surfaceVariant}
          color={colors.onSurfaceVariant}
        />
      </View>

      <Button
        mode="contained"
        icon="pencil-outline"
        onPress={onEdit}
        style={styles.save}
        contentStyle={styles.saveContent}
      >
        Editar perfil
      </Button>
      <Button
        mode="text"
        icon="account-remove-outline"
        textColor={colors.error}
        onPress={() => setConfirmVisible(true)}
        style={{ marginTop: 8 }}
      >
        Excluir conta
      </Button>

      {confirmVisible && (
        <Portal>
          <Dialog visible onDismiss={() => setConfirmVisible(false)}>
            <Dialog.Title>Excluir conta?</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">
                Seu perfil (nome, e-mail e foto) será removido deste aparelho. Suas tarefas
                continuam salvas.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
              <Button
                textColor={colors.error}
                onPress={() => {
                  setConfirmVisible(false);
                  removeProfile();
                }}
              >
                Excluir
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
    </ScrollView>
  );
}

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { profile, loaded } = useProfile();
  const [editing, setEditing] = useState(false);

  if (!loaded) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!profile || editing) {
    return <ProfileForm initial={profile} onDone={() => setEditing(false)} />;
  }
  return <ProfileView onEdit={() => setEditing(true)} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 40 },
  title: { fontWeight: '700', marginBottom: 4 },
  photoCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  photoActions: { flexDirection: 'row', marginTop: 16, marginBottom: 4 },
  heroCard: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stats: { flexDirection: 'row', marginBottom: 20 },
  save: { marginTop: 8, borderRadius: 14 },
  saveContent: { paddingVertical: 6 },
});
