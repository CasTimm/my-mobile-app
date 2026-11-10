export type Park = {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: string;
  crowd: string;
  amenities: string[];
  description: string;
  artworkColor: string;
  iconColor: string;
  icon: 'tree' | 'pine-tree' | 'flower';
  dogs: { name: string; breed: string; owner: string; icon: 'dog' | 'dog-side' }[];
};

export const parks: Park[] = [
  {
    id: 'abdij-van-park',
    name: 'Hondenweide Abdij van Park',
    location: 'Heverlee',
    distance: '1,2 km',
    rating: '4,8',
    crowd: 'Gezellig',
    amenities: ['Omheind', 'Water'],
    description: 'Een groene, omheinde weide vlak bij de abdij. Ideaal voor een ontspannen speeldate met schaduwrijke plekjes.',
    artworkColor: '#dcebd4',
    iconColor: '#588565',
    icon: 'tree',
    dogs: [
      { name: 'Luna', breed: 'Labrador', owner: 'Emma', icon: 'dog' },
      { name: 'Milo', breed: 'Bordercollie', owner: 'Thomas', icon: 'dog-side' },
      { name: 'Nala', breed: 'Golden retriever', owner: 'Sarah', icon: 'dog' },
    ],
  },
  {
    id: 'kessel-lo',
    name: 'Provinciedomein Kessel-Lo',
    location: 'Kessel-Lo',
    distance: '2,5 km',
    rating: '4,6',
    crowd: 'Rustig',
    amenities: ['Omheind', 'Parkeren'],
    description: 'Een ruime speelplek aan de rand van het park, met bankjes voor baasjes en genoeg plaats voor een spelletje.',
    artworkColor: '#e5ead5',
    iconColor: '#77935b',
    icon: 'pine-tree',
    dogs: [
      { name: 'Pippa', breed: 'Beagle', owner: 'Noor', icon: 'dog' },
      { name: 'Max', breed: 'Corgi', owner: 'Jules', icon: 'dog-side' },
    ],
  },
  {
    id: 'broekstraat',
    name: 'Weide aan de Broekstraat',
    location: 'Leuven centrum',
    distance: '3,1 km',
    rating: '4,4',
    crowd: 'Druk',
    amenities: ['Water', 'Bankjes'],
    description: 'Een gezellige ontmoetingsplek met drinkwater en bankjes. Vooral populair na de werkuren.',
    artworkColor: '#f1e4ce',
    iconColor: '#b78c58',
    icon: 'flower',
    dogs: [
      { name: 'Charlie', breed: 'Teckel', owner: 'Lotte', icon: 'dog' },
      { name: 'Bo', breed: 'Shiba inu', owner: 'Arno', icon: 'dog-side' },
      { name: 'Puck', breed: 'Poedel', owner: 'Mila', icon: 'dog' },
      { name: 'Lou', breed: 'Whippet', owner: 'Bram', icon: 'dog-side' },
    ],
  },
];
