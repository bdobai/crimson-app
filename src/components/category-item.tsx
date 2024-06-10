import { Pressable, StyleSheet, Text } from 'react-native';

import { Category } from '../types/category';

type Props = {
  category: Category;
  onPress: (category: Category) => void;
};

export const CategoryItem = ({ category, onPress }: Props) => {
  return (
    <Pressable style={styles.container} onPress={() => onPress(category)}>
      <Text style={styles.title}>{category.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'rgb(18, 44, 61)',
    borderRadius: 16,
    marginBottom: 16,
    paddingLeft: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 16,
  },
  animation: {
    width: 100,
    height: 100,
  },
});
