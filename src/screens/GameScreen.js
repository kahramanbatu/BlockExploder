import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import Svg from 'react-native-svg';
import Block from '../components/Block';

const { width } = Dimensions.get('window');
const GRID_SIZE = 9;
const CELL_SIZE = Math.floor(width / GRID_SIZE);

export default function GameScreen() {
  const [grid] = useState(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ color: '#334455' }))
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <Svg height="100%" width="100%">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Block
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * CELL_SIZE}
              y={rowIndex * CELL_SIZE}
              size={CELL_SIZE}
              color={cell.color}
            />
          ))
        )}
      </Svg>
    </View>
  );
}
