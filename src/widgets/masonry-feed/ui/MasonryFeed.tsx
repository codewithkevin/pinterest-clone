import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import LottieView from 'lottie-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { PinCard } from '@/entities/pin/ui/PinCard';
import { generatePins } from '@/shared/lib/mockData';
import { spacing } from '@/shared/theme/tokens';
import type { Pin } from '@/entities/pin/model/types';

const PAGE_SIZE = 20;
const POOL_SIZE = 200;
const TRANSITION_DURATION = 320;
const REFRESH_INDICATOR_HEIGHT = 100;

const mascotAnimation = require('../../../../assets/lottie/mascot-jump.json');

type Props = {
  boardId?: string | null;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export type MasonryFeedHandle = {
  scrollToTop: () => void;
  refresh: () => void;
};

export const MasonryFeed = forwardRef<MasonryFeedHandle, Props>(function MasonryFeed(
  { boardId, onScroll },
  ref,
) {
  const [allPins] = useState<Pin[]>(() => generatePins(POOL_SIZE));
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [refreshing, setRefreshing] = useState(false);
  const lottieRef = useRef<LottieView>(null);
  const listRef = useRef<FlashListRef<Pin>>(null);

  const refreshProgress = useSharedValue(0);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [boardId]);

  useEffect(() => {
    refreshProgress.value = withTiming(refreshing ? 1 : 0, {
      duration: TRANSITION_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    if (refreshing) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [refreshing, refreshProgress]);

  const refreshIndicatorStyle = useAnimatedStyle(() => ({
    height: refreshProgress.value * REFRESH_INDICATOR_HEIGHT,
    opacity: refreshProgress.value,
    transform: [{ scale: 0.5 + refreshProgress.value * 0.5 }],
  }));

  const filtered = boardId ? allPins.filter((p) => p.boardId === boardId) : allPins;
  const pins = filtered.slice(0, visibleCount);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setVisibleCount(PAGE_SIZE);
      setRefreshing(false);
    }, 1100);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        listRef.current?.scrollToOffset({ offset: 0, animated: true });
      },
      refresh,
    }),
    [refresh],
  );

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.refreshIndicator, refreshIndicatorStyle]}>
        <LottieView
          ref={lottieRef}
          source={mascotAnimation}
          loop
          style={styles.lottie}
        />
      </Animated.View>
      <FlashList
        ref={listRef}
        data={pins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PinCard pin={item} />}
        masonry
        numColumns={2}
        optimizeItemArrangement
        contentContainerStyle={{ paddingHorizontal: spacing.sm, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <></>}
        onEndReachedThreshold={0.6}
        onEndReached={loadMore}
        onScroll={onScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="transparent"
            colors={['transparent']}
            style={{ backgroundColor: 'transparent' }}
          />
        }
        drawDistance={400}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  refreshIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lottie: {
    width: 76,
    height: 76,
  },
});
