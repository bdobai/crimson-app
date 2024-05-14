import React, { useEffect, useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  delay: number;
};

export const AnimatedYDot = React.forwardRef((props: Props, ref) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    animate();
  }, []);

  const animate = () => {
    translateY.value = withDelay(
      props.delay,
      withRepeat(withSequence(withSpring(-50), withSpring(0)), -1),
    );
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
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
