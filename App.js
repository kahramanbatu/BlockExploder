import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import GameScreen from './src/screens/GameScreen';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <GameScreen />
      <StatusBar style="auto" />
    </View>
  );
}
