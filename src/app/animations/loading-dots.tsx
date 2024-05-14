import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AnimatedXYDot } from '@animations/components/animated-xy-dot';
import { AnimatedYDot } from '@animations/components/animated-y-dot';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <AnimatedYDot delay={0} />
        <AnimatedYDot delay={300} />
        <AnimatedYDot delay={600} />
      </View>
      <View style={styles.row}>
        <AnimatedXYDot corner="B" delay={0} />
        <AnimatedXYDot corner="A" delay={0} />
        <AnimatedXYDot corner="C" delay={0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgb(13,34,47)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});
