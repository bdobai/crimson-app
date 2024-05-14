import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@components/components/animated-button';

export default function Components() {
  return (
    <View style={styles.container}>
      <Button type="primary" onPress={() => {}}>
        Primary
      </Button>
      <Button type="secondary" onPress={() => {}}>
        Secondary
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(13,34,47)',
    paddingHorizontal: 24,
  },
});
