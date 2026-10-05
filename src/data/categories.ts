import type { Category, CategoryId } from '@/types';

export const CATEGORIES: readonly Category[] = [
  {
    id: 'animals',
    emoji: '🐶',
    name: { en: 'Animals', pt: 'Animais', fr: 'Animaux' },
    color: '#FFE1CF',
    accent: '#F07A3E',
  },
  {
    id: 'food',
    emoji: '🍎',
    name: { en: 'Food', pt: 'Comida', fr: 'Nourriture' },
    color: '#FFDDE6',
    accent: '#D9506F',
  },
  {
    id: 'colors',
    emoji: '🎨',
    name: { en: 'Colours', pt: 'Cores', fr: 'Couleurs' },
    color: '#E7DEFF',
    accent: '#7B5CE0',
  },
  {
    id: 'numbers',
    emoji: '🔢',
    name: { en: 'Numbers', pt: 'Números', fr: 'Chiffres' },
    color: '#D6ECFF',
    accent: '#3E8EDE',
  },
  {
    id: 'alphabet',
    emoji: '🔤',
    name: { en: 'Alphabet', pt: 'Alfabeto', fr: 'Alphabet' },
    color: '#FFF3C4',
    accent: '#C99A06',
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    name: { en: 'Family', pt: 'Família', fr: 'Famille' },
    color: '#D4F5E4',
    accent: '#2E9E6A',
  },
  {
    id: 'vehicles',
    emoji: '🚗',
    name: { en: 'Vehicles', pt: 'Veículos', fr: 'Véhicules' },
    color: '#D2F3F4',
    accent: '#1F9AA0',
  },
  {
    id: 'objects',
    emoji: '🏠',
    name: { en: 'Everyday Things', pt: 'Coisas de Casa', fr: 'Objets du quotidien' },
    color: '#F4E7D7',
    accent: '#A9743F',
  },
];

const byId = new Map(CATEGORIES.map((category) => [category.id, category]));

export function getCategory(id: string): Category | undefined {
  return byId.get(id as CategoryId);
}
