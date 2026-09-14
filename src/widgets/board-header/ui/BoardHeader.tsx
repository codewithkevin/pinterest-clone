import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';
import type { Board, Pin } from '@/entities/pin/model/types';

type Props = {
  board: Board;
  savedPins: Pin[];
};

export function BoardHeader({ board, savedPins }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>{board.title}</Text>
      <Text style={[styles.pinCount, { color: theme.textSecondary }]}>{board.pinCount} Pins</Text>

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Your saves</Text>
        <AnimatedPressable haptic style={[styles.arrowButton, { backgroundColor: theme.surfaceElevated }]}>
          <Ionicons name="arrow-forward" size={18} color={theme.textPrimary} />
        </AnimatedPressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.savesRow}>
        {savedPins.map((pin) => (
          <View key={pin.id} style={styles.saveThumbWrapper}>
            <Image source={{ uri: pin.imageUrl }} style={styles.saveThumb} contentFit="cover" />
            {pin.title ? (
              <View style={styles.saveLabel}>
                <Text numberOfLines={1} style={styles.saveLabelText}>
                  {pin.title}
                </Text>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>

      <Text style={[styles.sectionTitle, styles.ideasTitle, { color: theme.textPrimary }]}>
        More ideas for this board
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  pinCount: {
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  ideasTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  arrowButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savesRow: {
    gap: spacing.sm,
  },
  saveThumbWrapper: {
    width: 140,
    height: 190,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  saveThumb: {
    width: '100%',
    height: '100%',
  },
  saveLabel: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  saveLabelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
