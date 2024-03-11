import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { colors } from '@animations/helpers/constants';

type Props = {
  onPress: () => void;
  index: number;
  animatedValue: Animated.Value;
  animatedValue2: Animated.Value;
};

export const Circle = ({ index, animatedValue, animatedValue2, onPress }: Props) => {
  const { initialBgColor, nextBgColor, bgColor } = colors[index];
  const inputRange = [0, 0.001, 0.5, 0.501, 1];
  const backgroundColor = animatedValue2.interpolate({
    inputRange,
    outputRange: [initialBgColor, initialBgColor, initialBgColor, bgColor, bgColor],
  });
  const dotBgColor = animatedValue2.interpolate({
    inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
    outputRange: [bgColor, bgColor, bgColor, initialBgColor, initialBgColor, nextBgColor],
  });

  const interpolatedColor = animatedValue2.interpolate({
    inputRange: [0, 0.9, 1],
    outputRange: ['black', 'black', 'white'],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.circle,
          {
            backgroundColor: dotBgColor,
            transform: [
              { perspective: 200 },
              {
                rotateY: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: ['0deg', '-90deg', '-180deg'],
                }),
              },

              {
                scale: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 6, 1],
                }),
              },

              {
                translateX: animatedValue2.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, 50, 0],
                }),
              },
            ],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.button,
          {
            opacity: animatedValue.interpolate({
              inputRange: [0, 0.05, 0.9, 1],
              outputRange: [1, 0, 0, 1],
            }),
          },
        ]}
      >
        <Pressable onPress={onPress}>
          <Animated.Text style={[styles.title, { color: interpolatedColor }]}>
            Next Slide
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
  circle: {
    backgroundColor: 'turquoise',
    width: 300,
    height: 300,
    right: -110,
    bottom: -90,
    borderRadius: 150,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: 'black',
    fontSize: 16,
  },
});
