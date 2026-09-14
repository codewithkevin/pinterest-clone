import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSequence,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius } from '@/shared/theme/tokens';
import { useSavedPinsStore } from '../model/useSavedPins';

type Props = { pinId: string };

export function SaveButton({ pinId }: Props) {
  const theme = useTheme();
  const isSaved = useSavedPinsStore((s) => s.savedIds.has(pinId));
  const toggleSave = useSavedPinsStore((s) => s.toggleSave);
  const bump = useSharedValue(1);

  const bumpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bump.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    bump.value = withSequence(withTiming(1.15, { duration: 90 }), withTiming(1, { duration: 140 }));
    toggleSave(pinId);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.button,
        {
          backgroundColor: isSaved ? theme.textPrimary : theme.accent,
        },
      ]}
    >
      <Animated.Text style={[styles.label, { color: isSaved ? theme.background : theme.textPrimary }, bumpStyle]}>
        {isSaved ? 'Saved' : 'Save'}
      </Animated.Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
  },
});
