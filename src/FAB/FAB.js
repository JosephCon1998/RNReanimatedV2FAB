/**
 * @name FAB
 *
 * @description
 * A draggable floating action button built using React Native Reanimated v2!
 *
 * @param {children} props
 */

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
  FAB_PLUS_TRANSLATE_Y_OPEN,
  FAB_PLUS_TRANSLATE_Y_CLOSE,
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
  /**
   * Holds the state of the button being either closed / open
   */
  const [opened, setOpened] = useState(false);

  /**
   * Get the width of the screen. This hook dynamically updates
   * when the user rotates the screen too!
   */
  const { width } = useWindowDimensions();

  /**
   * Destructure the children prop for the SubButton(s)
   */
  const { children } = props;

  /**
   * (X,Y) position of the FAB. We use these
   * for keeping track of the button when dragging it.
   *
   * We also rotate the button to change the + to a x
   * when the children view is visible. The plus text is
   * also offset to accomodate for the anchor point of the
   * rotation not being in the center of the +
   */
  const fabPositionX = useSharedValue(0);
  const fabPositionY = useSharedValue(0);
  const fabRotation = useSharedValue(FAB_ROTATION_CLOSE);
  const fabPlusTranslateY = useSharedValue(FAB_PLUS_TRANSLATE_Y_CLOSE);

  /**
   * The opacity and Y position of the children container for the
   * SubButton(s). We use this to show a sliding fade in/out animation when
   * the user taps the FAB button
   */
  const childrenYPosition = useSharedValue(FAB_CHILDREN_POSITION_Y_CLOSE);
  const childrenOpacity = useSharedValue(FAB_CHILDREN_OPACITY_CLOSE);

  /**
   * Handles the release of the tap on the FAB.
   * We run the close/open function depending on the
   * state of the button.
   */
  const _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      opened ? _close() : _open();
    }
  };

  /**
   * Handles the dragging events of the FAB. This
   *
   * When we starting dragging we grab the value of where the FAB
   * currently is and store it in the context (ctx).
   *
   * Then while we're dragging we update the position of the FAB
   * with the translation value of the drag event
   *
   * Finally when we release the button, we check to see which side
   * the button is at on the screen and snap the button to the correct
   * side.
   *
   * More info on this function can be found here:
   * https://docs.swmansion.com/react-native-reanimated/docs/events#using-context
   */
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

  /**
   * The animated styles hook that is used in the
   * style prop for the root of the JSX below which holds
   * the FAB and SubButton(s). These values update depending
   * on the state of the fabPosition shared values.
   *
   * More info on the useAnimatedStyle hook here:
   * https://docs.swmansion.com/react-native-reanimated/docs/api/useAnimatedStyle
   */
  const animatedRootStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: fabPositionX.value },
        { translateY: fabPositionY.value },
      ],
    };
  });

  /**
   * The animated styles hook that is used in the
   * style prop for the children view. The opacity of the children
   * and the y-position update depending on the shared values used.
   */
  const animatedChildrenStyles = useAnimatedStyle(() => {
    return {
      opacity: childrenOpacity.value,
      transform: [{ translateY: childrenYPosition.value }],
    };
  });

  /**
   * The animated styles hook that is used in the
   * style prop for the FAB. It updates the rotation value
   * when the fabRotation shared value is changed.
   */
  const animatedFABStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${fabRotation.value}deg` }],
    };
  });

  /**
   * The animated styles hook that is used in the
   * style prop for the plus text in the FAB. It update
   * the y-position for the text when the fabPlusTranslatey shared value
   * is changed.
   */
  const animatedPlusText = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: fabPlusTranslateY.value }],
    };
  });

  /**
   * Method that runs when we want to show the SubButton(s)
   *
   * First we set the state of "opened" to true to show the
   * SubButton(s). When opened, the initial opacity and translate values
   * are set to their starting values, so we don't see the buttons yet.
   *
   * Next, we update the opacity and translation values using the withTiming
   * hook to show the SubButton(s).
   *
   * Finally, we rotate the FAB and move the plus text slightly to offset it
   * to consider the anchor point we are rotating from. We are using the useSpring
   * hook for a nice looking spring animation that is easy to use!
   */
  function _open() {
    setOpened(true);
    childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_OPEN, {
      duration: 300,
    });
    childrenYPosition.value = withTiming(FAB_CHILDREN_POSITION_Y_OPEN, {
      duration: 200,
    });
    fabRotation.value = withSpring(FAB_ROTATION_OPEN);
    fabPlusTranslateY.value = withSpring(FAB_PLUS_TRANSLATE_Y_OPEN);
  }

  /**
   * Method called when we want to hide the SubButton(s)
   *
   * This is essentially the same function as _open(), but in reverse.
   * However, we need to delay setting the opened state to false to let
   * the closing animation play out because as soon as we set that state
   * to false, the component will unmount.
   */
  function _close() {
    childrenOpacity.value = withTiming(FAB_CHILDREN_OPACITY_CLOSE, {
      duration: 300,
    });
    childrenYPosition.value = withTiming(FAB_CHILDREN_POSITION_Y_CLOSE, {
      duration: 300,
    });
    fabRotation.value = withSpring(FAB_ROTATION_CLOSE);
    fabPlusTranslateY.value = withSpring(FAB_PLUS_TRANSLATE_Y_CLOSE);
    setTimeout(() => {
      setOpened(false);
    }, 300);
  }

  /**
   * A useEffect (componentDidMount) that adds an
   * event listener to the FAB so when we tap any SubButton we close
   * the SubButton container.
   *
   * The return statement (componentWillUnmount) removes the listener.
   */
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
