import React, { useState, useRef } from 'react';
import { View, Dimensions, PanResponder, Alert } from 'react-native';
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
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    )
  );
  const [piecePosition, setPiecePosition] = useState({ x: CELL_SIZE * 3, y: CELL_SIZE * 9 });
  const [placed, setPlaced] = useState(false);
  const shape = useRef(pieceShapes[Math.floor(Math.random() * pieceShapes.length)]).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        if (!placed) {
          setPiecePosition({
            x: CELL_SIZE * 3 + gesture.dx,
            y: CELL_SIZE * 9 + gesture.dy
          });
        }
      },
      onPanResponderRelease: () => {
        if (!placed) {
          const gridX = Math.floor(piecePosition.x / CELL_SIZE);
          const gridY = Math.floor(piecePosition.y / CELL_SIZE);
          if (canPlaceShape(shape, gridX, gridY)) {
            const newGrid = [...grid];
            shape.forEach((row, rowIndex) => {
              row.forEach((value, colIndex) => {
                if (value === 1) {
                  const x = gridX + colIndex;
                  const y = gridY + rowIndex;
                  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
                    newGrid[y][x] = '#f39c12';
                  }
                }
              });
            });
            setGrid(newGrid);
            setPlaced(true);
            Alert.alert('Placed!', 'The piece has been placed on the grid.');
          } else {
            Alert.alert('Invalid Move', 'Cannot place piece here.');
            setPiecePosition({ x: CELL_SIZE * 3, y: CELL_SIZE * 9 });
          }
        }
      }
    })
  ).current;

  const canPlaceShape = (shape, gridX, gridY) => {
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col] === 1) {
          const x = gridX + col;
          const y = gridY + row;
          if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE || grid[y][x] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} {...panResponder.panHandlers}>
      <Svg height="100%" width="100%">
        {grid.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            color && (
              <Block
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * CELL_SIZE}
                y={rowIndex * CELL_SIZE}
                size={CELL_SIZE}
                color={color}
              />
            )
          ))
        )}
        {!placed && (
          <GamePiece
            shape={shape}
            startX={piecePosition.x}
            startY={piecePosition.y}
            cellSize={CELL_SIZE}
          />
        )}
      </Svg>
    </View>
  );
}

// src/components/Block.js
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

// src/components/GamePiece.js
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
