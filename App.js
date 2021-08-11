import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import FAB from './src/FAB/FAB';
import SubButton from './src/SubButton/SubButton';

const App = () => {
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  return (
    <SafeAreaView style={styles.root}>
      <FAB position={{ x: xPosition, y: yPosition }} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
