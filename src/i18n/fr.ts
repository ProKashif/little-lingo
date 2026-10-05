import type { Gender } from '@/types';
import type { Strings } from './en';

const startsWithVowel = (word: string) =>
  /^[aeiouyœæ]/i.test(word.normalize('NFD').replace(/[̀-ͯ]/g, ''));

function definiteArticle(word: string, gender?: Gender): string {
  if (startsWithVowel(word)) return `l’${word}`;
  return `${gender === 'f' ? 'la' : 'le'} ${word}`;
}

export const fr: Strings = {
  languageScreen: {
    title: 'Apprenons !',
    subtitle: 'Choisis ta langue',
  },
  tabs: {
    home: 'Accueil',
    learn: 'Apprendre',
    games: 'Jeux',
    progress: 'Étoiles',
  },
  home: {
    greeting: 'Bonjour !',
    subtitle: 'Qu’est-ce qu’on apprend aujourd’hui ?',
    playGame: 'Jouer à Trouve-le',
    grownUps: 'Adultes',
  },
  learn: {
    title: 'Apprendre',
    subtitle: 'Choisis un thème',
    tapToHear: 'Touche pour écouter',
    previous: 'Mot précédent',
    next: 'Mot suivant',
    replay: 'Écouter encore',
    back: 'Retour',
    done: 'Terminer',
    newStar: '+1',
    categoryDone: 'Tu as réussi !',
    categoryDoneBody: 'Tu as appris tous les mots !',
    keepGoing: 'Continuer',
    words: (learned: number, total: number) => `${learned} sur ${total} mots`,
  },
  games: {
    title: 'Jeux',
    subtitle: 'On joue !',
    findItTitle: 'Trouve-le',
    findItSubtitle: 'Écoute et touche la bonne image',
    allTopics: 'Tout',
    whereIs: (word: string, gender?: Gender) =>
      `Où est ${definiteArticle(word.toLowerCase(), gender)} ?`,
    great: 'Bravo !',
    foundIt: 'Bien trouvé !',
    tryAgain: 'Essaie encore !',
    round: (current: number, total: number) => `${current} / ${total}`,
    finishedTitle: 'Bien joué !',
    finishedBody: (stars: number) => `Tu as gagné ${stars} étoiles !`,
    playAgain: 'Rejouer',
    exit: 'Retour aux jeux',
  },
  progress: {
    title: 'Mes étoiles',
    stars: 'Étoiles',
    words: 'Mots',
    streak: 'Jours de suite',
    badges: 'Badges',
    topics: 'Thèmes',
    locked: 'Pas encore gagné',
  },
  parent: {
    gateTitle: 'Réservé aux adultes',
    gateHint: 'Maintiens le bouton appuyé pendant 3 secondes',
    hold: 'Maintenir',
    dashboardTitle: 'Espace parents',
    wordsLearned: 'Mots appris',
    categoriesCompleted: 'Thèmes terminés',
    starsEarned: 'Étoiles gagnées',
    learningTime: 'Temps d’apprentissage',
    streak: 'Jours de suite',
    favorites: 'Thèmes préférés',
    noFavorites: 'Aucun thème ouvert pour l’instant',
    currentLanguage: 'Langue actuelle',
    openSettings: 'Réglages',
    exit: 'Retour à l’application',
    minutes: (minutes: number) => (minutes < 1 ? 'Moins d’une minute' : `${minutes} min`),
  },
  settings: {
    title: 'Réglages',
    language: 'Langue',
    sound: 'Son',
    voice: 'Mots prononcés',
    soundEffects: 'Effets sonores',
    music: 'Musique de fond',
    haptics: 'Vibrations',
    data: 'Données',
    resetProgress: 'Réinitialiser la progression',
    resetTitle: 'Tout réinitialiser ?',
    resetBody: 'Les étoiles, badges et mots appris seront effacés. Action irréversible.',
    cancel: 'Annuler',
    confirmReset: 'Réinitialiser',
    resetDone: 'La progression a été réinitialisée',
  },
  praise: ['Bravo !', 'Super !', 'Génial !', 'Très bien !'],
};
