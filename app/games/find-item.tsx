import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import {
  AudioButton,
  GameOption,
  type GameOptionState,
  PressableScale,
  RoundButton,
  Screen,
  StarBurst,
  StarCounter,
} from '@/components';
import { useLanguage, useProgressActions } from '@/context';
import { getCategory } from '@/data/categories';
import {
  createFindItRound,
  FIND_IT,
  type FindItRound,
  findItQuestion,
  getFindItPool,
} from '@/data/games';
import { useLearningTimer } from '@/hooks/useLearningTimer';
import { playEffect, speakPhrase, stopAudio } from '@/services/audio';
import { haptics } from '@/services/haptics';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { CategoryId, VocabularyItem } from '@/types';

type Feedback = { kind: 'correct'; praise: string } | { kind: 'wrong' } | null;

const NEXT_ROUND_MS = 1700;
const QUESTION_DELAY_MS = 450;
const WRONG_RESET_MS = 900;

export default function FindItScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const category = params.category ? getCategory(params.category) : undefined;
  const pool = useMemo(() => getFindItPool(category?.id as CategoryId | undefined), [category]);

  const { language, strings: t } = useLanguage();
  const { recordGameCorrect } = useProgressActions();
  const { width } = useWindowDimensions();
  const optionSize = Math.min((width - spacing.lg * 2 - spacing.md * 2) / 3, 140);

  const [round, setRound] = useState<FindItRound | null>(() => createFindItRound(pool));
  const [roundNumber, setRoundNumber] = useState(1);
  const [sessionStars, setSessionStars] = useState(0);
  const [states, setStates] = useState<Record<string, GameOptionState>>({});
  const [shakes, setShakes] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [burst, setBurst] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useLearningTimer();

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      void stopAudio();
    },
    [],
  );

  const question = round ? findItQuestion(round.target, language, t.games.whereIs) : '';

  const askQuestion = useCallback(() => {
    if (question) void speakPhrase(question, language);
  }, [question, language]);

  useEffect(() => {
    if (finished || !round) return;
    const timer = setTimeout(askQuestion, QUESTION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [round, finished, askQuestion]);

  const startSession = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRound(createFindItRound(pool));
    setRoundNumber(1);
    setSessionStars(0);
    setStates({});
    setFeedback(null);
    setLocked(false);
    setFinished(false);
  }, [pool]);

  const handlePick = useCallback(
    (item: VocabularyItem) => {
      if (!round || locked) return;

      if (item.id === round.target.id) {
        const praise = t.praise[Math.floor(Math.random() * t.praise.length)] ?? t.games.great;
        setLocked(true);
        setFeedback({ kind: 'correct', praise });
        setStates(
          Object.fromEntries(
            round.options.map((option) => [option.id, option.id === item.id ? 'correct' : 'faded']),
          ),
        );
        setBurst((count) => count + 1);
        setSessionStars((count) => count + 1);
        recordGameCorrect();
        haptics.success();
        playEffect('success');
        void speakPhrase(praise, language);

        later(() => {
          if (roundNumber >= FIND_IT.roundsPerSession) {
            setFinished(true);
            playEffect('celebrate');
            return;
          }
          setRound(createFindItRound(pool, round.target.id));
          setRoundNumber((count) => count + 1);
          setStates({});
          setFeedback(null);
          setLocked(false);
        }, NEXT_ROUND_MS);
        return;
      }

      // A miss costs nothing: shake, a kind word, and the same question again.
      setFeedback({ kind: 'wrong' });
      setStates((current) => ({ ...current, [item.id]: 'wrong' }));
      setShakes((current) => ({ ...current, [item.id]: (current[item.id] ?? 0) + 1 }));
      haptics.gentle();
      playEffect('tryAgain');
      void speakPhrase(t.games.tryAgain, language);
      later(() => {
        setStates((current) =>
          current[item.id] === 'wrong' ? { ...current, [item.id]: 'idle' } : current,
        );
      }, WRONG_RESET_MS);
    },
    [round, locked, t, language, recordGameCorrect, later, roundNumber, pool],
  );

  const backButton = (
    <RoundButton emoji="⬅️" accessibilityLabel={t.learn.back} onPress={router.back} size={64} />
  );

  if (finished || !round) {
    return (
      <Screen backgroundColor={colors.pastel.sky} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.topBar}>{backButton}</View>
        <View style={styles.finish}>
          <Animated.Text entering={ZoomIn.springify().damping(10)} style={styles.trophy}>
            🏆
          </Animated.Text>
          <StarBurst trigger={finished ? 1 : 0} count={12} distance={180} />
          <Text style={styles.finishTitle} accessibilityRole="header">
            {t.games.finishedTitle}
          </Text>
          <StarCounter stars={sessionStars} accessibilityLabel={t.progress.stars} size="large" />
          <Text style={styles.finishBody}>{t.games.finishedBody(sessionStars)}</Text>
          <PressableScale
            onPress={startSession}
            accessibilityLabel={t.games.playAgain}
            style={styles.primary}
          >
            <Text style={styles.primaryText}>🔁 {t.games.playAgain}</Text>
          </PressableScale>
          <PressableScale
            onPress={router.back}
            accessibilityLabel={t.games.exit}
            style={styles.secondary}
          >
            <Text style={styles.secondaryText}>{t.games.exit}</Text>
          </PressableScale>
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      backgroundColor={category?.color ?? colors.pastel.sky}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.topBar}>
        {backButton}
        <View
          style={styles.roundPill}
          accessible
          accessibilityLabel={t.games.round(roundNumber, FIND_IT.roundsPerSession)}
        >
          <Text style={styles.roundText}>
            {t.games.round(roundNumber, FIND_IT.roundsPerSession)}
          </Text>
        </View>
        <StarCounter stars={sessionStars} accessibilityLabel={t.progress.stars} />
      </View>

      <View style={styles.stage}>
        <Animated.View
          key={`q-${roundNumber}`}
          entering={FadeInDown.duration(350)}
          style={styles.questionCard}
        >
          <Text style={styles.question} accessibilityRole="header" accessibilityLiveRegion="polite">
            {question}
          </Text>
          <AudioButton onPress={askQuestion} accessibilityLabel={t.learn.replay} />
        </Animated.View>

        <View style={styles.options}>
          {round.options.map((option, index) => (
            <GameOption
              key={`${roundNumber}-${option.id}`}
              item={option}
              label={option.translations[language]}
              state={states[option.id] ?? 'idle'}
              shakeKey={shakes[option.id] ?? 0}
              size={optionSize}
              index={index}
              disabled={locked}
              onPress={handlePick}
            />
          ))}
          <StarBurst trigger={burst} count={10} distance={160} />
        </View>

        <View style={styles.feedbackSlot}>
          {feedback?.kind === 'correct' ? (
            <Animated.View
              key={`ok-${roundNumber}`}
              entering={ZoomIn.springify()}
              style={styles.feedbackGood}
            >
              <Text style={styles.feedbackTitle}>⭐ {feedback.praise}</Text>
              <Text style={styles.feedbackBody}>{t.games.foundIt}</Text>
            </Animated.View>
          ) : null}
          {feedback?.kind === 'wrong' ? (
            <Animated.View entering={FadeIn} style={styles.feedbackGentle}>
              <Text style={styles.feedbackTitle}>🤗 {t.games.tryAgain}</Text>
            </Animated.View>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  roundPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  roundText: { ...typography.label },
  stage: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, gap: spacing.xl },
  questionCard: {
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  question: { ...typography.title, textAlign: 'center' },
  options: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feedbackSlot: { minHeight: 96, alignItems: 'center', justifyContent: 'center' },
  feedbackGood: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.successSoft,
  },
  feedbackGentle: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.pastel.lilac,
  },
  feedbackTitle: { ...typography.heading, textAlign: 'center' },
  feedbackBody: { ...typography.body, color: colors.textMuted },
  finish: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  trophy: { fontSize: 110, lineHeight: 128 },
  finishTitle: { ...typography.hero, textAlign: 'center' },
  finishBody: { ...typography.body, textAlign: 'center', color: colors.textMuted },
  primary: {
    marginTop: spacing.md,
    minHeight: 76,
    minWidth: 240,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  primaryText: { ...typography.heading, color: colors.textOnAccent },
  secondary: { minHeight: 64, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  secondaryText: { ...typography.body, color: colors.textMuted },
});
