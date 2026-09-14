import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { MasonryFeed, type MasonryFeedHandle } from '@/widgets/masonry-feed/ui/MasonryFeed';
import { CategoryTabs } from '@/features/category-tabs/ui/CategoryTabs';
import { AnimatedPressable } from '@/shared/ui/AnimatedPressable';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { spacing } from '@/shared/theme/tokens';
import { CATEGORY_TABS, BOARDS } from '@/shared/lib/mockData';
import { createTabBarScrollHandler } from '@/shared/lib/tabBarVisibility';
import { registerHomeTabPressHandler } from '@/shared/lib/homeTabPress';

const PAGE_BOARD_IDS: (string | null)[] = [null, ...BOARDS.map((b) => b.id)];
const ALL_TAB = CATEGORY_TABS[0];
const HEADER_HEIGHT = 44;

export function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const pagerRef = useRef<ScrollView>(null);

  const headerProgress = useSharedValue(1);

  useEffect(() => {
    headerProgress.value = withTiming(activeTab === ALL_TAB ? 1 : 0, { duration: 240 });
  }, [activeTab, headerProgress]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    height: headerProgress.value * HEADER_HEIGHT,
    opacity: headerProgress.value,
  }));

  const lastAllScrollY = useRef(0);
  const pageScrollY = useRef<number[]>(PAGE_BOARD_IDS.map(() => 0));
  const feedRefs = useRef<(MasonryFeedHandle | null)[]>(PAGE_BOARD_IDS.map(() => null));

  const tabBarScrollHandlers = useMemo(
    () => PAGE_BOARD_IDS.map(() => createTabBarScrollHandler()),
    [],
  );

  const handleAllPageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    pageScrollY.current[0] = y;
    tabBarScrollHandlers[0](event);
    if (activeTab !== ALL_TAB) return;
    const delta = y - lastAllScrollY.current;
    lastAllScrollY.current = y;

    if (y <= 4) {
      headerProgress.value = withTiming(1, { duration: 200 });
    } else if (delta > 8) {
      headerProgress.value = withTiming(0, { duration: 200 });
    } else if (delta < -8) {
      headerProgress.value = withTiming(1, { duration: 200 });
    }
  };

  const otherPageScrollHandlers = useMemo(
    () =>
      PAGE_BOARD_IDS.map(
        (_, index) => (event: NativeSyntheticEvent<NativeScrollEvent>) => {
          pageScrollY.current[index] = event.nativeEvent.contentOffset.y;
          tabBarScrollHandlers[index](event);
        },
      ),
    [tabBarScrollHandlers],
  );

  useEffect(
    () =>
      registerHomeTabPressHandler(() => {
        const index = CATEGORY_TABS.indexOf(activeTab);
        const y = pageScrollY.current[index] ?? 0;
        const feed = feedRefs.current[index];
        if (y > 4) {
          feed?.scrollToTop();
        } else {
          feed?.refresh();
        }
      }),
    [activeTab],
  );

  const handleChangeTab = (tab: string) => {
    const index = CATEGORY_TABS.indexOf(tab);
    if (index < 0) return;
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    const tab = CATEGORY_TABS[index];
    if (tab && tab !== activeTab) setActiveTab(tab);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Image
            source={require('../../../../assets/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.title}>Pinterest</Text>
        </View>
        <View style={styles.headerActions}>
          <AnimatedPressable
            haptic
            style={styles.headerIcon}
            onPress={() => router.push('/create')}
          >
            <Ionicons
              name="add"
              size={26}
              color={theme.textPrimary}
            />
          </AnimatedPressable>
          <AnimatedPressable
            haptic
            style={styles.headerIcon}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={theme.textPrimary}
            />
          </AnimatedPressable>
        </View>
      </Animated.View>

      <CategoryTabs
        tabs={CATEGORY_TABS}
        activeTab={activeTab}
        onChange={handleChangeTab}
      />

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.pager}
      >
        {PAGE_BOARD_IDS.map((boardId, index) => (
          <View
            key={boardId ?? 'all'}
            style={{ width }}
          >
            <MasonryFeed
              ref={(el) => {
                feedRefs.current[index] = el;
              }}
              boardId={boardId}
              onScroll={boardId === null ? handleAllPageScroll : otherPageScrollHandlers[index]}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pager: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 80,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
