import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
};

export const Button = (props: Props) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed ? { opacity: 0.6 } : {}]}
      onPress={props.onPress}
    >
      <Text style={styles.buttonText}>{props.text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    width: 90,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
