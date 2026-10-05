import { memo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors, radius, typography } from '@/theme';

interface Props {
  emoji: string;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function SettingRowBase({ emoji, label, value, onValueChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.emoji} accessible={false}>
        {emoji}
      </Text>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.locked, true: colors.success }}
        thumbColor={colors.surface}
        ios_backgroundColor={colors.locked}
      />
    </View>
  );
}

export const SettingRow = memo(SettingRowBase);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 64,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  emoji: { fontSize: 26 },
  label: { ...typography.body, flex: 1 },
});
