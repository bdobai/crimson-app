import { Pressable, StyleSheet, Text, View } from 'react-native';

import LottieView from 'lottie-react-native';

import { Category } from '../types/category';

type Props = {
  category: Category;
  onPress: (category: Category) => void;
};

export const CategoryItem = ({ category, size, onPress }: Props) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress(category)}>
      <LottieView autoPlay source={category.animation} style={styles.animation} />
      <Text style={styles.title}>{category.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(18, 44, 61)',
    borderRadius: 16,
    marginBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  animation: {
    width: 100,
    height: 100,
  },
});
