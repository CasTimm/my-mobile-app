import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

export type Dog = {
  id: string;
  name: string;
  breed: string;
  age: string;
};

type DogStore = {
  dogs: Dog[];
  addDog: (dog: Omit<Dog, 'id'>) => void;
  updateDog: (id: string, dog: Omit<Dog, 'id'>) => void;
  removeDog: (id: string) => void;
};

const memory = new Map<string, string>();
const storage: StateStorage = {
  getItem: (name) => typeof localStorage === 'undefined' ? memory.get(name) ?? null : localStorage.getItem(name),
  setItem: (name, value) => {
    if (typeof localStorage === 'undefined') memory.set(name, value);
    else localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof localStorage === 'undefined') memory.delete(name);
    else localStorage.removeItem(name);
  },
};

export const useDogStore = create<DogStore>()(persist(
  (set) => ({
    dogs: [],
    addDog: (dog) => set((state) => ({
      dogs: [...state.dogs, { ...dog, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }],
    })),
    updateDog: (id, dog) => set((state) => ({
      dogs: state.dogs.map((existing) => existing.id === id ? { ...dog, id } : existing),
    })),
    removeDog: (id) => set((state) => ({
      dogs: state.dogs.filter((dog) => dog.id !== id),
    })),
  }),
  {
    name: 'pootmaat-dogs',
    storage: createJSONStorage(() => storage),
    partialize: (state) => ({ dogs: state.dogs }),
  },
));
