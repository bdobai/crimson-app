import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { BarChart } from '@animations/components/bar-chart';
import { Chart } from '@animations/components/chart';
import { Graph } from '@animations/components/graph';

export default function Graphs() {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        snapToInterval={Dimensions.get('window').width}
        snapToAlignment="center"
        scrollEventThrottle={1}
      >
        <View style={styles.slide}>
          <Graph />
        </View>
        <View style={styles.slide}>
          <Chart />
        </View>
        <View style={styles.slide}>
          <BarChart />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(13,34,47)',
  },
  slide: {
    width: Dimensions.get('window').width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
