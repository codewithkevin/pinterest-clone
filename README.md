# Pinterest Clone (Expo)

Built with the current Expo SDK (57), React Native's New Architecture (on by default),
`expo-router` v6 file-based navigation, and Reanimated 4 (worklets-based).

**Primary goal: stay smooth at 60fps while rendering a large, continuously growing feed
of list items and running animation on top of it at the same time** — the masonry grid,
scroll-driven UI, and tab transitions below are all built around that constraint rather
than around visual polish alone.

## Performance-oriented decisions

- **`@shopify/flash-list` (new-arch `masonry` mode)** instead of a `ScrollView` +
  `flexWrap` grid or `FlatList` with manual column-balancing — cells are recycled, not
  re-mounted, so scrolling a feed with hundreds of mixed-aspect-ratio pins stays smooth
  instead of degrading linearly with list length. `optimizeItemArrangement` rebalances
  column heights without extra layout passes.
- **Paginated pools, not unbounded lists**: each category page seeds a 200-pin pool
  once and reveals it in slices of 20 (`onEndReached`), so memory and initial render
  cost don't scale with total content.
- **All interactive/scroll-driven animation runs on Reanimated's UI thread**, not
  React state: tab-bar hide-on-scroll, the collapsing header, the sliding category
  underline, and pull-to-refresh all mutate `useSharedValue`s directly from scroll/press
  handlers, so they don't re-render React or drop frames waiting on the JS thread.
- **Cross-tree UI state without re-render fan-out**: tab-bar visibility is a
  module-level Reanimated mutable (`makeMutable`) read directly by each tab button's
  `useAnimatedStyle`, avoiding a Context/Redux-style re-render cascade for something
  that changes on every scroll frame.
- **New Architecture (Fabric + TurboModules) throughout** — required for FlashList's
  `masonry` mode and generally the baseline for Reanimated 4 / `react-native-worklets`
  performance.

## Architecture — Feature-Sliced Design

```
app/                     expo-router routes only (thin — no business logic)
  (tabs)/                Home / Search / Profile, custom squircle tab bar
  pin/[id].tsx           Pin detail modal
  board/[id].tsx         Board detail

src/
  screens/               Route-level screen compositions (one per app/ route)
  widgets/                Composite UI blocks made of features + entities
    masonry-feed/        FlashList masonry grid + pull-to-refresh
    tab-bar/              Headless expo-router/ui Tabs + custom squircle buttons
    board-header/
  features/               User interactions
    save-pin/             zustand store + animated Save button
    category-tabs/        Swipeable segmented control (underline indicator)
  entities/               Domain models + their basic display components
    pin/                  Pin type + PinCard
    board/
  shared/                 Reusable, feature-agnostic code
    ui/                   AnimatedPressable, IconCircleButton
    theme/                Design tokens + ThemeProvider
    lib/                  Mock data, tab-bar visibility, home-tab-press bridge
```

Dependency rule: `app` → `screens` → `widgets` → `features` → `entities` → `shared`.
Nothing in `shared` imports from higher layers.

## Notable implementation details

- **Masonry grid**: `@shopify/flash-list`'s native `masonry` + `optimizeItemArrangement`
  props (new-arch only), matching the two-column Pinterest layout with mixed aspect
  ratios.
- **Category tabs**: a horizontal `FlashList` segmented control synced to a real
  horizontal-paging `ScrollView` — swipe the feed or tap a tab, both stay in sync.
- **Tab bar**: built on the headless `expo-router/ui` primitives (`Tabs`, `TabList`,
  `TabTrigger`, `TabSlot`), rendered as individual squircle buttons that hide/reveal on
  scroll direction via a shared Reanimated mutable.
- **Collapsing header**: the Home header collapses on scroll-down and on leaving the
  "All" tab, reflowing the tabs into its place via real layout (animated `height`), not
  a transform.
- **Pull-to-refresh**: native `RefreshControl` drives the gesture; its default spinner
  is hidden and replaced with a Lottie mascot animation that reserves real layout space
  as a sibling of the list (not inside FlashList's own header virtualization, which
  doesn't reliably re-measure animated headers in masonry mode).
- **Tap-Home-to-top/refresh**: tapping the already-active Home tab scrolls the current
  category to top, or triggers a refresh if already at top — bridged from the tab bar
  to the screen via a small pub-sub module since they're separate parts of the tree.
- **New Architecture**: enabled by default on SDK 57; `react-native-worklets` installed
  alongside Reanimated 4 as required by its new architecture-only runtime.

## Running

```bash
npm install
npx expo start --ios --go   # Expo Go (fastest path — no native build)
# or, for a full dev client / native build:
npx expo run:ios            # or: npx expo run:android
```

`ios/` and `android/` are generated by prebuild and are gitignored — regenerate with
`npx expo prebuild --clean` if you change native config in `app.json`.

`patches/expo-modules-jsi+*.patch` (applied automatically via `postinstall`) works
around a Swift/C++ interop incompatibility between this Expo SDK version and very new
Xcode releases when building a native dev client — not needed for Expo Go.
