import React, { useEffect, useState } from 'react';

import {
  StyleSheet,
  useWindowDimensions,
  DeviceEventEmitter,
} from 'react-native';

import {
  FAB_BACKGROUND_COLOR,
  FAB_BORDER_RADIUS,
  FAB_HEIGHT,
  FAB_WIDTH,
  FAB_MARGIN,
  FAB_CHILDREN_OPACITY_OPEN,
  FAB_CHILDREN_POSITION_Y_OPEN,
  FAB_CHILDREN_OPACITY_CLOSE,
  FAB_CHILDREN_POSITION_Y_CLOSE,
  FAB_ROTATION_CLOSE,
  FAB_ROTATION_OPEN,
  FAB_STARTING_POSITION,
  PLUS_TRANSLATE_Y_OPEN,
  PLUS_TRANSLATE_Y_CLOSE,
  SUBBTN_TAP_EVENT,
} from './Constants';

import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const FAB = props => {
  const [opened, setOpened] = useState(false);

  const { width } = useWindowDimensions();
  const { children } = props;

  const fabPositionX = useSharedValue(0);
  const fabPositionY = useSharedValue(0);
  const childrenYPosition = useSharedValue(FAB_CHILDREN_POSITION_Y_CLOSE);
  const childrenOpacity = useSharedValue(FAB_CHILDREN_OPACITY_CLOSE);
  const fabRotation = useSharedValue(FAB_ROTATION_CLOSE);
  const plusTranslateY = useSharedValue(PLUS_TRANSLATE_Y_CLOSE);

  const _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      opened ? _close() : _open();
    }
  };

  const _onPanHandlerStateChange = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = fabPositionX.value;
      ctx.startY = fabPositionY.value;
    },
    onActive: (event, ctx) => {
      fabPositionX.value = ctx.startX + event.translationX;
      fabPositionY.value = ctx.startY + event.translationY;
    },
    onEnd: _ => {
      if (fabPositionX.value > -width / 2) {
        fabPositionX.value = withSpring(FAB_STARTING_POSITION);
        fabPositionY.value = withSpring(FAB_STARTING_POSITION);
      } else {
        fabPositionX.value = withSpring(-width + FAB_WIDTH + FAB_MARGIN * 2);
        fabPositionY.value = withSpring(FAB_STARTING_POSITION);
      }
    },
  });

  const animatedRootStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: fabPositionX.value },
        { translateY: fabPositionY.value },
      ],
    };
  });

  const animatedChildrenStyles = useAnimatedStyle(() => {
    return {
      opacity: childrenOpacity.value,
      transform: [{ translateY: childrenYPosition.value }],
    };
  });

  const animatedFABStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${fabRotation.value}deg` }],
    };
  });

  const animatedPlusText = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: plusTranslateY.value }],
    };
  });

  function _open() {
    setOpened(true);
    childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_OPEN, {
      duration: 300,
    });
    childrenYPosition.value = withTiming(FAB_CHILDREN_POSITION_Y_OPEN, {
      duration: 200,
    });
    fabRotation.value = withSpring(FAB_ROTATION_OPEN);
    plusTranslateY.value = withSpring(PLUS_TRANSLATE_Y_OPEN);
  }

  function _close() {
    childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_CLOSE, {
      duration: 300,
    });
    childrenYPosition.value = withTiming(FAB_CHILDREN_POSITION_Y_CLOSE, {
      duration: 300,
    });
    fabRotation.value = withSpring(FAB_ROTATION_CLOSE);
    plusTranslateY.value = withSpring(PLUS_TRANSLATE_Y_CLOSE);
    setTimeout(() => {
      setOpened(false);
    }, 300);
  }

  useEffect(() => {
    let listener = DeviceEventEmitter.addListener(SUBBTN_TAP_EVENT, () => {
      _close();
    });
    return () => listener.remove();
  }, []);

  return (
    <PanGestureHandler onHandlerStateChange={_onPanHandlerStateChange}>
      <Animated.View style={[styles.rootStyles, animatedRootStyles]}>
        {opened && (
          <Animated.View
            style={[styles.childrenStyles, animatedChildrenStyles]}>
            {children}
          </Animated.View>
        )}
        <TapGestureHandler onHandlerStateChange={_onTapHandlerStateChange}>
          <Animated.View style={[styles.fabButtonStyles, animatedFABStyles]}>
            <Animated.Text style={[styles.plus, animatedPlusText]}>
              +
            </Animated.Text>
          </Animated.View>
        </TapGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default FAB;

const styles = StyleSheet.create({
  rootStyles: {
    borderRadius: FAB_BORDER_RADIUS,
    position: 'absolute',
    bottom: FAB_MARGIN,
    right: FAB_MARGIN,
  },
  fabButtonStyles: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FAB_BACKGROUND_COLOR,
    width: FAB_WIDTH,
    height: FAB_HEIGHT,
    borderRadius: FAB_BORDER_RADIUS,
  },
  childrenStyles: {
    width: FAB_WIDTH,
    alignItems: 'center',
    marginBottom: 20,
  },
  plus: {
    fontSize: 36,
    color: '#EFFBFA',
  },
});
