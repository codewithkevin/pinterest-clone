import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { PinCard } from '@/entities/pin/ui/PinCard';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';
import { generatePins } from '@/shared/lib/mockData';
import { createTabBarScrollHandler } from '@/shared/lib/tabBarVisibility';

export function SearchScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const pins = useMemo(() => generatePins(30, 500), []);
  const handleScroll = useMemo(() => createTabBarScrollHandler(), []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.searchBarWrapper}>
        <View style={[styles.searchBar, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="search" size={18} color={theme.textSecondary} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={theme.textSecondary}
            value={query}
            onChangeText={setQuery}
            style={[styles.input, { color: theme.textPrimary }]}
          />
        </View>
      </View>
      <FlashList
        data={pins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PinCard pin={item} />}
        masonry
        numColumns={2}
        optimizeItemArrangement
        contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 120 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  searchBarWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.pill,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});
