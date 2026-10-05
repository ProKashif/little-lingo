import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let enabled = true;

export function configureHaptics(next: boolean): void {
  enabled = next;
}

const supported = Platform.OS === 'ios' || Platform.OS === 'android';

function run(effect: () => Promise<void>): void {
  if (!enabled || !supported) return;
  effect().catch(() => undefined);
}

export const haptics = {
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: () => run(() => Haptics.selectionAsync()),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  gentle: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)),
};
