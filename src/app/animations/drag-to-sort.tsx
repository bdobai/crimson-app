import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import { Draggable } from '@animations/components/draggable';
import { GAP, IMAGE_SIZE, getRowsNumber } from '@animations/helpers/utils';

const COLORS = [
  '#FFC0CB', // Pink
  '#FFA07A', // Light Salmon
  '#87CEFA', // Light Sky Blue
  '#98FB98', // Pale Green
  '#DDA0DD', // Plum
  '#FA8072', // Salmon
  '#00CED1', // Dark Turquoise
  '#8A2BE2', // Blue Violet
  '#FF6347', // Tomato
  '#40E0D0', // Turquoise
  '#FF4500', // Orange Red
  '#4169E1', // Royal Blue
  '#ADFF2F', // Green Yellow
  '#9370DB', // Medium Purple
  '#20B2AA', // Light Sea Green
  '#FF8C00', // Dark Orange
  '#1E90FF', // Dodger Blue
  '#32CD32', // Lime Green
  '#8B008B', // Dark Magenta
  '#6A5ACD', // Slate Blue
];

export default function DragToSort() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);

  const positions = useDerivedValue(
    () => Object.assign({}, ...COLORS.map((_, index) => ({ [index]: index }))),
    [COLORS.length],
  );

  const handleScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  useAnimatedReaction(
    () => scrollY.value,
    (a, b) => {
      scrollTo(scrollRef, 0, a, false);
    },
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView />
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ width: '100%' }}
        contentContainerStyle={{ height: (COLORS.length / 2) * (IMAGE_SIZE + GAP) }}
      >
        {COLORS.map((color, index) => (
          <Draggable
            positions={positions}
            id={index}
            rows={getRowsNumber(COLORS)}
            key={index}
            scrollY={scrollY}
          >
            <View
              key={index.toString()}
              style={{
                aspectRatio: 1,
                borderRadius: 16,
                backgroundColor: color,
                marginBottom: 8,
              }}
            />
          </Draggable>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgb(13,34,47)',
  },
});
