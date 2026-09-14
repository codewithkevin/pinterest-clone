import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { IconCircleButton } from '@/shared/ui/IconCircleButton';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';
import type { Pin } from '../model/types';
import { useSavedPinsStore } from '@/features/save-pin/model/useSavedPins';

const GRID_PADDING = spacing.sm;
const CARD_GUTTER = spacing.xs;

type Props = { pin: Pin };

export function PinCard({ pin }: Props) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isSaved = useSavedPinsStore((s) => s.savedIds.has(pin.id));

  const columnWidth = (windowWidth - GRID_PADDING * 2) / 2 - CARD_GUTTER;
  const imageHeight = Math.round((columnWidth * pin.height) / pin.width);

  return (
    <Animated.View entering={FadeIn.duration(240)} style={styles.container}>
      <AnimatedPressable
        haptic
        scaleTo={0.97}
        onPress={() => router.push({ pathname: '/pin/[id]', params: { id: pin.id } })}
      >
        <View style={[styles.imageWrapper, { height: imageHeight, borderRadius: radius.lg }]}>
          <Image
            source={{ uri: pin.imageUrl }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={150}
          />
          {isSaved ? (
            <View style={[styles.savedBadge, { backgroundColor: theme.textPrimary }]}>
              <Text style={styles.savedBadgeText}>Saved</Text>
            </View>
          ) : null}
          <IconCircleButton name="ellipsis-horizontal" size={30} iconSize={16} style={styles.menuButton} />
        </View>
        {pin.title ? (
          <Text numberOfLines={2} style={[styles.title, { color: theme.textPrimary }]}>
            {pin.title}
          </Text>
        ) : null}
      </AnimatedPressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: CARD_GUTTER,
    marginBottom: spacing.sm,
  },
  imageWrapper: {
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  menuButton: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
  },
  savedBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
  },
  savedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  title: {
    marginTop: spacing.xs,
    fontSize: 13,
    fontWeight: '500',
  },
});
