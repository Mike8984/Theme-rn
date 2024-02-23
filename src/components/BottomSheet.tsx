import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react'
import { StyleSheet, useWindowDimensions } from 'react-native'
import BackDrop from './BackDrop'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import Switch from './Switch'
import Icon from './Icon'

type Props = {
  themeSwitch: string
  setThemeSwitch: Dispatch<SetStateAction<string>>
  theme: string | null | undefined
  setTheme: Dispatch<SetStateAction<string | null | undefined>>
}

export interface BottomSheetMethods {
  open: () => void
  close: () => void
}

const BottomSheet = forwardRef<BottomSheetMethods, Props>(
  ({ themeSwitch, setThemeSwitch, theme, setTheme }, ref) => {
    const insets = useSafeAreaInsets()
    const { width } = useWindowDimensions()
    const [bottomSheetHeight, setBottomSheetHeight] = useState(1000)
    const OPEN = 0
    const CLOSE = bottomSheetHeight + insets.bottom
    const translateY = useSharedValue(CLOSE)

    const open = useCallback(() => {
      translateY.value = withTiming(OPEN)
    }, [translateY])

    const close = useCallback(() => {
      translateY.value = withTiming(CLOSE)
    }, [CLOSE, translateY])

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
      }),
      [open, close],
    )

    const animationStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }))

    const backgroundColorAnimation = useAnimatedStyle(() => {
      return {
        backgroundColor:
          theme === 'dark' ? withTiming('#22272B') : withTiming('white'),
      }
    })

    const lineColorAnimation = useAnimatedStyle(() => {
      return {
        backgroundColor:
          theme === 'dark' ? withTiming('white') : withTiming('black'),
      }
    })

    const textColorAnimation = useAnimatedStyle(() => {
      return {
        color: theme === 'dark' ? withTiming('white') : withTiming('black'),
      }
    })

    const pan = Gesture.Pan()
      .onUpdate(event => {
        if (event.translationY < 0) {
          translateY.value = withSpring(OPEN, {
            damping: 100,
            stiffness: 400,
          })
        } else {
          translateY.value = withSpring(event.translationY, {
            damping: 100,
            stiffness: 400,
          })
        }
      })
      .onEnd(() => {
        if (translateY.value > 50) {
          translateY.value = withSpring(CLOSE, {
            damping: 100,
            stiffness: 400,
          })
        } else {
          translateY.value = withSpring(OPEN, {
            damping: 100,
            stiffness: 400,
          })
        }
      })

    return (
      <>
        <BackDrop
          translateY={translateY}
          openHeight={OPEN}
          closeHeight={CLOSE}
          close={close}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            onLayout={({ nativeEvent }) => {
              const { height } = nativeEvent.layout
              if (height) {
                setBottomSheetHeight(height)
              }
            }}
            style={[
              styles.container,
              { width: width * 0.92, bottom: insets.bottom },
              animationStyle,
              backgroundColorAnimation,
            ]}>
            <Animated.View style={[styles.line, lineColorAnimation]} />
            <Icon theme={theme} />
            <Animated.Text style={[styles.title, textColorAnimation]}>
              Choose a style
            </Animated.Text>
            <Animated.Text style={[styles.text, textColorAnimation]}>
              Pop or subtle. Day or night
            </Animated.Text>
            <Animated.Text style={[styles.text, textColorAnimation]}>
              Customize your interface
            </Animated.Text>
            <Switch
              themeSwitch={themeSwitch}
              setThemeSwitch={setThemeSwitch}
              theme={theme}
              setTheme={setTheme}
            />
          </Animated.View>
        </GestureDetector>
      </>
    )
  },
)

export default BottomSheet

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderRadius: 30,
  },

  line: {
    position: 'absolute',
    top: 8,
    width: 40,
    height: 4,
    borderRadius: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 14,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
})
