import React from 'react';

import {
  Alert,
  Image,
  Text,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import FAB from './src/FAB/FAB';
import SubButton from './src/FAB/SubButton';

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
        <FAB>
          <SubButton onPress={() => Alert.alert('Pressed 1!')} label="1" />
          <SubButton onPress={() => Alert.alert('Pressed 2!')} label="2" />
          <SubButton onPress={() => Alert.alert('Pressed 3!')} label="3" />
          <SubButton onPress={() => Alert.alert('Pressed 4!')} label="4" />
        </FAB>
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
