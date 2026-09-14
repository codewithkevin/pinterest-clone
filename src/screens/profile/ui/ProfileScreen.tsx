import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import { PinCard } from '@/entities/pin/ui/PinCard';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';
import { generatePins } from '@/shared/lib/mockData';
import { useSavedPinsStore } from '@/features/save-pin/model/useSavedPins';
import { createTabBarScrollHandler } from '@/shared/lib/tabBarVisibility';

export function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const allPins = useMemo(() => generatePins(24, 900), []);
  const savedIds = useSavedPinsStore((s) => s.savedIds);
  const savedPins = allPins.filter((p) => savedIds.has(p.id));
  const handleScroll = useMemo(() => createTabBarScrollHandler(), []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <FlashList
        data={savedPins.length ? savedPins : allPins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PinCard pin={item} />}
        masonry
        numColumns={2}
        optimizeItemArrangement
        contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 120 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/avatar/160/160' }}
              style={styles.avatar}
            />
            <Text style={[styles.name, { color: theme.textPrimary }]}>Your profile</Text>
            <Text style={[styles.handle, { color: theme.textSecondary }]}>@you · 12 followers</Text>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              {savedPins.length ? 'Saved pins' : 'Suggested for you'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
    backgroundColor: '#222',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
  },
  handle: {
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    marginLeft: spacing.lg,
    fontSize: 16,
    fontWeight: '700',
  },
});
