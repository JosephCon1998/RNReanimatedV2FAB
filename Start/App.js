import React from 'react';
import { Image, Text, SafeAreaView, StyleSheet, View } from 'react-native';

const App = () => {
  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.watermark}>
          <Image
            source={require('./assets/renji-logo.png')}
            style={styles.companyLogo}
          />
          <Text>"React Native Reanimated v2 - Draggable FAB"</Text>
        </View>
        {/* Put FAB here! */}
      </SafeAreaView>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeAreaView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    opacity: 0.3,
    alignItems: 'center',
  },
  companyLogo: {
    width: 180,
    height: 105,
    marginBottom: 15,
  },
});
