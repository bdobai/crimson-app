import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  SensorType,
  useAnimatedReaction,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const INITIAL_SIZE = 50;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CENTER_Y = SCREEN_HEIGHT / 2 - INITIAL_SIZE / 2;
const CENTER_X = SCREEN_WIDTH / 2 - INITIAL_SIZE / 2;

const Coin = ({ x, y }: any) => {
  const show = useSharedValue(1);
  useAnimatedReaction(
    () => {
      return { x: x.value, y: y.value };
    },
    ({ x, y }) => {
      console.log('y', CENTER_Y, y);
      if (CENTER_Y + y < 150 && CENTER_X + x < 30) {
        show.value = withTiming(0);
      } else {
        show.value = withTiming(1);
      }
    },
  );

  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: show.value,
    };
  });

  return <Animated.View style={[styles.coin, rStyle]} />;
};

export default function Football() {
  const gyroscope = useAnimatedSensor(SensorType.ROTATION);
  const ballX = useSharedValue(0);
  const ballY = useSharedValue(0);
  const scale = useSharedValue(1);

  useAnimatedReaction(
    () => {
      return { x: ballX.value, y: ballY.value };
    },
    ({ x, y }) => {
      if (CENTER_Y + y < 200 && CENTER_X + x < 100) {
        scale.value = withTiming(2);
      } else {
        scale.value = withTiming(1);
      }
    },
  );

  const rStyle = useAnimatedStyle(() => {
    const { pitch, roll } = gyroscope.sensor.value;
    ballX.value = withSpring(roll * 300);
    ballY.value = withSpring(pitch * 500);
    return {
      transform: [
        { translateX: withSpring(roll * 300) },
        { translateY: withSpring(pitch * 500) },
        { scale: withSpring(scale.value) },
      ],
    };
  });

  // Determine if the black circle is above the yellow circle

  return (
    <View style={styles.container}>
      <Coin x={ballX} y={ballY} />

      <Animated.View
        style={[
          styles.ball,
          rStyle,
          {
            width: INITIAL_SIZE,
            height: INITIAL_SIZE,
            borderRadius: INITIAL_SIZE / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(13,34,47)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    backgroundColor: 'black',
    position: 'absolute',
  },
  coin: {
    width: 25,
    height: 25,
    backgroundColor: 'yellow',
    borderRadius: 25,
    position: 'absolute',
    top: 200,
    left: 100,
  },
});
