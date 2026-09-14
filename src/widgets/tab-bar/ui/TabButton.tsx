import { forwardRef } from 'react';
import { StyleSheet, type View } from 'react-native';
import { Pressable } from 'react-native';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { tabBarVisibility } from '@/shared/lib/tabBarVisibility';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

const BUTTON_SIZE = 50;
const BUTTON_RADIUS = 10;

export type TabButtonProps = TabTriggerSlotProps & {
  icon: keyof typeof Ionicons.glyphMap;
  onPressWhileActive?: () => void;
};

export const TabButton = forwardRef<View, TabButtonProps>(
  ({ icon, isFocused, onPressWhileActive, ...props }, ref) => {
    const theme = useTheme();

    const animatedStyle = useAnimatedStyle(() => ({
      backgroundColor: withSpring(isFocused ? theme.textPrimary : theme.chipBackground, {
        stiffness: 300,
      }),
      opacity: tabBarVisibility.value,
      transform: [
        { scale: withSpring(isFocused ? 1 : 0.94, { damping: 18, stiffness: 220 }) },
        { translateY: (1 - tabBarVisibility.value) * 70 },
      ],
    }));

    return (
      <AnimatedPressableBase
        ref={ref}
        {...props}
        onPress={(event) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (isFocused) {
            onPressWhileActive?.();
          }
          props.onPress?.(event);
        }}
        style={[styles.item, animatedStyle]}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isFocused ? theme.background : theme.textPrimary}
        />
      </AnimatedPressableBase>
    );
  },
);
TabButton.displayName = 'TabButton';

const styles = StyleSheet.create({
  item: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
