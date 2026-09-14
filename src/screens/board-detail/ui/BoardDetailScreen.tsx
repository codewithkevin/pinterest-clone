import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { PinCard } from '@/entities/pin/ui/PinCard';
import { BoardHeader } from '@/widgets/board-header/ui/BoardHeader';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';
import { BOARDS, generatePins } from '@/shared/lib/mockData';

type Props = { boardId: string };

export function BoardDetailScreen({ boardId }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const board = useMemo(() => BOARDS.find((b) => b.id === boardId) ?? BOARDS[0], [boardId]);
  const savedPins = useMemo(() => generatePins(6, 100), []);
  const ideaPins = useMemo(() => generatePins(20, 200), []);

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <AnimatedPressable
          haptic
          style={[styles.backButton, { backgroundColor: theme.surfaceElevated }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={theme.textPrimary} />
        </AnimatedPressable>
      </View>
      <FlashList
        data={ideaPins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PinCard pin={item} />}
        masonry
        numColumns={2}
        optimizeItemArrangement
        contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 120 }}
        ListHeaderComponent={<BoardHeader board={board} savedPins={savedPins} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
