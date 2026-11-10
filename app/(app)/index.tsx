import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { type Park } from '../../src/data/parks';
import { getParks } from '../../src/services/parkService';

const colors = {
  ink: '#20352a',
  muted: '#718076',
  green: '#28543d',
  pale: '#eef2e8',
  canvas: '#f8f8f3',
  line: '#e8ebe3',
  white: '#ffffff',
};

const filters = ['Alle weides', 'Rustig', 'Omheind'];

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [parks, setParks] = useState<Park[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadParks = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setParks(await getParks());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Onbekende fout bij het laden van de weides.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadParks();
  }, [loadParks]);

  const filteredParks = useMemo(() => parks.filter((park) => {
    const matchesQuery = `${park.name} ${park.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'Alle weides'
      || (activeFilter === 'Rustig' && park.crowd !== 'Druk')
      || (activeFilter === 'Omheind' && park.amenities.includes('Omheind'));
    return matchesQuery && matchesFilter;
  }), [activeFilter, parks, query]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <MaterialCommunityIcons name="paw" size={23} color={colors.white} />
          </View>
          <View>
            <Text style={styles.brandName}>pootmaat</Text>
            <Text style={styles.brandTagline}>samen op stap</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.locationPill}>
            <MaterialCommunityIcons name="map-marker" size={16} color={colors.green} />
            <Text style={styles.locationText}>Leuven</Text>
          </View>
          <Pressable
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
            accessibilityRole="button"
            accessibilityLabel="Mijn profiel en honden"
          >
            <MaterialCommunityIcons name="account" size={19} color={colors.green} />
            <Text style={styles.profileButtonText}>Profiel</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>VOOR JOU EN JE VIERVOETER</Text>
          <Text style={styles.heroTitle}>Op naar een{'\n'}leuke wandeling.</Text>
          <Text style={styles.heroSubtitle}>Ontdek fijne hondenweides en ontmoet andere baasjes.</Text>
        </View>
        <View style={styles.heroPaw}>
          <MaterialCommunityIcons name="paw" size={70} color="#dce8d6" />
        </View>
        <View style={styles.heroFooter}>
          <View style={styles.liveDot} />
          <Text style={styles.heroFooterText}>
            {isLoading ? 'Weides laden…' : `${parks.length} ${parks.length === 1 ? 'weide' : 'weides'} gevonden`}
          </Text>
          <MaterialCommunityIcons name="arrow-right" size={17} color={colors.white} />
        </View>
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={styles.sectionTitle}>Ontdek weides</Text>
          <Text style={styles.sectionSubtitle}>Een fijne plek is dichterbij dan je denkt.</Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countText}>{filteredParks.length} plekken</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={21} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Zoek op naam of buurt"
          placeholderTextColor="#99a39b"
          style={styles.searchInput}
          accessibilityLabel="Zoek op naam of buurt"
        />
        {query !== '' && (
          <Pressable onPress={() => setQuery('')} accessibilityLabel="Zoekopdracht wissen">
            <MaterialCommunityIcons name="close-circle" size={19} color={colors.muted} />
          </Pressable>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {filters.map((filter) => {
          const selected = filter === activeFilter;
          return (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[styles.filterChip, selected && styles.selectedFilter]}
              accessibilityRole="button"
              accessibilityState={{ selected }}
            >
              {filter === 'Rustig' && (
                <MaterialCommunityIcons name="leaf" size={15} color={selected ? colors.white : colors.green} />
              )}
              {filter === 'Omheind' && (
                <MaterialCommunityIcons name="fence" size={15} color={selected ? colors.white : colors.green} />
              )}
              <Text style={[styles.filterText, selected && styles.selectedFilterText]}>{filter}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.parkList}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Weides laden…</Text>
          </View>
        ) : loadError ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={34} color={colors.green} />
            <Text style={styles.emptyTitle}>Weides konden niet worden geladen</Text>
            <Text style={styles.emptySubtitle}>{loadError}</Text>
            <Pressable onPress={() => void loadParks()} style={styles.retryButton} accessibilityRole="button">
              <Text style={styles.retryText}>Opnieuw proberen</Text>
            </Pressable>
          </View>
        ) : filteredParks.length > 0 ? filteredParks.map((park) => (
          <Pressable
            key={park.id}
            style={styles.parkCard}
            onPress={() => router.push({ pathname: '/details/[id]', params: { id: park.id } })}
            accessibilityRole="button"
            accessibilityLabel={`Bekijk ${park.name}`}
          >
            <View style={[styles.parkArtwork, { backgroundColor: park.artworkColor }]}>
              <View style={styles.artworkBadge}>
                <MaterialCommunityIcons name="paw" size={13} color={colors.green} />
                <Text style={styles.artworkBadgeText}>{park.crowd}</Text>
              </View>
              <MaterialCommunityIcons name={park.icon} size={48} color={park.iconColor} />
              <View style={styles.artworkGround} />
            </View>
            <View style={styles.parkInfo}>
              <View style={styles.parkTitleRow}>
                <Text style={styles.parkName}>{park.name}</Text>
                <View style={styles.rating}>
                  <MaterialCommunityIcons name="star" size={15} color="#d99537" />
                  <Text style={styles.ratingText}>{park.rating}</Text>
                </View>
              </View>
              <View style={styles.addressRow}>
                <MaterialCommunityIcons name="map-marker-outline" size={15} color={colors.muted} />
                <Text style={styles.address}>{park.location} · {park.distance}</Text>
              </View>
              <View style={styles.amenityRow}>
                {park.amenities.slice(0, 2).map((amenity) => (
                  <Text key={amenity} style={styles.amenity}>{amenity}</Text>
                ))}
                <View style={styles.matchCount}>
                  <MaterialCommunityIcons name="account-group-outline" size={14} color={colors.green} />
                  <Text style={styles.matchText}>{park.dogs.length} honden</Text>
                </View>
              </View>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color="#a6afa7" />
          </Pressable>
        )) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="map-search-outline" size={34} color={colors.green} />
            <Text style={styles.emptyTitle}>Geen weides gevonden</Text>
            <Text style={styles.emptySubtitle}>Pas je zoekopdracht of filters aan.</Text>
          </View>
        )}
      </View>

      <Text style={styles.footerNote}>Gemaakt voor kwispelende staarten 🐾</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.canvas },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 38 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, paddingBottom: 22 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileButton: { height: 39, borderRadius: 14, backgroundColor: colors.pale, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 5, paddingHorizontal: 10 },
  profileButtonText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: { width: 42, height: 42, borderRadius: 15, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: colors.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  brandTagline: { color: colors.muted, fontSize: 11, marginTop: 1 },
  locationPill: { backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.line },
  locationText: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  hero: { minHeight: 208, backgroundColor: colors.green, borderRadius: 24, padding: 22, overflow: 'hidden', justifyContent: 'space-between' },
  heroCopy: { maxWidth: 340, zIndex: 1 },
  eyebrow: { color: '#c5d8c6', fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginBottom: 8 },
  heroTitle: { color: colors.white, fontSize: 29, fontWeight: '800', lineHeight: 34, letterSpacing: -0.7 },
  heroSubtitle: { color: '#dce8dc', fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 280 },
  heroPaw: { position: 'absolute', right: 12, top: 26, opacity: 0.8, transform: [{ rotate: '-18deg' }] },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  liveDot: { width: 7, height: 7, backgroundColor: '#b5db9d', borderRadius: 4 },
  heroFooterText: { color: colors.white, fontSize: 12, fontWeight: '600', flex: 1 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 15 },
  sectionTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
  sectionSubtitle: { color: colors.muted, fontSize: 12, marginTop: 4 },
  countPill: { backgroundColor: colors.pale, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 7 },
  countText: { color: colors.green, fontWeight: '700', fontSize: 11 },
  searchBox: { height: 49, borderRadius: 15, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontSize: 14, color: colors.ink, outlineStyle: 'none' } as object,
  filters: { gap: 8, paddingTop: 13, paddingBottom: 3 },
  filterChip: { height: 34, borderRadius: 18, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1 },
  selectedFilter: { backgroundColor: colors.green, borderColor: colors.green },
  filterText: { color: colors.ink, fontSize: 12, fontWeight: '600' },
  selectedFilterText: { color: colors.white },
  parkList: { gap: 12, marginTop: 15 },
  parkCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 19, borderWidth: 1, borderColor: colors.line, padding: 10, gap: 12 },
  parkArtwork: { width: 83, height: 91, borderRadius: 13, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  artworkBadge: { position: 'absolute', top: 7, left: 6, zIndex: 1, flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#ffffffeb', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 3 },
  artworkBadgeText: { color: colors.green, fontSize: 8, fontWeight: '700' },
  artworkGround: { position: 'absolute', width: 94, height: 30, borderRadius: 50, bottom: -19, backgroundColor: '#ffffff52' },
  parkInfo: { flex: 1, minWidth: 0 },
  parkTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  parkName: { color: colors.ink, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 },
  address: { color: colors.muted, fontSize: 11, flexShrink: 1 },
  amenityRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 9, flexWrap: 'wrap' },
  amenity: { color: colors.green, backgroundColor: colors.pale, overflow: 'hidden', borderRadius: 7, paddingHorizontal: 6, paddingVertical: 4, fontSize: 9, fontWeight: '600' },
  matchCount: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 'auto' },
  matchText: { color: colors.green, fontSize: 10, fontWeight: '600' },
  emptyState: { backgroundColor: colors.white, alignItems: 'center', borderRadius: 18, padding: 24, gap: 8 },
  emptyTitle: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  emptySubtitle: { color: colors.muted, fontSize: 12 },
  retryButton: { backgroundColor: colors.green, borderRadius: 11, paddingHorizontal: 13, paddingVertical: 9, marginTop: 4 },
  retryText: { color: colors.white, fontSize: 11, fontWeight: '700' },
  footerNote: { color: colors.muted, textAlign: 'center', fontSize: 11, marginTop: 25 },
});