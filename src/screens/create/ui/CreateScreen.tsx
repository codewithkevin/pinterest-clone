import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { radius, spacing } from '@/shared/theme/tokens';

export function CreateScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.topBar}>
        <AnimatedPressable haptic onPress={() => router.back()}>
          <Ionicons name="close" size={26} color={theme.textPrimary} />
        </AnimatedPressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>Create Pin</Text>
        <View style={{ width: 26 }} />
      </View>
      <View style={styles.dropzoneWrapper}>
        <View style={[styles.dropzone, { borderColor: theme.border }]}>
          <Ionicons name="cloud-upload-outline" size={40} color={theme.textSecondary} />
          <Text style={[styles.dropzoneTitle, { color: theme.textPrimary }]}>Choose a photo or video</Text>
          <Text style={[styles.dropzoneSubtitle, { color: theme.textSecondary }]}>
            We recommend using high quality .jpg files
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  dropzoneWrapper: {
    paddingHorizontal: spacing.lg,
  },
  dropzone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.xxl * 2,
    alignItems: 'center',
    gap: spacing.sm,
  },
  dropzoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  dropzoneSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
});
