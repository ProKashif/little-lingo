import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/theme';

interface ScreenProps extends PropsWithChildren {
  backgroundColor?: string;
  edges?: Edge[];
  style?: ViewStyle;
}

export function Screen({
  children,
  backgroundColor = colors.background,
  edges = ['top', 'left', 'right'],
  style,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, left, right }: HeaderProps) {
  return (
    <View style={styles.header}>
      {left}
      <View style={styles.headerText}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerText: { flex: 1 },
  title: { ...typography.title },
  subtitle: { ...typography.body, color: colors.textMuted },
});
