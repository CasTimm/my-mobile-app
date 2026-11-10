import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { parks, type Park } from '../../../src/data/parks';
import { getParkById } from '../../../src/services/parkService';
import { useDogStore } from '../../../src/state/useDogStore';

export function generateStaticParams() {
  return parks.map(({ id }) => ({ id }));
}

const colors = {
  ink: '#20352a',
  muted: '#718076',
  green: '#28543d',
  pale: '#eef2e8',
  canvas: '#f8f8f3',
  line: '#e8ebe3',
  white: '#ffffff',
};

export default function ParkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isJoining, setIsJoining] = useState(false);
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const [park, setPark] = useState<Park | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const dogs = useDogStore((state) => state.dogs);

  useEffect(() => {
    let isCurrentRequest = true;
    setIsLoading(true);
    setLoadError(null);
    getParkById(id)
      .then((result) => {
        if (isCurrentRequest) setPark(result);
      })
      .catch((error: unknown) => {
        if (isCurrentRequest) {
          setLoadError(error instanceof Error ? error.message : 'Onbekende fout bij het laden van de weide.');
        }
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [id, loadAttempt]);

  if (isLoading) {
    return (
      <View style={styles.page}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Weide laden…</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.page}>
        <View style={styles.notFound}>
          <MaterialCommunityIcons name="alert-circle-outline" size={42} color={colors.green} />
          <Text style={styles.notFoundTitle}>Weide kon niet worden geladen</Text>
          <Text style={styles.notFoundText}>{loadError}</Text>
          <Pressable style={styles.backButton} onPress={() => setLoadAttempt((attempt) => attempt + 1)}>
            <Text style={styles.backButtonText}>Opnieuw proberen</Text>
          </Pressable>
          <Pressable onPress={() => router.replace('/')} style={styles.backLink}>
            <Text style={styles.backText}>Terug naar het overzicht</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!park) {
    return (
      <View style={styles.page}>
        <View style={styles.notFound}>
          <MaterialCommunityIcons name="map-marker-question-outline" size={42} color={colors.green} />
          <Text style={styles.notFoundTitle}>Weide niet gevonden</Text>
          <Text style={styles.notFoundText}>Deze plek staat niet in ons overzicht.</Text>
          <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
            <Text style={styles.backButtonText}>Terug naar het overzicht</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Pressable onPress={() => router.back()} style={styles.backLink} accessibilityRole="button">
        <MaterialCommunityIcons name="arrow-left" size={19} color={colors.green} />
        <Text style={styles.backText}>Alle weides</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/profile')}
        style={styles.profileLink}
        accessibilityRole="button"
        accessibilityLabel="Beheer mijn honden"
      >
        <MaterialCommunityIcons name="account" size={17} color={colors.green} />
        <Text style={styles.profileLinkText}>Mijn honden</Text>
      </Pressable>

      <View style={[styles.hero, { backgroundColor: park.artworkColor }]}>
        <View style={styles.rating}>
          <MaterialCommunityIcons name="star" size={16} color="#d99537" />
          <Text style={styles.ratingText}>{park.rating}</Text>
          <Text style={styles.reviewText}>· buurtfavoriet</Text>
        </View>
        <MaterialCommunityIcons name={park.icon} size={100} color={park.iconColor} />
        <View style={styles.heroGround} />
        <View style={styles.heroPaw}>
          <MaterialCommunityIcons name="paw" size={26} color={colors.green} />
        </View>
      </View>

      <View style={styles.titleBlock}>
        <Text style={styles.parkTitle}>{park.name}</Text>
        <View style={styles.addressRow}>
          <MaterialCommunityIcons name="map-marker-outline" size={17} color={colors.muted} />
          <Text style={styles.address}>{park.location} · {park.distance} van jou</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <MaterialCommunityIcons name="account-group-outline" size={21} color={colors.green} />
        </View>
        <View style={styles.statusCopy}>
          <Text style={styles.statusTitle}>{park.dogs.length} honden zijn er nu</Text>
          <Text style={styles.statusSubtitle}>Kom erbij voor een spontane speeldate.</Text>
        </View>
        <View style={styles.statusPill}>
          <View style={styles.statusDot} />
          <Text style={styles.statusPillText}>{park.crowd}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Met welke hond(en) kom je?</Text>
      <Text style={styles.selectionHint}>Selecteer de honden die je meeneemt naar deze weide.</Text>
      {dogs.length > 0 ? (
        <View style={styles.ownDogList}>
          {dogs.map((dog) => {
            const selected = selectedDogIds.includes(dog.id);
            return (
              <Pressable
                key={dog.id}
                onPress={() => {
                  setSelectedDogIds((current) => selected
                    ? current.filter((dogId) => dogId !== dog.id)
                    : [...current, dog.id]);
                  setIsJoining(false);
                }}
                style={[styles.ownDogRow, selected && styles.selectedOwnDog]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
              >
                <View style={styles.ownDogAvatar}>
                  <MaterialCommunityIcons name="dog-side" size={21} color={colors.green} />
                </View>
                <View style={styles.ownDogInfo}>
                  <Text style={styles.ownDogName}>{dog.name}</Text>
                  <Text style={styles.ownDogBreed}>{dog.breed}{dog.age ? ` · ${dog.age} jaar` : ''}</Text>
                </View>
                <MaterialCommunityIcons
                  name={selected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={22}
                  color={selected ? colors.green : '#a6afa7'}
                />
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={styles.noDogsCard}>
          <MaterialCommunityIcons name="dog-side" size={25} color={colors.green} />
          <View style={styles.noDogsCopy}>
            <Text style={styles.noDogsTitle}>Voeg eerst je hond toe</Text>
            <Text style={styles.noDogsText}>Maak een hondenprofiel aan om je in te schrijven.</Text>
          </View>
          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Hond toevoegen"
          >
            <MaterialCommunityIcons name="arrow-right" size={20} color={colors.green} />
          </Pressable>
        </View>
      )}

      <Pressable
        disabled={selectedDogIds.length === 0}
        onPress={() => setIsJoining((joined) => !joined)}
        style={[styles.joinButton, isJoining && styles.joinedButton, selectedDogIds.length === 0 && styles.disabledJoinButton]}
        accessibilityRole="button"
        accessibilityState={{ selected: isJoining, disabled: selectedDogIds.length === 0 }}
      >
        <MaterialCommunityIcons name={isJoining ? 'check-circle-outline' : 'paw'} size={19} color={colors.white} />
        <Text style={styles.joinButtonText}>
          {isJoining ? 'Inschrijving annuleren' : selectedDogIds.length > 0
            ? `Inschrijven met ${selectedDogIds.length} ${selectedDogIds.length === 1 ? 'hond' : 'honden'}`
            : 'Kies eerst je hond(en)'}
        </Text>
      </Pressable>
      {isJoining && (
        <Text style={styles.joinedNote}>
          {`Je hebt ${selectedDogIds.map((dogId) => dogs.find((dog) => dog.id === dogId)?.name).filter(Boolean).join(' en ')} ingeschreven voor deze speeldate.`}
        </Text>
      )}

      <Text style={styles.sectionTitle}>Wie is er al?</Text>
      <View style={styles.dogList}>
        {park.dogs.map((dog, index) => (
          <View key={dog.name} style={[styles.dogRow, index === park.dogs.length - 1 && styles.lastDogRow]}>
            <View style={[styles.dogAvatar, { backgroundColor: ['#f4e3cc', '#dcebd4', '#eee2ee', '#dce8ef'][index % 4] }]}>
              <MaterialCommunityIcons name={dog.icon} size={23} color={colors.green} />
            </View>
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>{dog.name}</Text>
              <Text style={styles.dogBreed}>{dog.breed} · baasje {dog.owner}</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Over deze weide</Text>
      <Text style={styles.description}>{park.description}</Text>
      <View style={styles.amenities}>
        {park.amenities.map((amenity) => (
          <View key={amenity} style={styles.amenityPill}>
            <MaterialCommunityIcons
              name={amenity === 'Omheind' ? 'fence' : amenity === 'Water' ? 'water' : 'chair-rolling'}
              size={16}
              color={colors.green}
            />
            <Text style={styles.amenityText}>{amenity}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.disclaimer}>Aanwezigheid en inschrijvingen worden niet online opgeslagen.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { width: '100%', maxWidth: 700, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 38 },
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingTop: 19, paddingBottom: 14 },
  backText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  profileLink: { position: 'absolute', right: 22, top: 16, flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 13, backgroundColor: colors.pale },
  profileLinkText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  hero: { height: 182, borderRadius: 23, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  rating: { position: 'absolute', top: 13, left: 13, zIndex: 2, backgroundColor: colors.white, borderRadius: 13, paddingHorizontal: 9, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  reviewText: { color: colors.muted, fontSize: 10 },
  heroGround: { position: 'absolute', bottom: -39, width: '115%', height: 75, borderRadius: 100, backgroundColor: '#ffffff59' },
  heroPaw: { position: 'absolute', right: 18, bottom: 17, width: 46, height: 46, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffffb8', borderRadius: 17 },
  titleBlock: { marginTop: 20, marginBottom: 17 },
  parkTitle: { color: colors.ink, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 7 },
  address: { color: colors.muted, fontSize: 12 },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 17, padding: 13, marginBottom: 24 },
  statusIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  statusCopy: { flex: 1 },
  statusTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  statusSubtitle: { color: colors.muted, fontSize: 10, marginTop: 3 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 12, backgroundColor: colors.pale, paddingHorizontal: 8, paddingVertical: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 4, backgroundColor: '#83a968' },
  statusPillText: { color: colors.green, fontSize: 9, fontWeight: '700' },
  sectionTitle: { color: colors.ink, fontSize: 16, fontWeight: '800', marginBottom: 11 },
  dogList: { backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13, marginBottom: 22 },
  dogRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.line },
  lastDogRow: { borderBottomWidth: 0 },
  dogAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  dogInfo: { flex: 1 },
  dogName: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  dogBreed: { color: colors.muted, fontSize: 10, marginTop: 3 },
  onlineDot: { width: 8, height: 8, borderRadius: 5, backgroundColor: '#83b26a', marginRight: 4 },
  description: { color: colors.muted, fontSize: 12, lineHeight: 19, marginBottom: 13 },
  amenities: { flexDirection: 'row', gap: 8, marginBottom: 23 },
  amenityPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.pale, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  amenityText: { color: colors.green, fontSize: 11, fontWeight: '600' },
  selectionHint: { color: colors.muted, fontSize: 11, marginTop: -4, marginBottom: 10 },
  ownDogList: { backgroundColor: colors.white, borderRadius: 17, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 12, marginBottom: 15 },
  ownDogRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  selectedOwnDog: { backgroundColor: '#f5f8f2' },
  ownDogAvatar: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center' },
  ownDogInfo: { flex: 1 },
  ownDogName: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  ownDogBreed: { color: colors.muted, fontSize: 10, marginTop: 2 },
  noDogsCard: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.white, borderRadius: 16, padding: 13, borderWidth: 1, borderColor: colors.line, marginBottom: 15 },
  noDogsCopy: { flex: 1 },
  noDogsTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  noDogsText: { color: colors.muted, fontSize: 10, marginTop: 3 },
  joinButton: { backgroundColor: colors.green, borderRadius: 15, height: 51, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  joinedButton: { backgroundColor: '#527657' },
  disabledJoinButton: { backgroundColor: '#aeb8ad' },
  joinButtonText: { color: colors.white, fontSize: 14, fontWeight: '700' },
  joinedNote: { color: colors.green, fontSize: 11, lineHeight: 16, textAlign: 'center', marginTop: 9 },
  disclaimer: { color: colors.muted, textAlign: 'center', fontSize: 10, marginTop: 11 },
  notFound: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 9, padding: 28 },
  notFoundTitle: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  notFoundText: { color: colors.muted, fontSize: 13 },
  backButton: { backgroundColor: colors.green, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 15, marginTop: 5 },
  backButtonText: { color: colors.white, fontSize: 12, fontWeight: '700' },
});
