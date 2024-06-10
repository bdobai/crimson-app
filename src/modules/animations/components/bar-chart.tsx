import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { Canvas, Line, Path, Skia, Text, point, useFont } from '@shopify/react-native-skia';
import { max, scaleLinear, scalePoint } from 'd3';

import { Button } from '@app/components/button';

type DataPoint = {
  label: string;
  value: number;
};

const data1: DataPoint[] = [
  { label: 'Jan', value: 50 },
  { label: 'Feb', value: 200 },
  { label: 'Mar', value: 350 },
  { label: 'Apr', value: 100 },
  { label: 'May', value: 450 },
  { label: 'Jun', value: 400 },
  { label: 'Jul', value: 250 },
  { label: 'Aug', value: 50 },
  { label: 'Sep', value: 150 },
  { label: 'Oct', value: 400 },
  { label: 'Nov', value: 350 },
  { label: 'Dec', value: 200 },
];

const data2: DataPoint[] = [
  { label: 'Jan', value: 150 },
  { label: 'Feb', value: 300 },
  { label: 'Mar', value: 450 },
  { label: 'Apr', value: 200 },
  { label: 'May', value: 120 },
  { label: 'Jun', value: 200 },
  { label: 'Jul', value: 400 },
  { label: 'Aug', value: 220 },
  { label: 'Sep', value: 100 },
  { label: 'Oct', value: 300 },
  { label: 'Nov', value: 50 },
  { label: 'Dec', value: 10 },
];

const data3: DataPoint[] = [
  { label: 'Jan', value: 250 },
  { label: 'Feb', value: 400 },
  { label: 'Mar', value: 350 },
  { label: 'Apr', value: 300 },
  { label: 'May', value: 250 },
  { label: 'Jun', value: 200 },
  { label: 'Jul', value: 150 },
  { label: 'Aug', value: 100 },
  { label: 'Sep', value: 50 },
  { label: 'Oct', value: 400 },
  { label: 'Nov', value: 350 },
  { label: 'Dec', value: 300 },
];

const GRAPH_MARGIN = 20;
const GRAPH_BAR_WIDTH = 8;

const CANVAS_HEIGHT = 350;
const CANVAS_WIDTH = Dimensions.get('window').width - 48;

const GRAPH_HEIGHT = CANVAS_HEIGHT - 2 * GRAPH_MARGIN;
const GRAPH_WIDTH = CANVAS_WIDTH - 2;

export const BarChart = () => {
  const font = useFont(require('../../../../assets/fonts/SpaceMono-Regular.ttf'), 12);

  const data = [data1, data2, data3];
  const transitionState = useSharedValue({
    current: 0,
    next: 1,
  });

  const xDomain = data[transitionState.value.current].map(i => i.label);
  const xRange = [0, GRAPH_WIDTH];
  const x = scalePoint().domain(xDomain).range(xRange).padding(1);

  const yDomain = [0, max(data[transitionState.value.current], d => d.value)!];
  const yRange = [0, GRAPH_HEIGHT];
  const y = scaleLinear().domain(yDomain).range(yRange);
  const animationState = useSharedValue(0);

  const graphPath = useDerivedValue(() => {
    const newPath = Skia.Path.Make();
    data[transitionState.value.current].forEach((point: DataPoint) => {
      const rect = Skia.XYWHRect(
        (x(point.label) as number) - GRAPH_BAR_WIDTH / 2,
        GRAPH_HEIGHT,
        GRAPH_BAR_WIDTH,
        y(point.value * -animationState.value),
      );

      const roundedRect = Skia.RRectXY(rect, 8, 8);
      newPath.addRRect(roundedRect);
    });
    return newPath;
  }, [animationState, transitionState]);

  const onShow = () => {
    animationState.value = withTiming(1, {
      duration: 1500,
      easing: Easing.inOut(Easing.exp),
    });
  };

  const onChange = (target: number) => {
    animationState.value = withTiming(
      0,
      {
        duration: 750,
        easing: Easing.inOut(Easing.exp),
      },
      () => {
        transitionState.value = {
          current: target,
          next: transitionState.value.current,
        };
        animationState.value = 0;

        animationState.value = withTiming(1, {
          duration: 750,
          easing: Easing.inOut(Easing.exp),
        });
      },
    );
  };

  if (!font) {
    return <View />;
  }

  return (
    <View>
      <View style={styles.row}>
        <Button onPress={() => onChange(0)} text="2021" />
        <Button onPress={() => onChange(1)} text="2022" />
        <Button onPress={() => onChange(2)} text="2023" />
      </View>
      <Canvas style={styles.canvas}>
        <Line strokeWidth={2} color="white" p1={point(0, 0)} p2={point(0, GRAPH_HEIGHT)} />
        <Line
          strokeWidth={1}
          color="white"
          p1={point(0, GRAPH_HEIGHT)}
          p2={point(GRAPH_WIDTH, GRAPH_HEIGHT)}
        />
        <Path path={graphPath} color="white" />
        {data[transitionState.value.current].map((point: DataPoint) => {
          const textWidth = 50; // font.getTextWidth(point.label);
          return (
            <Text
              key={point.label}
              x={(x(point.label) as number) - textWidth / 2}
              y={GRAPH_HEIGHT + 20}
              text={point.label}
              font={font}
              color="white"
            />
          );
        })}
      </Canvas>
      <Button onPress={onShow} text="Show" />
    </View>
  );
};

const styles = StyleSheet.create({
  canvas: {
    height: CANVAS_HEIGHT,
    width: CANVAS_WIDTH,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    alignSelf: 'center',
    marginBottom: 16,
  },
});
