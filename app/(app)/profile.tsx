import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type Dog, useDogStore } from '../../src/state/useDogStore';

const colors = {
  ink: '#20352a',
  muted: '#718076',
  green: '#28543d',
  pale: '#eef2e8',
  canvas: '#f8f8f3',
  line: '#e8ebe3',
  white: '#ffffff',
  red: '#a6453c',
};

const emptyForm = { name: '', breed: '', age: '' };

export default function ProfileScreen() {
  const dogs = useDogStore((state) => state.dogs);
  const addDog = useDogStore((state) => state.addDog);
  const updateDog = useDogStore((state) => state.updateDog);
  const removeDog = useDogStore((state) => state.removeDog);
  const [form, setForm] = useState(emptyForm);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');

  const openNewDogForm = () => {
    setForm(emptyForm);
    setEditingDogId(null);
    setError('');
    setIsFormOpen(true);
  };

  const editDog = (dog: Dog) => {
    setForm({ name: dog.name, breed: dog.breed, age: dog.age });
    setEditingDogId(dog.id);
    setError('');
    setIsFormOpen(true);
  };

  const saveDog = () => {
    const name = form.name.trim();
    const breed = form.breed.trim();
    if (!name || !breed) {
      setError('Vul de naam en het ras van je hond in.');
      return;
    }

    const dog = { name, breed, age: form.age.trim() };
    if (editingDogId) updateDog(editingDogId, dog);
    else addDog(dog);
    setIsFormOpen(false);
    setEditingDogId(null);
    setForm(emptyForm);
    setError('');
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.back()} style={styles.backLink} accessibilityRole="button">
        <MaterialCommunityIcons name="arrow-left" size={19} color={colors.green} />
        <Text style={styles.backText}>Terug</Text>
      </Pressable>

      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <MaterialCommunityIcons name="account" size={26} color={colors.green} />
        </View>
        <Text style={styles.heroEyebrow}>MIJN PROFIEL</Text>
        <Text style={styles.heroTitle}>Mijn honden</Text>
        <Text style={styles.heroSubtitle}>Beheer je viervoeters en kies ze wanneer je naar een weide gaat.</Text>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Jouw roedel</Text>
          <Text style={styles.sectionSubtitle}>{dogs.length} {dogs.length === 1 ? 'hond geregistreerd' : 'honden geregistreerd'}</Text>
        </View>
        {!isFormOpen && dogs.length > 0 && (
          <Pressable style={styles.addButton} onPress={openNewDogForm} accessibilityRole="button">
            <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
            <Text style={styles.addButtonText}>Hond toevoegen</Text>
          </Pressable>
        )}
      </View>

      {dogs.length === 0 && !isFormOpen && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="dog-side" size={32} color={colors.green} />
          </View>
          <Text style={styles.emptyTitle}>Je roedel is nog leeg</Text>
          <Text style={styles.emptySubtitle}>Voeg je hond toe om je straks in te schrijven voor een speeldate.</Text>
          <Pressable style={styles.primaryButton} onPress={openNewDogForm} accessibilityRole="button">
            <MaterialCommunityIcons name="plus" size={19} color={colors.white} />
            <Text style={styles.primaryButtonText}>Mijn eerste hond toevoegen</Text>
          </Pressable>
        </View>
      )}

      {dogs.map((dog, index) => (
        <View key={dog.id} style={styles.dogCard}>
          <View style={[styles.dogAvatar, { backgroundColor: ['#f4e3cc', '#dcebd4', '#eee2ee', '#dce8ef'][index % 4] }]}>
            <MaterialCommunityIcons name="dog-side" size={27} color={colors.green} />
          </View>
          <View style={styles.dogInfo}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <Text style={styles.dogMeta}>{dog.breed}{dog.age ? ` · ${dog.age} jaar` : ''}</Text>
          </View>
          <Pressable
            onPress={() => editDog(dog)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={`Bewerk ${dog.name}`}
          >
            <MaterialCommunityIcons name="pencil-outline" size={19} color={colors.green} />
          </Pressable>
          <Pressable
            onPress={() => removeDog(dog.id)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={`Verwijder ${dog.name}`}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={19} color={colors.red} />
          </Pressable>
        </View>
      ))}

      {isFormOpen && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{editingDogId ? 'Hond bewerken' : 'Nieuwe hond'}</Text>
          <Text style={styles.fieldLabel}>Naam *</Text>
          <TextInput
            value={form.name}
            onChangeText={(name) => setForm((current) => ({ ...current, name }))}
            placeholder="Bijv. Bobby"
            placeholderTextColor="#99a39b"
            style={styles.input}
            accessibilityLabel="Naam van je hond"
            returnKeyType="next"
          />
          <Text style={styles.fieldLabel}>Ras *</Text>
          <TextInput
            value={form.breed}
            onChangeText={(breed) => setForm((current) => ({ ...current, breed }))}
            placeholder="Bijv. Labrador"
            placeholderTextColor="#99a39b"
            style={styles.input}
            accessibilityLabel="Ras van je hond"
            returnKeyType="next"
          />
          <Text style={styles.fieldLabel}>Leeftijd (optioneel)</Text>
          <TextInput
            value={form.age}
            onChangeText={(age) => setForm((current) => ({ ...current, age }))}
            placeholder="Bijv. 3 jaar"
            placeholderTextColor="#99a39b"
            style={styles.input}
            accessibilityLabel="Leeftijd van je hond"
          />
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.formActions}>
            <Pressable
              onPress={() => { setIsFormOpen(false); setError(''); }}
              style={styles.cancelButton}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Annuleren</Text>
            </Pressable>
            <Pressable onPress={saveDog} style={styles.primaryButton} accessibilityRole="button">
              <MaterialCommunityIcons name="check" size={18} color={colors.white} />
              <Text style={styles.primaryButtonText}>Opslaan</Text>
            </Pressable>
          </View>
        </View>
      )}

      <Text style={styles.disclaimer}>Profielen zijn alleen op dit apparaat beschikbaar.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { width: '100%', maxWidth: 700, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 38 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingTop: 19, paddingBottom: 14 },
  backText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  hero: { backgroundColor: colors.green, borderRadius: 22, padding: 21, minHeight: 150, justifyContent: 'center' },
  heroIcon: { width: 43, height: 43, borderRadius: 15, backgroundColor: '#ffffffd9', alignItems: 'center', justifyContent: 'center', marginBottom: 11 },
  heroEyebrow: { color: '#c5d8c6', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: colors.white, fontSize: 24, fontWeight: '800', marginTop: 3 },
  heroSubtitle: { color: '#dce8dc', fontSize: 12, lineHeight: 18, marginTop: 5, maxWidth: 360 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 9, marginTop: 25, marginBottom: 13 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  addButton: { backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 11, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 4 },
  addButtonText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  emptyState: { backgroundColor: colors.white, borderRadius: 19, borderColor: colors.line, borderWidth: 1, padding: 23, alignItems: 'center', gap: 9 },
  emptyIcon: { width: 60, height: 60, borderRadius: 21, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: 3 },
  emptySubtitle: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', maxWidth: 300 },
  primaryButton: { backgroundColor: colors.green, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  primaryButtonText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  dogCard: { flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.line, padding: 12, marginBottom: 10 },
  dogAvatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dogInfo: { flex: 1 },
  dogName: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  dogMeta: { color: colors.muted, fontSize: 11, marginTop: 4 },
  iconButton: { width: 37, height: 37, borderRadius: 12, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  formCard: { backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 16, marginTop: 2 },
  formTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', marginBottom: 13 },
  fieldLabel: { color: colors.ink, fontSize: 11, fontWeight: '700', marginBottom: 5, marginTop: 8 },
  input: { height: 43, borderRadius: 11, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 11, color: colors.ink, fontSize: 13, outlineStyle: 'none' } as object,
  errorText: { color: colors.red, fontSize: 11, marginTop: 9 },
  formActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 9, marginTop: 17 },
  cancelButton: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 11, backgroundColor: colors.pale },
  cancelText: { color: colors.green, fontSize: 12, fontWeight: '700' },
  disclaimer: { color: colors.muted, fontSize: 10, textAlign: 'center', lineHeight: 15, marginTop: 21 },
});
