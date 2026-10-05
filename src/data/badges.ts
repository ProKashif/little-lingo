import type { Badge, CategoryId, Progress } from '@/types';

const completed = (category: CategoryId) => (progress: Progress) =>
  progress.completedCategories.includes(category);

export const BADGES: readonly Badge[] = [
  {
    id: 'first-word',
    emoji: '🌟',
    name: { en: 'First Word', pt: 'Primeira Palavra', fr: 'Premier mot' },
    isEarned: (progress) => progress.learnedItems.length >= 1,
  },
  {
    id: 'animal-explorer',
    emoji: '🐶',
    name: { en: 'Animal Explorer', pt: 'Explorador de Animais', fr: 'Explorateur des animaux' },
    isEarned: completed('animals'),
  },
  {
    id: 'color-explorer',
    emoji: '🎨',
    name: { en: 'Colour Explorer', pt: 'Explorador de Cores', fr: 'Explorateur des couleurs' },
    isEarned: completed('colors'),
  },
  {
    id: 'number-star',
    emoji: '🔢',
    name: { en: 'Number Star', pt: 'Estrela dos Números', fr: 'Star des chiffres' },
    isEarned: completed('numbers'),
  },
  {
    id: 'vehicle-explorer',
    emoji: '🚗',
    name: { en: 'Vehicle Explorer', pt: 'Explorador de Veículos', fr: 'Explorateur des véhicules' },
    isEarned: completed('vehicles'),
  },
  {
    id: 'sharp-eyes',
    emoji: '🎯',
    name: { en: 'Sharp Eyes', pt: 'Olho de Lince', fr: 'Œil de lynx' },
    isEarned: (progress) => progress.gameCorrectAnswers >= 10,
  },
  {
    id: 'super-learner',
    emoji: '🏆',
    name: { en: 'Super Learner', pt: 'Super Aprendiz', fr: 'Super élève' },
    isEarned: (progress) => progress.completedCategories.length >= 5,
  },
];

export function getBadge(id: string): Badge | undefined {
  return BADGES.find((badge) => badge.id === id);
}
