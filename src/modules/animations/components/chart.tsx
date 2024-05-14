import React from 'react';
import { Pressable, Text as RNText, StyleSheet, View } from 'react-native';

import {
  Canvas,
  Easing,
  Path,
  Skia,
  Text,
  runTiming,
  useFont,
  useValue,
} from '@shopify/react-native-skia';

import { Button } from '@app/components/button';

const RADIUS = 100;
const STROKE_WIDTH = 20;
// const PERCENTAGE_COMPLETE = 0.85;
const TARGET_PERCENTAGE = 0.75;

export const Chart = () => {
  const font = useFont(require('../../../../assets/fonts/SpaceMono-Regular.ttf'), 48);
  const smallFont = useFont(require('../../../../assets/fonts/SpaceMono-Regular.ttf'), 24);
  const animationState = useValue(0);

  const currentPercentage = useValue(0.75);

  if (!font || !smallFont) {
    return <View />;
  }

  const animateChart = () => {
    // animationState.current = 0;
    runTiming(animationState, currentPercentage.current, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const innerRadius = RADIUS - STROKE_WIDTH / 2;
  const targetText = `${TARGET_PERCENTAGE * 100}`;

  const path = Skia.Path.Make();
  path.addCircle(RADIUS, RADIUS, innerRadius);

  const width = font.getTextWidth(targetText);
  const smallWidth = smallFont.getTextWidth('Total');

  const onChange = (value: number) => {
    currentPercentage.current = currentPercentage.current + value;
    animateChart();
  };

  return (
    <View style={styles.container}>
      <Canvas style={[styles.graphContainer, { width: RADIUS * 2 }]}>
        <Path
          path={path}
          color="white"
          style="stroke"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          start={0}
          end={animationState}
        />
        <Text
          x={innerRadius - width / 2 + 8}
          y={RADIUS + STROKE_WIDTH}
          text={targetText}
          font={font}
          opacity={animationState}
          color="#DC143C"
        />
        <Text
          x={RADIUS - smallWidth / 2}
          y={RADIUS + 45}
          text="Target"
          font={smallFont}
          opacity={animationState}
          color="white"
        />
      </Canvas>
      <Button onPress={animateChart} text="Animate" />
      <View style={styles.row}>
        <Button onPress={() => onChange(-0.1)} text="-" />
        <Button onPress={() => onChange(0.1)} text="+" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphContainer: {
    height: 300,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
});
