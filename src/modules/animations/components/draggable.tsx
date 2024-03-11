import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  cancelAnimation,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  GAP,
  IMAGE_SIZE,
  SCROLL_HEIGHT_THRESHOLD,
  getOrder,
  getPosition,
} from '@animations/helpers/utils';

type Props = {
  children: React.ReactNode;
  positions: SharedValue<Record<string, number>>;
  id: number;
  rows: number;
  itemWidth?: number;
  scrollY: SharedValue<number>;
};

export const Draggable = ({ children, positions, id, rows, scrollY }: Props) => {
  const position = getPosition(positions.value[id], IMAGE_SIZE);

  const translateX = useSharedValue(position.x);
  const translateY = useSharedValue(position.y);
  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);
  const isGestureActive = useSharedValue(0);

  const previousScroll = useSharedValue(0);

  const dimensions = useWindowDimensions();

  useAnimatedReaction(
    () => positions.value[id],
    newOrder => {
      const newPosition = getPosition(newOrder, IMAGE_SIZE);
      translateX.value = withTiming(newPosition.x);
      translateY.value = withTiming(newPosition.y);
    },
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      initialX.value = translateX.value;
      initialY.value = translateY.value;
      isGestureActive.value = withTiming(1);
    })
    .onUpdate((e: { translationX: number; translationY: number; absoluteY: number }) => {
      const positionY = e.absoluteY + scrollY.value;
      const isAtBottom = positionY >= dimensions.height - SCROLL_HEIGHT_THRESHOLD;
      if (isAtBottom) {
        scrollY.value = withTiming(5000, { duration: 1500 }); //(positionY - (rows * (IMAGE_SIZE + GAP) - SCROLL_HEIGHT_THRESHOLD));
        previousScroll.value = scrollY.value;
      } else {
        cancelAnimation(scrollY);
      }

      translateX.value = e.translationX + initialX.value;
      translateY.value = e.translationY + initialY.value;
      const oldOrder = positions.value[id];
      const newOrder = getOrder(translateX.value, translateY.value, rows);
      if (oldOrder !== newOrder) {
        const idToSwap = Object.keys(positions.value).find(
          key => positions.value[key] === newOrder,
        );
        if (idToSwap !== undefined) {
          const newPositions = { ...positions.value };
          newPositions[id] = newOrder;
          newPositions[idToSwap] = oldOrder;
          positions.value = newPositions;
        }
      }
    })
    .onEnd(() => {
      const destination = getPosition(positions.value[id], IMAGE_SIZE);
      translateX.value = withTiming(destination.x);
      translateY.value = withTiming(destination.y);
      previousScroll.value = 0;
    })
    .onFinalize(() => {
      isGestureActive.value = withTiming(0);
    });

  const rStyle = useAnimatedStyle(() => {
    const zIndex = isGestureActive.value ? 100 : 0;
    const scale = interpolate(+isGestureActive.value, [0, 1], [1, 1.1]);
    return {
      position: 'absolute',
      // x: position.x + GAP,
      // y: position.y,
      width: IMAGE_SIZE,
      zIndex,
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale }],
    };
  });

  return (
    <Animated.View style={rStyle}>
      <GestureDetector gesture={panGesture.activateAfterLongPress(100)}>
        <Animated.View>{children}</Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
