import { type PropsWithChildren } from 'react';
import { Pressable, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type Props = PropsWithChildren<{
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  haptic?: boolean;
  disabled?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}>;

export function AnimatedPressable({
  children,
  onPress,
  onLongPress,
  style,
  scaleTo = 0.94,
  haptic = false,
  disabled,
  onLayout,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { damping: 16, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      }}
      onPress={() => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
      }}
      onLongPress={onLongPress}
      onLayout={onLayout}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  );
}
