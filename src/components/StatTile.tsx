import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, typography } from '@/theme';

interface Props {
  emoji: string;
  value: string | number;
  label: string;
  color?: string;
}

function StatTileBase({ emoji, value, label, color = colors.surface }: Props) {
  return (
    <View
      style={[styles.tile, { backgroundColor: color }]}
      accessible
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={styles.emoji} accessible={false}>
        {emoji}
      </Text>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

export const StatTile = memo(StatTileBase);

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minHeight: 130,
    padding: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...shadows.soft,
  },
  emoji: { fontSize: 30 },
  value: { ...typography.title },
  label: { ...typography.caption, textAlign: 'center', color: colors.textMuted },
});
