import { memo, type PropsWithChildren } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { haptics } from '@/services/haptics';

export interface PressableScaleProps
  extends Omit<PressableProps, 'style' | 'children'>, PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  /** How far the element shrinks while held. */
  scaleTo?: number;
  hapticOnPress?: boolean;
}

const SPRING = { damping: 14, stiffness: 260, mass: 0.6 };

function PressableScaleBase({
  style,
  children,
  scaleTo = 0.94,
  hapticOnPress = true,
  onPressIn,
  onPressOut,
  onPress,
  accessibilityRole = 'button',
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      onPressIn={(event) => {
        scale.set(withSpring(scaleTo, SPRING));
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.set(withSpring(1, SPRING));
        onPressOut?.(event);
      }}
      onPress={(event) => {
        if (hapticOnPress) haptics.tap();
        onPress?.(event);
      }}
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

export const PressableScale = memo(PressableScaleBase);
