import React, { useState, useRef, useEffect } from 'react';
import { View, Dimensions, PanResponder, Alert, Text } from 'react-native';
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
  const [pieceQueue, setPieceQueue] = useState(generatePieceQueue());
  const [pieceIndex, setPieceIndex] = useState(0);
  const [piecePosition, setPiecePosition] = useState({ x: CELL_SIZE * 3, y: CELL_SIZE * 9 });
  const [placed, setPlaced] = useState(false);
  const [score, setScore] = useState(0);

  function generateRandomShape() {
    return pieceShapes[Math.floor(Math.random() * pieceShapes.length)];
  }

  function generatePieceQueue() {
    return [generateRandomShape(), generateRandomShape(), generateRandomShape()];
  }

  const currentShape = pieceQueue[pieceIndex];

  useEffect(() => {
    if (placed) {
      setTimeout(() => {
        clearFullLines();
        if (pieceIndex === 2) {
          setPieceQueue(generatePieceQueue());
          setPieceIndex(0);
        } else {
          setPieceIndex(pieceIndex + 1);
        }
        setPiecePosition({ x: CELL_SIZE * 3, y: CELL_SIZE * 9 });
        setPlaced(false);
      }, 300);
    }
  }, [placed]);

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
          if (canPlaceShape(currentShape, gridX, gridY)) {
            const newGrid = [...grid];
            currentShape.forEach((row, rowIndex) => {
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

  const clearFullLines = () => {
    let newGrid = [...grid];
    let linesCleared = 0;

    // Satır temizleme
    newGrid = newGrid.filter(row => {
      const full = row.every(cell => cell !== null);
      if (full) linesCleared++;
      return !full;
    });

    while (newGrid.length < GRID_SIZE) {
      newGrid.unshift(Array(GRID_SIZE).fill(null));
    }

    // Sütun temizleme
    for (let col = 0; col < GRID_SIZE; col++) {
      const isFull = newGrid.every(row => row[col] !== null);
      if (isFull) {
        linesCleared++;
        for (let row = 0; row < GRID_SIZE; row++) {
          newGrid[row][col] = null;
        }
      }
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 10);
    }
    setGrid(newGrid);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a' }} {...panResponder.panHandlers}>
      <Text style={{ color: 'white', fontSize: 18, padding: 10 }}>Score: {score}</Text>
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
            shape={currentShape}
            startX={piecePosition.x}
            startY={piecePosition.y}
            cellSize={CELL_SIZE}
          />
        )}
      </Svg>
    </View>
  );
}
