import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  Easing,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Canvas, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';

const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const GRAPH_WIDTH = 50;
const X_POSITION = 25;
const ITEM_HEIGHT = 80;
const ITEM_MARGIN = 20;

const LINE_HEIGHT = 100;
const CIRCLE_RADIUS = 15;

const FIRST_LINE = LINE_HEIGHT / 2 - CIRCLE_RADIUS;

export default function Steps() {
  const path = Skia.Path.Make();
  const [selected, setSelected] = useState<number>(-1);

  // path.addCircle(X_POSITION, -2 * CIRCLE_RADIUS, CIRCLE_RADIUS);
  // path.moveTo(X_POSITION, 0);
  // path.lineTo(X_POSITION, FIRST_LINE);

  // path.addCircle(X_POSITION, FIRST_LINE + CIRCLE_RADIUS + 0 * LINE_HEIGHT, CIRCLE_RADIUS);

  data.forEach((_, index) => {
    path.addCircle(X_POSITION, FIRST_LINE + CIRCLE_RADIUS + index * LINE_HEIGHT, CIRCLE_RADIUS);
    path.moveTo(X_POSITION, FIRST_LINE + 2 * CIRCLE_RADIUS + index * LINE_HEIGHT);
    path.lineTo(
      X_POSITION,
      FIRST_LINE + 2 * CIRCLE_RADIUS + index * LINE_HEIGHT + LINE_HEIGHT - 2 * CIRCLE_RADIUS,
    );
  });

  const animationState = useSharedValue(0);

  const animateChart = () => {
    console.log(selected / data.length);
    animationState.value = withTiming((selected + 1) / data.length, {
      duration: 1000,
      easing: Easing.linear,
    });
  };

  useEffect(() => {
    if (selected === -1) {
      return;
    }
    animateChart();
  }, [selected]);

  const Item = (props: { index: number }) => {
    return (
      <Pressable style={styles.itemContainer} onPress={() => setSelected(props.index)}>
        <Text style={styles.task}>Task number {props.index}</Text>
        <View style={styles.circle}>
          {selected >= props.index && (
            <View style={[styles.circle, { backgroundColor: 'rgb(101,212,110)' }]} />
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <Canvas style={{ width: GRAPH_WIDTH, height: '100%' }}>
          <Path path={path} color="rgb(200, 200, 200)" style="stroke" strokeWidth={4} end={1}>
            <LinearGradient
              start={vec(100, 0)}
              end={vec(100, LINE_HEIGHT + 2 * CIRCLE_RADIUS + LINE_HEIGHT * data.length - 1)}
              colors={['rgb(200, 200, 200)', 'rgb(200, 200, 200)']}
            />
          </Path>
          <Path path={path} color="blue" style="stroke" strokeWidth={4} end={animationState}>
            <LinearGradient
              start={vec(100, 0)}
              end={vec(100, LINE_HEIGHT + 2 * CIRCLE_RADIUS + LINE_HEIGHT * data.length)}
              colors={['#DC143C', 'blue']}
            />
          </Path>
        </Canvas>
        <View style={{ flex: 1, marginLeft: 16, marginTop: CIRCLE_RADIUS / 2 }}>
          {data.map((_: number, index: number) => (
            <Item key={index} index={index} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'rgb(13,34,47)',
  },
  container: {
    width: '100%',
    paddingHorizontal: 24,
    flexDirection: 'row',
    backgroundColor: 'rgb(13,34,47)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
  },
  itemContainer: {
    backgroundColor: 'rgb(18, 44, 61)',
    shadowColor: 'black',
    width: 'auto',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: ITEM_HEIGHT,
    marginBottom: ITEM_MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  task: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
