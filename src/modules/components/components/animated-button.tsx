import React from 'react';
import { StyleSheet, Text, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  type?: 'primary' | 'secondary';
  onPress: () => void;
  children?: React.ReactNode;
};

export const Button = (props: Props) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);

  const aRef = useAnimatedRef<Animated.View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);

  const getStyle = (): ViewStyle => {
    switch (props.type) {
      case 'primary':
        return styles.primary;
      case 'secondary':
        return styles.secondary;
      default:
        return styles.primary;
    }
  };

  const renderContent = () => {
    if (typeof props.children === 'string') {
      return <Text style={styles.text}>{props.children}</Text>;
    }
    return props.children;
  };

  const tap = Gesture.Tap()
    .onStart(tapEvent => {
      const layout = measure(aRef);
      width.value = layout?.width ?? 0;
      height.value = layout?.height ?? 0;
      console.log(layout);

      centerX.value = tapEvent.x;
      centerY.value = tapEvent.y;

      rippleOpacity.value = 1;
      scale.value = 0;
      scale.value = withTiming(10, { duration: 1000 });
    })
    .onEnd(() => {
      rippleOpacity.value = withTiming(0);
    });

  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);

    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: props.type !== 'secondary' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      transform: [
        { translateX },
        { translateY },
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View ref={aRef} style={[getStyle(), { overflow: 'hidden' }]}>
        {renderContent()}
        <Animated.View style={rStyle} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#DC143C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  primary: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'black',
    marginVertical: 8,
  },
  secondary: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'white',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'black',
  },
});
