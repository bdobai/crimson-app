import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { DataPoint, animatedData, originalData } from '@animations/helpers/data';
import { Canvas, Line, Path, SkPath, Skia, vec } from '@shopify/react-native-skia';
import { curveBasis, line, scaleLinear, scaleTime } from 'd3';

import { Button } from '@app/components/button';

type Props = object;

type GraphData = {
  min: number;
  max: number;
  curve: SkPath;
};

const GRAPH_HEIGHT = 320;
const GRAPH_WIDTH = Dimensions.get('window').width - 48;

export const Graph = (props: Props) => {
  const isTransitionCompleted = useSharedValue(1);
  const transitionState = useSharedValue({
    currentChart: 0,
    nextChart: 1,
  });

  const makeGraph = (data: DataPoint[]): GraphData => {
    const min = Math.min(...data.map(d => d.value));
    const max = Math.max(...data.map(d => d.value));

    const getXAxis = scaleTime()
      .domain([new Date(2000, 1, 1), new Date(2000, 1, 15)])
      .range([10, GRAPH_WIDTH - 10]);
    const getYAxis = scaleLinear().domain([0, max]).range([GRAPH_HEIGHT, 35]);

    const curvedLine = line<DataPoint>()
      .x(d => getXAxis(new Date(d.date)))
      .y(d => getYAxis(d.value))
      .curve(curveBasis)(data);

    const skPath = Skia.Path.MakeFromSVGString(curvedLine!);

    return {
      min,
      max,
      curve: skPath!,
    };
  };

  const graphData = [makeGraph(originalData), makeGraph(animatedData)];

  const transitionCharts = (target: number) => {
    transitionState.value = {
      currentChart: target,
      nextChart: transitionState.value.currentChart,
    };
    isTransitionCompleted.value = 0;

    isTransitionCompleted.value = withTiming(1, {
      duration: 1000,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const currentPath = useDerivedValue(() => {
    const start = graphData[transitionState.value.currentChart].curve;
    const end = graphData[transitionState.value.nextChart].curve;
    const result = start.interpolate(end, isTransitionCompleted.value);

    return result?.toSVGString() ?? '';
  }, [transitionState, isTransitionCompleted]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button onPress={() => transitionCharts(1)} text="Graph1" />
        <Button onPress={() => transitionCharts(0)} text="Graph2" />
      </View>
      <Canvas style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}>
        <Line strokeWidth={1} color="red" p1={vec(0, 100)} p2={vec(GRAPH_WIDTH, 100)} />
        <Line strokeWidth={1} color="red" p1={vec(0, 200)} p2={vec(GRAPH_WIDTH, 200)} />
        <Line strokeWidth={1} color="red" p1={vec(0, 300)} p2={vec(GRAPH_WIDTH, 300)} />
        <Path path={currentPath} strokeWidth={4} style="stroke" color="white" />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
});
