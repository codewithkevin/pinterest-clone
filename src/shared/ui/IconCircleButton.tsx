import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from './AnimatedPressable';
import { radius } from '../theme/tokens';

type Props = {
  name: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconCircleButton({
  name,
  onPress,
  size = 36,
  iconSize = 18,
  color = '#FFFFFF',
  style,
}: Props) {
  return (
    <AnimatedPressable
      onPress={onPress}
      haptic
      style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <BlurView
        intensity={40}
        tint="dark"
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2, overflow: 'hidden' }]}
      />
      <Ionicons name={name} size={iconSize} color={color} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radius.pill,
  },
});
