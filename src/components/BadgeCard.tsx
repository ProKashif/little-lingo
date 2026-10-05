import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, typography } from '@/theme';

interface Props {
  emoji: string;
  name: string;
  earned: boolean;
  lockedLabel: string;
}

function BadgeCardBase({ emoji, name, earned, lockedLabel }: Props) {
  return (
    <View
      accessible
      accessibilityLabel={earned ? name : `${name}, ${lockedLabel}`}
      style={[styles.card, earned ? styles.earned : styles.locked]}
    >
      <View style={styles.iconWrap}>
        <Text style={[styles.emoji, !earned && styles.faded]} accessible={false}>
          {emoji}
        </Text>
        {/* Locked state is shown with an icon, not colour alone. */}
        {!earned ? (
          <Text style={styles.lock} accessible={false}>
            🔒
          </Text>
        ) : null}
      </View>
      <Text style={[styles.name, !earned && styles.nameLocked]} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

export const BadgeCard = memo(BadgeCardBase);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 14,
    minHeight: 140,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  earned: { backgroundColor: colors.starSoft, ...shadows.soft },
  locked: { backgroundColor: colors.surfaceMuted },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 48 },
  faded: { opacity: 0.25 },
  lock: { position: 'absolute', fontSize: 26 },
  name: { ...typography.caption, textAlign: 'center', color: colors.text },
  nameLocked: { color: colors.textMuted },
});
