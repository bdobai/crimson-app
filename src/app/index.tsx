import React from 'react';
import { ListRenderItemInfo, StatusBar, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { LogoIcon } from '@app/assets/icons';
import { CategoryItem } from '@app/components/category-item';
import { Category } from '@app/types/category';

const CATEGORIES: Category[] = [
  {
    name: 'Animations',
    path: 'animations',
    animation: require('@app/assets/animations/astronaut_rocket.json'),
  },
  {
    name: 'Components',
    path: 'components',
    animation: require('@app/assets/animations/astronaut_coffee.json'),
  },
];

export default function RootLoadingPage() {
  const router = useRouter();
  const renderItem = ({ item }: ListRenderItemInfo<Category>) => (
    <CategoryItem category={item} onPress={() => router.push(`/${item.path}/`)} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView />
      <LogoIcon width={124} height={124} style={{ alignSelf: 'center' }} />
      <View style={styles.crimsonLine} />
      <View style={styles.crimsonLine2} />
      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        style={styles.list}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(13,34,47)',
  },
  list: {
    marginTop: 48,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  crimsonLine: {
    width: 8,
    height: 400,
    backgroundColor: 'rgb(117,12,4)',
    position: 'absolute',
    bottom: -200,
    left: 100,
    zIndex: 1,
    transform: [{ rotate: '-45deg' }],
  },
  crimsonLine2: {
    width: 8,
    height: 400,
    backgroundColor: 'rgb(117,12,4)',
    position: 'absolute',
    bottom: -230,
    left: 100,
    zIndex: 1,
    transform: [{ rotate: '-45deg' }],
  },
});
