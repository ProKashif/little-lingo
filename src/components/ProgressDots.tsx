import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';
import { ProgressBar } from './ProgressBar';

interface Props {
  count: number;
  index: number;
  color: string;
  accessibilityLabel: string;
}

/** Above this many items, dots get too small to read and a bar is shown instead. */
const MAX_DOTS = 12;

function ProgressDotsBase({ count, index, color, accessibilityLabel }: Props) {
  if (count > MAX_DOTS) {
    return (
      <View style={styles.barWrap}>
        <ProgressBar
          value={(index + 1) / count}
          color={color}
          trackColor={colors.surfaceMuted}
          accessibilityLabel={accessibilityLabel}
        />
      </View>
    );
  }

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: count, now: index + 1 }}
    >
      {Array.from({ length: count }, (_, dot) => (
        <View
          key={dot}
          style={[
            styles.dot,
            dot <= index ? { backgroundColor: color } : styles.dotEmpty,
            dot === index && styles.dotCurrent,
          ]}
        />
      ))}
    </View>
  );
}

export const ProgressDots = memo(ProgressDotsBase);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotEmpty: { backgroundColor: colors.surfaceMuted, borderWidth: 2, borderColor: colors.border },
  dotCurrent: { width: 18, height: 18, borderRadius: 9 },
  barWrap: { width: 160 },
});
