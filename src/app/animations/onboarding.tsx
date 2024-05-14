import * as React from 'react';
import { Animated, Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Circle } from '@animations/components/onboarding-circle';
import { colors } from '@animations/helpers/constants';

const { width } = Dimensions.get('window');

const DURATION = 1000;
const TEXT_DURATION = DURATION * 1.2;

export default function App() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedValue2 = React.useRef(new Animated.Value(0)).current;
  const sliderAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const inputRange = [...Array(colors.length).keys()];
  const [index, setIndex] = React.useState(0);

  const animate = (i: number) =>
    Animated.parallel([
      Animated.timing(sliderAnimatedValue, {
        toValue: i,
        duration: TEXT_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue2, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: false,
      }),
    ]);

  const onPress = () => {
    animatedValue.setValue(0);
    animatedValue2.setValue(0);
    animate((index + 1) % colors.length).start();
    setIndex((index + 1) % colors.length);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <StatusBar hidden />
      <Circle
        index={index}
        animatedValue={animatedValue}
        animatedValue2={animatedValue2}
        onPress={onPress}
      />
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          transform: [
            {
              translateX: sliderAnimatedValue.interpolate({
                inputRange,
                outputRange: colors.map((_: any, i: number) => -i * width),
              }),
            },
          ],
          opacity: sliderAnimatedValue.interpolate({
            inputRange: [...Array(colors.length * 2 + 1).keys()].map(i => i / 2),
            outputRange: [...Array(colors.length * 2 + 1).keys()].map(i => (i % 2 === 0 ? 1 : 0)),
          }),
        }}
      >
        {colors.map((item: any, index: number) => {
          return (
            <View key={index.toString()} style={styles.logo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(117,12,4)',
  },
  description: {
    fontSize: 16,
    color: 'rgb(117,12,4)',
  },
});
