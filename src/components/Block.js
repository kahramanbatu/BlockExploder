import React from 'react';
import { Rect } from 'react-native-svg';

export default function Block({ x, y, size, color }) {
  return (
    <Rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill={color}
      stroke="black"
      strokeWidth="1"
      rx="5"
      ry="5"
    />
  );
}
