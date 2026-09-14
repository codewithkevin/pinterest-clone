import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';

type Props = {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
};

export function CategoryTabs({ tabs, activeTab, onChange }: Props) {
  const theme = useTheme();
  const listRef = useRef<FlashListRef<string>>(null);

  useEffect(() => {
    const index = tabs.indexOf(activeTab);
    if (index >= 0) {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }
  }, [activeTab, tabs]);

  return (
    <View style={styles.wrapper}>
      <FlashList
        ref={listRef}
        data={tabs}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(tab) => tab}
        contentContainerStyle={styles.content}
        renderItem={({ item: tab }) => {
          const isActive = tab === activeTab;
          return (
            <Pressable onPress={() => onChange(tab)} style={styles.tab}>
              <Text
                style={[
                  styles.label,
                  { color: isActive ? theme.textPrimary : theme.textSecondary },
                ]}
              >
                {tab}
              </Text>
              <View
                style={[
                  styles.underline,
                  { backgroundColor: isActive ? theme.textPrimary : 'transparent' },
                ]}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 52,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  tab: {
    paddingTop: spacing.sm,
    marginRight: spacing.xl,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    paddingBottom: spacing.sm,
  },
  underline: {
    height: 2,
    alignSelf: 'stretch',
    borderRadius: 1,
  },
});
