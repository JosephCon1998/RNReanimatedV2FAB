import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  SUBBTN_BORDER_RADIUS,
  SUBBTN_HEIGHT,
  SUBBTN_WIDTH,
} from '../Constants';

const SubButton = props => {
  const { label, backgroundColor } = props;

  const startingStyles = {
    width: SUBBTN_WIDTH,
    height: SUBBTN_HEIGHT,
    borderRadius: SUBBTN_BORDER_RADIUS,
    backgroundColor: 'black',
    position: 'absolute',
    bottom: 30,
    right: 30,
  };

  return (
    <View style={[styles.subButton, startingStyles, { backgroundColor }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

export default SubButton;

const styles = StyleSheet.create({
  subButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#EFFBFA',
    fontSize: 24,
  },
});
