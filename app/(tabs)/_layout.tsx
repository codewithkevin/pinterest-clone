import { StyleSheet } from 'react-native';
import { Tabs, TabSlot, TabList, TabTrigger } from 'expo-router/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabButton } from '@/widgets/tab-bar/ui/TabButton';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';
import { triggerHomeTabPress } from '@/shared/lib/homeTabPress';

export default function TabsLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={[styles.root, { backgroundColor: theme.background }]}>
      <TabSlot />
      <TabList style={[styles.tabList, { bottom: insets.bottom + spacing.md }]}>
        <TabTrigger
          name="index"
          href="/"
          asChild
        >
          <TabButton
            icon="home"
            onPressWhileActive={triggerHomeTabPress}
          />
        </TabTrigger>
        <TabTrigger
          name="search"
          href="/search"
          asChild
        >
          <TabButton icon="search" />
        </TabTrigger>

        <TabTrigger
          name="profile"
          href="/profile"
          asChild
        >
          <TabButton icon="person-outline" />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  tabList: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
});
