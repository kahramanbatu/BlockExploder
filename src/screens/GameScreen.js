import React, { useState, useRef } from 'react';
import { View, Dimensions, PanResponder } from 'react-native';
import Svg from 'react-native-svg';
import GamePiece from '../components/GamePiece';
import Block from '../components/Block';

const { width } = Dimensions.get('window');
const GRID_SIZE = 9;
const CELL_SIZE = Math.floor(width / GRID_SIZE);

const pieceShapes = [
  [[1]],
  [[1, 1]],
  [[1], [1]],
  [[1, 1], [1, 1]],
  [[1, 0], [1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1, 1]],
  [[1], [1], [1]]
];

export default function GameScreen() {
  const [grid] = useState(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ color: '#334455' }))
    )
  );
  const [piecePosition, setPiecePosition] = useState({ x: CELL_SIZE * 3, y: CELL_SIZE * 9 });
  const randomShape = useRef(pieceShapes[Math.floor(Math.random() * pieceShapes.length)]).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        setPiecePosition({
          x: CELL_SIZE * 3 + gesture.dx,
          y: CELL_SIZE * 9 + gesture.dy
        });
      },
      onPanResponderRelease: () => {
        // Here we will handle drop logic later
      }
    })
  ).current;

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} {...panResponder.panHandlers}>
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
        <GamePiece
          shape={randomShape}
          startX={piecePosition.x}
          startY={piecePosition.y}
          cellSize={CELL_SIZE}
        />
      </Svg>
    </View>
  );
}
