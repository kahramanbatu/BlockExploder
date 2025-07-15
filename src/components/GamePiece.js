import React from 'react';
import { G } from 'react-native-svg';
import Block from './Block';

export default function GamePiece({ shape, startX, startY, cellSize }) {
  return (
    <G>
      {shape.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          if (value === 1) {
            return (
              <Block
                key={`${rowIndex}-${colIndex}`}
                x={startX + colIndex * cellSize}
                y={startY + rowIndex * cellSize}
                size={cellSize}
                color="#f39c12"
              />
            );
          }
          return null;
        })
      )}
    </G>
  );
}
