import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const FullImage = () => {
  const [loading, setLoading] = useState(true);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const initialX = useSharedValue(0);
  const initialY = useSharedValue(0);

  const lastOffsetX = useSharedValue(0);

  const topLeftX = useSharedValue(0);
  const topLeftY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onStart(e => {
      translateX.value = withTiming(SCREEN_WIDTH / 2 - e.focalX);
      translateY.value = withTiming(SCREEN_HEIGHT / 2 - e.focalY);
    })
    .onUpdate(e => {
      const value = savedScale.value * e.scale;
      if (Math.max(1, value) === 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
      scale.value = withSpring(Math.min(Math.max(1, value), 5));
      topLeftX.value = translateX.value;
      topLeftY.value = translateY.value;
    })
    .onEnd(() => {
      savedScale.value = withTiming(Math.min(Math.max(1, scale.value), 5));
    });

  const pan = Gesture.Pan()
    .onStart(() => {
      initialX.value = translateX.value;
      initialY.value = translateY.value;
    })
    .onUpdate(e => {
      const maxTranslateY = (SCREEN_HEIGHT * scale.value - SCREEN_HEIGHT) / 2;

      translateX.value = Math.max(
        -50000,
        Math.min(initialX.value + e.translationX / scale.value, 50000),
      );

      translateY.value = Math.max(
        -maxTranslateY,
        Math.min(initialY.value + e.translationY / scale.value, maxTranslateY),
      );
      topLeftX.value = translateX.value;
      topLeftY.value = translateY.value;
    })
    .onEnd(e => {
      lastOffsetX.value = lastOffsetX.value + e.translationX / scale.value;
    });

  const doubleTap = Gesture.Tap()
    .maxDuration(250)
    .numberOfTaps(2)
    .onEnd(() => {
      let snapPoint = 1;
      if (scale.value < 2) {
        snapPoint = 2;
      } else if (scale.value < 3) {
        snapPoint = 3;
      } else if (scale.value < 4) {
        snapPoint = 4;
      } else if (scale.value < 5) {
        snapPoint = 5;
      } else {
        snapPoint = 1;
      }
      scale.value = withSpring(snapPoint);
      if (snapPoint === 1) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  return (
    <View style={{ backgroundColor: 'black' }}>
      <GestureDetector gesture={composed}>
        <Animated.Image
          source={require('../../../assets/images/zoom.jpg')}
          style={[styles.image, rStyle]}
          resizeMode="contain"
          onLoadEnd={() => {
            setLoading(false);
          }}
        />
      </GestureDetector>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator color="rgb(117,12,4)" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
  },
  exitButton: {
    width: 36,
    height: 36,
    backgroundColor: 'black',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 48,
    left: 16,
  },
  overlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});
