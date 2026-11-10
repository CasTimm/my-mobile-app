import { parks as demoParks, type Park } from '../data/parks';
import { getSupabaseClient } from './supabaseClient';

type ParkRow = {
  id: string;
  name: string;
  location: string;
  rating: number | null;
  crowd: string | null;
  amenities: string[];
  description: string | null;
};

function toPark(row: ParkRow): Park {
  const demoPark = demoParks.find((park) => park.id === row.id);
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    distance: demoPark?.distance ?? '—',
    rating: row.rating === null ? '—' : row.rating.toFixed(1).replace('.', ','),
    crowd: row.crowd ?? 'Onbekend',
    amenities: row.amenities,
    description: row.description ?? '',
    artworkColor: demoPark?.artworkColor ?? '#dcebd4',
    iconColor: demoPark?.iconColor ?? '#588565',
    icon: demoPark?.icon ?? 'tree',
    dogs: demoPark?.dogs ?? [],
  };
}

export async function getParks(): Promise<Park[]> {
  const { data, error } = await getSupabaseClient()
    .from('parks')
    .select('id, name, location, rating, crowd, amenities, description')
    .order('name');

  if (error) {
    throw new Error(`Could not load parks from Supabase: ${error.message}`);
  }

  return data.map(toPark);
}

export async function getParkById(id: string): Promise<Park | null> {
  const { data, error } = await getSupabaseClient()
    .from('parks')
    .select('id, name, location, rating, crowd, amenities, description')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not load park from Supabase: ${error.message}`);
  }

  return data ? toPark(data) : null;
}
