import React from 'react';
import { Alert, StyleSheet, Text, useWindowDimensions } from 'react-native';

import {
  FAB_BACKGROUND_COLOR,
  FAB_BORDER_RADIUS,
  FAB_HEIGHT,
  FAB_WIDTH,
  MARGIN,
} from '../Constants';

import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const FAB = props => {
  const startingPosition = 0;
  const { width } = useWindowDimensions();

  const {
    position: { x, y },
  } = props;

  const startingStyles = {
    width: FAB_WIDTH,
    height: FAB_HEIGHT,
    borderRadius: FAB_BORDER_RADIUS,
    backgroundColor: FAB_BACKGROUND_COLOR,
    position: 'absolute',
    bottom: MARGIN,
    right: MARGIN,
  };

  function _onTapHandlerStateChange({ nativeEvent }) {
    if (nativeEvent.state === State.END) {
      Alert.alert('Pressed FAB!');
    }
  }

  const _onPanHandlerStateChange = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: _ => {
      if (x.value > -width / 2) {
        x.value = withSpring(startingPosition);
        y.value = withSpring(startingPosition);
      } else {
        x.value = withSpring(-width + FAB_WIDTH + MARGIN * 2);
        y.value = withSpring(startingPosition);
      }
    },
  });

  const animatedButtonStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }, { translateY: y.value }],
    };
  });

  return (
    <PanGestureHandler onHandlerStateChange={_onPanHandlerStateChange}>
      <Animated.View style={[startingStyles, animatedButtonStyles]}>
        <TapGestureHandler onHandlerStateChange={_onTapHandlerStateChange}>
          <Animated.View style={styles.tapGestureView}>
            <Text style={styles.plus}>+</Text>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default FAB;

const styles = StyleSheet.create({
  tapGestureView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    fontSize: 36,
    color: '#EFFBFA',
  },
});
