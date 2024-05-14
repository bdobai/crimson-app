import React, { useEffect, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  delay: number;
  corner: 'A' | 'B' | 'C';
};

const X_TRANSLATION_SIZE = 56;
const Y_TRANSLATION_SIZE = 100;

export const AnimatedXYDot = React.forwardRef((props: Props, ref) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    animate();
  }, []);

  const orders = {
    A: {
      x: [-X_TRANSLATION_SIZE, X_TRANSLATION_SIZE, 0],
      y: [Y_TRANSLATION_SIZE, Y_TRANSLATION_SIZE, 0],
    },
    B: {
      x: [2 * X_TRANSLATION_SIZE, X_TRANSLATION_SIZE, 0],
      y: [1, -Y_TRANSLATION_SIZE, 0],
    },
    C: {
      x: [-X_TRANSLATION_SIZE, -2 * X_TRANSLATION_SIZE, 0],
      y: [-Y_TRANSLATION_SIZE, 0, 0],
    },
  };

  const colors = {
    A: 'rgb(255, 107, 107)',
    B: 'rgb(255, 204, 92)',
    C: 'rgb(92, 204, 255)',
  };

  const animate = () => {
    translateX.value = withDelay(
      props.delay,
      withRepeat(
        withSequence(
          withTiming(orders[props.corner]['x'][0], { duration: 500 }),
          withTiming(orders[props.corner]['x'][1], { duration: 500 }),
          withTiming(orders[props.corner]['x'][2], { duration: 500 }),
        ),
        -1,
      ),
    );
    translateY.value = withDelay(
      props.delay,
      withRepeat(
        withSequence(
          withTiming(orders[props.corner]['y'][0], { duration: 500 }),
          withTiming(orders[props.corner]['y'][1], { duration: 500 }),
          withTiming(orders[props.corner]['y'][2], { duration: 500 }),
        ),
        -1,
      ),
    );
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { translateX: translateX.value }],
      marginTop: props.corner === 'A' ? -2 * Y_TRANSLATION_SIZE : 0,
      backgroundColor: colors[props.corner],
    };
  });

  useImperativeHandle(ref, () => ({
    animate,
  }));

  return <Animated.View style={[styles.circle, rStyle]} />;
});

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
  },
});
