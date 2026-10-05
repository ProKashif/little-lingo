import { Tabs } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStrings } from '@/context';
import { colors, typography } from '@/theme';

const TAB_ICONS = {
  home: '🏠',
  learn: '📚',
  games: '🎮',
  progress: '⭐',
} as const;

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={[styles.icon, focused ? styles.iconFocused : styles.iconIdle]} accessible={false}>
      {emoji}
    </Text>
  );
}

export default function TabsLayout() {
  const t = useStrings();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        lazy: true,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [
          styles.bar,
          { height: 84 + insets.bottom, paddingBottom: insets.bottom + 10 },
        ],
        tabBarItemStyle: styles.item,
      }}
    >
      {(Object.keys(TAB_ICONS) as (keyof typeof TAB_ICONS)[]).map((name) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: t.tabs[name],
            tabBarAccessibilityLabel: t.tabs[name],
            tabBarIcon: ({ focused }) => <TabIcon emoji={TAB_ICONS[name]} focused={focused} />,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    boxShadow: '0px -4px 18px rgba(46, 42, 71, 0.08)',
  },
  item: { minHeight: 64 },
  label: { ...typography.caption, fontSize: 13, marginTop: 4 },
  icon: { fontSize: 30, lineHeight: 36 },
  iconFocused: { transform: [{ scale: 1.15 }] },
  iconIdle: { opacity: 0.7 },
});
