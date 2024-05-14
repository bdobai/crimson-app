import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const INNER_CIRCLE_R = Dimensions.get('window').width / 1.5;
const OUTER_CIRCLE_R = Dimensions.get('window').width / 1.5 + 20;

export default function Graphs() {
  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);

  const backgroundStyle = useAnimatedStyle(() => {
    const xOffset = translateX.value / INNER_CIRCLE_R;
    const yOffset = translateY.value / INNER_CIRCLE_R;

    const backgroundColor = interpolateColor(xOffset, [-1, 0, 1], ['red', 'green', 'blue']);

    const backgroundX = interpolate(xOffset, [-1, 0, 1], [1, 0.5, 0]);
    const backgroundY = interpolate(yOffset, [-1, 0, 1], [0, 0.5, 1]);

    const backgroundOpacity = Math.max(backgroundX, backgroundY);

    return {
      backgroundColor,
      opacity: backgroundOpacity,
      transform: [{ translateX: translateX.value / 6 }, { translateY: translateY.value / 6 }],
    };
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  const pan = Gesture.Pan()
    .onStart(() => {
      initialX.value = translateX.value;
      initialY.value = translateY.value;
    })
    .onUpdate(e => {
      const angle = Math.atan2(e.translationY, e.translationX);
      const radius = Math.min(Math.sqrt(e.translationX ** 2 + e.translationY ** 2), 50);

      const translatedX = initialX.value + radius * Math.cos(angle);
      const translatedY = initialY.value + radius * Math.sin(angle);

      const scaleXFactor = 1 + Math.abs(translatedX - initialX.value) / 50;
      const scaleYFactor = 1 + Math.abs(translatedY - initialY.value) / 50;
      // Clamp scaling factors to a maximum value of 1.25
      const clampedScaleXFactor = Math.min(scaleXFactor, 1.25);
      const clampedScaleYFactor = Math.min(scaleYFactor, 1.25);

      scaleX.value = clampedScaleXFactor;
      scaleY.value = clampedScaleYFactor;
      translateX.value = translatedX;
      translateY.value = translatedY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.gradient, backgroundStyle]} />
      <View style={styles.center}>
        <View style={styles.flex}>
          <Text style={styles.high}>High</Text>
        </View>
        <View style={[styles.flex, styles.row]}>
          <Text style={styles.high}>Left</Text>
          <Text style={styles.high}>Right</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.high}>Low</Text>
        </View>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.knob, rStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  high: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(13,34,47)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    width: INNER_CIRCLE_R,
    height: INNER_CIRCLE_R,
    borderRadius: INNER_CIRCLE_R / 2,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    width: OUTER_CIRCLE_R,
    height: OUTER_CIRCLE_R,
    borderRadius: OUTER_CIRCLE_R / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  knob: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -25,
    marginLeft: -25,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
});
