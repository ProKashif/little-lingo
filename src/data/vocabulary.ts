import type { CategoryId, VocabularyItem } from '@/types';

/**
 * The single vocabulary database. Screens never hard-code words: they look items
 * up here and pick the translation for the active language.
 *
 * Portuguese is European Portuguese (pt-PT): autocarro, comboio, bebé, mamã, papá.
 */
const animals: VocabularyItem[] = [
  {
    id: 'dog',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐶' },
    translations: { en: 'Dog', pt: 'Cão', fr: 'Chien' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'dog', text: { en: 'Woof woof!', pt: 'Ão ão!', fr: 'Ouaf ouaf !' } },
  },
  {
    id: 'cat',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐱' },
    translations: { en: 'Cat', pt: 'Gato', fr: 'Chat' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'cat', text: { en: 'Meow!', pt: 'Miau!', fr: 'Miaou !' } },
  },
  {
    id: 'bird',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐦' },
    translations: { en: 'Bird', pt: 'Pássaro', fr: 'Oiseau' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'bird', text: { en: 'Tweet tweet!', pt: 'Piu piu!', fr: 'Cui-cui !' } },
  },
  {
    id: 'fish',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐟' },
    translations: { en: 'Fish', pt: 'Peixe', fr: 'Poisson' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'fish', text: { en: 'Blub blub!', pt: 'Blub blub!', fr: 'Bloup bloup !' } },
  },
  {
    id: 'horse',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐴' },
    translations: { en: 'Horse', pt: 'Cavalo', fr: 'Cheval' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'horse', text: { en: 'Neigh!', pt: 'Iiiih!', fr: 'Hiii !' } },
  },
  {
    id: 'cow',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐮' },
    translations: { en: 'Cow', pt: 'Vaca', fr: 'Vache' },
    gender: { pt: 'f', fr: 'f' },
    sound: { id: 'cow', text: { en: 'Moo!', pt: 'Muuu!', fr: 'Meuh !' } },
  },
  {
    id: 'lion',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🦁' },
    translations: { en: 'Lion', pt: 'Leão', fr: 'Lion' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'lion', text: { en: 'Roar!', pt: 'Grrr!', fr: 'Grrr !' } },
  },
  {
    id: 'elephant',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐘' },
    translations: { en: 'Elephant', pt: 'Elefante', fr: 'Éléphant' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'elephant', text: { en: 'Toot!', pt: 'Pruuu!', fr: 'Pouêt !' } },
  },
  {
    id: 'monkey',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐵' },
    translations: { en: 'Monkey', pt: 'Macaco', fr: 'Singe' },
    gender: { pt: 'm', fr: 'm' },
    sound: {
      id: 'monkey',
      text: { en: 'Ooh ooh ah ah!', pt: 'Uh uh ah ah!', fr: 'Hou hou ha ha !' },
    },
  },
  {
    id: 'rabbit',
    category: 'animals',
    illustration: { kind: 'emoji', value: '🐰' },
    translations: { en: 'Rabbit', pt: 'Coelho', fr: 'Lapin' },
    gender: { pt: 'm', fr: 'm' },
  },
];

