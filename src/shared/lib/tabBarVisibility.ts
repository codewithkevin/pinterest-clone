import { makeMutable, withTiming } from 'react-native-reanimated';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const SHOW_NEAR_TOP = 4;
const HIDE_THRESHOLD = 8;
const DURATION = 200;

export const tabBarVisibility = makeMutable(1);

export function createTabBarScrollHandler() {
  let lastY = 0;

  return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const delta = y - lastY;
    lastY = y;

    if (y <= SHOW_NEAR_TOP) {
      tabBarVisibility.value = withTiming(1, { duration: DURATION });
    } else if (delta > HIDE_THRESHOLD) {
      tabBarVisibility.value = withTiming(0, { duration: DURATION });
    } else if (delta < -HIDE_THRESHOLD) {
      tabBarVisibility.value = withTiming(1, { duration: DURATION });
    }
  };
}
