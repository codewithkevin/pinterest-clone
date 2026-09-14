import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { IconCircleButton } from '@/shared/ui/IconCircleButton';
import { SaveButton } from '@/features/save-pin/ui/SaveButton';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';
import { generatePins } from '@/shared/lib/mockData';

type Props = { pinId: string };

export function PinDetailScreen({ pinId }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const index = Number(pinId.split('-')[1] ?? 0);
  const pin = useMemo(() => generatePins(1, index)[0], [index]);
  const morePins = useMemo(() => generatePins(10, index + 1000), [index]);

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: pin.imageUrl }} style={styles.image} contentFit="cover" transition={150} />
          <View style={[styles.topBar, { top: insets.top + spacing.sm }]}>
            <IconCircleButton name="arrow-back" onPress={() => router.back()} />
            <View style={styles.topBarRight}>
              <IconCircleButton name="ellipsis-horizontal" />
              <IconCircleButton name="share-outline" />
            </View>
          </View>
        </View>

        <Animated.View entering={FadeInDown.duration(220)} style={styles.body}>
          {pin.title ? (
            <Text style={[styles.title, { color: theme.textPrimary }]}>{pin.title}</Text>
          ) : null}

          <View style={styles.authorRow}>
            <View style={styles.authorInfo}>
              <View style={[styles.avatar, { backgroundColor: theme.surfaceElevated }]} />
              <Text style={[styles.authorName, { color: theme.textPrimary }]}>{pin.authorName}</Text>
            </View>
            <SaveButton pinId={pin.id} />
          </View>

          <Text style={[styles.moreLabel, { color: theme.textPrimary }]}>More to explore</Text>
          <View style={styles.grid}>
            {morePins.map((item) => (
              <View key={item.id} style={styles.gridItem}>
                <AnimatedPressable
                  haptic
                  onPress={() => router.push({ pathname: '/pin/[id]', params: { id: item.id } })}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.gridImage, { aspectRatio: item.width / item.height }]}
                    contentFit="cover"
                  />
                </AnimatedPressable>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topBarRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
  },
  moreLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  gridImage: {
    width: '100%',
    borderRadius: radius.lg,
    backgroundColor: '#222',
  },
});