const food: VocabularyItem[] = [
  {
    id: 'apple',
    category: 'food',
    illustration: { kind: 'emoji', value: '🍎' },
    translations: { en: 'Apple', pt: 'Maçã', fr: 'Pomme' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'banana',
    category: 'food',
    illustration: { kind: 'emoji', value: '🍌' },
    translations: { en: 'Banana', pt: 'Banana', fr: 'Banane' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'orange-fruit',
    category: 'food',
    illustration: { kind: 'emoji', value: '🍊' },
    translations: { en: 'Orange', pt: 'Laranja', fr: 'Orange' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'milk',
    category: 'food',
    illustration: { kind: 'emoji', value: '🥛' },
    translations: { en: 'Milk', pt: 'Leite', fr: 'Lait' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'water',
    category: 'food',
    illustration: { kind: 'emoji', value: '💧' },
    translations: { en: 'Water', pt: 'Água', fr: 'Eau' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'bread',
    category: 'food',
    illustration: { kind: 'emoji', value: '🍞' },
    translations: { en: 'Bread', pt: 'Pão', fr: 'Pain' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'egg',
    category: 'food',
    illustration: { kind: 'emoji', value: '🥚' },
    translations: { en: 'Egg', pt: 'Ovo', fr: 'Œuf' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'cheese',
    category: 'food',
    illustration: { kind: 'emoji', value: '🧀' },
    translations: { en: 'Cheese', pt: 'Queijo', fr: 'Fromage' },
    gender: { pt: 'm', fr: 'm' },
  },
];

const colors: VocabularyItem[] = [
  { id: 'red', hex: '#E53935', en: 'Red', pt: 'Vermelho', fr: 'Rouge' },
  { id: 'blue', hex: '#1E88E5', en: 'Blue', pt: 'Azul', fr: 'Bleu' },
  { id: 'green', hex: '#43A047', en: 'Green', pt: 'Verde', fr: 'Vert' },
  { id: 'yellow', hex: '#FDD835', en: 'Yellow', pt: 'Amarelo', fr: 'Jaune' },
  { id: 'orange', hex: '#FB8C00', en: 'Orange', pt: 'Cor de laranja', fr: 'Orange' },
  { id: 'pink', hex: '#F06292', en: 'Pink', pt: 'Cor-de-rosa', fr: 'Rose' },
  { id: 'purple', hex: '#8E24AA', en: 'Purple', pt: 'Roxo', fr: 'Violet' },
  { id: 'black', hex: '#212121', en: 'Black', pt: 'Preto', fr: 'Noir' },
  { id: 'white', hex: '#FFFFFF', en: 'White', pt: 'Branco', fr: 'Blanc', border: true },
].map(({ id, hex, border, en, pt, fr }) => ({
  id,
  category: 'colors' as const,
  illustration: { kind: 'color' as const, hex, border },
  translations: { en, pt, fr },
}));

const NUMBER_EMOJI = ['🍎', '🦆', '🐞', '🍓', '⭐', '🐟', '🎈', '🌸', '🍪', '🐣'];

const numbers: VocabularyItem[] = [
  ['one', 'One', 'Um', 'Un'],
  ['two', 'Two', 'Dois', 'Deux'],
  ['three', 'Three', 'Três', 'Trois'],
  ['four', 'Four', 'Quatro', 'Quatre'],
  ['five', 'Five', 'Cinco', 'Cinq'],
  ['six', 'Six', 'Seis', 'Six'],
  ['seven', 'Seven', 'Sete', 'Sept'],
  ['eight', 'Eight', 'Oito', 'Huit'],
  ['nine', 'Nine', 'Nove', 'Neuf'],
  ['ten', 'Ten', 'Dez', 'Dix'],
].map(([id = '', en = '', pt = '', fr = ''], index) => ({
  id,
  category: 'numbers' as const,
  illustration: { kind: 'number' as const, value: index + 1, emoji: NUMBER_EMOJI[index] ?? '⭐' },
  translations: { en, pt, fr },
}));

/** Letters read the same in every language; only the pronunciation differs. */
const alphabet: VocabularyItem[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({
  id: `letter-${letter.toLowerCase()}`,
  category: 'alphabet' as const,
  illustration: { kind: 'letter' as const, value: letter },
  translations: { en: letter, pt: letter, fr: letter },
}));

const family: VocabularyItem[] = [
  {
    id: 'mom',
    category: 'family',
    illustration: { kind: 'emoji', value: '👩' },
    translations: { en: 'Mum', pt: 'Mamã', fr: 'Maman' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'dad',
    category: 'family',
    illustration: { kind: 'emoji', value: '👨' },
    translations: { en: 'Dad', pt: 'Papá', fr: 'Papa' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'baby',
    category: 'family',
    illustration: { kind: 'emoji', value: '👶' },
    translations: { en: 'Baby', pt: 'Bebé', fr: 'Bébé' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'brother',
    category: 'family',
    illustration: { kind: 'emoji', value: '👦' },
    translations: { en: 'Brother', pt: 'Irmão', fr: 'Frère' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'sister',
    category: 'family',
    illustration: { kind: 'emoji', value: '👧' },
    translations: { en: 'Sister', pt: 'Irmã', fr: 'Sœur' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'grandma',
    category: 'family',
    illustration: { kind: 'emoji', value: '👵' },
    translations: { en: 'Grandma', pt: 'Avó', fr: 'Mamie' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'grandpa',
    category: 'family',
    illustration: { kind: 'emoji', value: '👴' },
    translations: { en: 'Grandpa', pt: 'Avô', fr: 'Papi' },
    gender: { pt: 'm', fr: 'm' },
  },
];

const vehicles: VocabularyItem[] = [
  {
    id: 'car',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '🚗' },
    translations: { en: 'Car', pt: 'Carro', fr: 'Voiture' },
    gender: { pt: 'm', fr: 'f' },
    sound: { id: 'car', text: { en: 'Beep beep!', pt: 'Pi pi!', fr: 'Tut tut !' } },
  },
  {
    id: 'bus',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '🚌' },
    translations: { en: 'Bus', pt: 'Autocarro', fr: 'Bus' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'train',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '🚂' },
    translations: { en: 'Train', pt: 'Comboio', fr: 'Train' },
    gender: { pt: 'm', fr: 'm' },
    sound: {
      id: 'train',
      text: { en: 'Choo choo!', pt: 'Pouca terra, pouca terra!', fr: 'Tchou tchou !' },
    },
  },
  {
    id: 'airplane',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '✈️' },
    translations: { en: 'Aeroplane', pt: 'Avião', fr: 'Avion' },
    gender: { pt: 'm', fr: 'm' },
    sound: { id: 'airplane', text: { en: 'Zoom!', pt: 'Vruuum!', fr: 'Vroum !' } },
  },
  {
    id: 'bicycle',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '🚲' },
    translations: { en: 'Bicycle', pt: 'Bicicleta', fr: 'Vélo' },
    gender: { pt: 'f', fr: 'm' },
    sound: { id: 'bicycle', text: { en: 'Ring ring!', pt: 'Trim trim!', fr: 'Dring dring !' } },
  },
  {
    id: 'boat',
    category: 'vehicles',
    illustration: { kind: 'emoji', value: '⛵' },
    translations: { en: 'Boat', pt: 'Barco', fr: 'Bateau' },
    gender: { pt: 'm', fr: 'm' },
  },
];

const objects: VocabularyItem[] = [
  {
    id: 'ball',
    category: 'objects',
    illustration: { kind: 'emoji', value: '⚽' },
    translations: { en: 'Ball', pt: 'Bola', fr: 'Ballon' },
    gender: { pt: 'f', fr: 'm' },
  },
  {
    id: 'book',
    category: 'objects',
    illustration: { kind: 'emoji', value: '📖' },
    translations: { en: 'Book', pt: 'Livro', fr: 'Livre' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'chair',
    category: 'objects',
    illustration: { kind: 'emoji', value: '🪑' },
    translations: { en: 'Chair', pt: 'Cadeira', fr: 'Chaise' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'table',
    category: 'objects',
    illustration: { kind: 'emoji', value: '🍽️' },
    translations: { en: 'Table', pt: 'Mesa', fr: 'Table' },
    gender: { pt: 'f', fr: 'f' },
  },
  {
    id: 'bed',
    category: 'objects',
    illustration: { kind: 'emoji', value: '🛏️' },
    translations: { en: 'Bed', pt: 'Cama', fr: 'Lit' },
    gender: { pt: 'f', fr: 'm' },
  },
  {
    id: 'shoe',
    category: 'objects',
    illustration: { kind: 'emoji', value: '👟' },
    translations: { en: 'Shoe', pt: 'Sapato', fr: 'Chaussure' },
    gender: { pt: 'm', fr: 'f' },
  },
  {
    id: 'cup',
    category: 'objects',
    illustration: { kind: 'emoji', value: '🥤' },
    translations: { en: 'Cup', pt: 'Copo', fr: 'Gobelet' },
    gender: { pt: 'm', fr: 'm' },
  },
  {
    id: 'spoon',
    category: 'objects',
    illustration: { kind: 'emoji', value: '🥄' },
    translations: { en: 'Spoon', pt: 'Colher', fr: 'Cuillère' },
    gender: { pt: 'f', fr: 'f' },
  },
];

export const VOCABULARY: readonly VocabularyItem[] = [
  ...animals,
  ...food,
  ...colors,
  ...numbers,
  ...alphabet,
  ...family,
  ...vehicles,
  ...objects,
];

const itemsById = new Map(VOCABULARY.map((item) => [item.id, item]));

const itemsByCategory = VOCABULARY.reduce<Partial<Record<CategoryId, VocabularyItem[]>>>(
  (groups, item) => {
    (groups[item.category] ??= []).push(item);
    return groups;
  },
  {},
);

export function getItem(id: string): VocabularyItem | undefined {
  return itemsById.get(id);
}

export function getItemsByCategory(category: CategoryId): readonly VocabularyItem[] {
  return itemsByCategory[category] ?? [];
}
