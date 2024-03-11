import { Dimensions } from 'react-native';

const CONTENT_WIDTH = Dimensions.get('window').width - 32;
export const IMAGE_SIZE = CONTENT_WIDTH * 0.45;
export const GAP = CONTENT_WIDTH * 0.1;

export const SCROLL_HEIGHT_THRESHOLD = IMAGE_SIZE;

export const getRowsNumber = (items: string[]) => Math.ceil(items.length / 2);

export const getPosition = (index: number, itemWidth: number) => {
  'worklet';
  return {
    x: (index % 2) * (IMAGE_SIZE + GAP) + GAP / 2,
    y: Math.floor(index / 2) * (IMAGE_SIZE + GAP),
  };
};

export const getOrder = (x: number, y: number, itemWidth: number) => {
  'worklet';
  const row = Math.round(y / (IMAGE_SIZE + GAP));
  const column = Math.round(x / (IMAGE_SIZE + GAP));
  return row * 2 + column;
};
