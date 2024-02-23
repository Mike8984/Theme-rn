import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import {
  Appearance,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  themeSwitch: string
  setThemeSwitch: Dispatch<SetStateAction<string>>
  theme: string | null | undefined
  setTheme: Dispatch<SetStateAction<string | null | undefined>>
}

const Switch: FC<Props> = ({
  themeSwitch,
  setThemeSwitch,
  theme,
  setTheme,
}) => {
  const colorScheme = Appearance.getColorScheme()
  const { width } = useWindowDimensions()
  const SWITCH_CONTAINER_WIDTH = width * 0.8
  const SWITCH_WIDTH = (width * 0.8) / 3
  const translateX = useSharedValue(SWITCH_WIDTH * 0)

  const translateAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  useEffect(() => {
    if (themeSwitch === 'system') {
      translateX.value = withSpring(SWITCH_WIDTH * 0)
    } else if (themeSwitch === 'light') {
      translateX.value = withSpring(SWITCH_WIDTH * 1)
    } else if (themeSwitch === 'dark') {
      translateX.value = withSpring(SWITCH_WIDTH * 2)
    }
  }, [SWITCH_WIDTH, themeSwitch, translateX])

  const backgroundColorAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme === 'dark' ? withTiming('black') : withTiming('#F0F0F0'),
    }
  })

  const textColorAnimation = useAnimatedStyle(() => {
    return {
      color: theme === 'dark' ? withTiming('white') : withTiming('black'),
    }
  })

  const backgroundColorSlideAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme === 'dark' ? withTiming('#22272B') : withTiming('white'),
    }
  })

  return (
    <Animated.View
      style={[
        styles.container,
        { width: SWITCH_CONTAINER_WIDTH },
        backgroundColorAnimation,
      ]}>
      <Animated.View
        style={[
          styles.slideContainer,
          { width: SWITCH_WIDTH },
          translateAnimation,
        ]}>
        <Animated.View style={[styles.slide, { width: (width * 0.7) / 3 }, backgroundColorSlideAnimation]} />
      </Animated.View>
      <Pressable
        style={styles.button}
        onPress={() => {
          setThemeSwitch('system')
          if (colorScheme) {
            setTheme(colorScheme)
          }
        }}>
        <Animated.Text style={[styles.buttonText, textColorAnimation]}>
          System
        </Animated.Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          setThemeSwitch('light')
          setTheme('light')
        }}>
        <Animated.Text style={[styles.buttonText, textColorAnimation]}>
          Light
        </Animated.Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          setThemeSwitch('dark')
          setTheme('dark')
        }}>
        <Animated.Text style={[styles.buttonText, textColorAnimation]}>
          Dark
        </Animated.Text>
      </Pressable>
    </Animated.View>
  )
}

export default Switch

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    marginTop: 20,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    overflow: 'hidden',
  },

  button: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#000',
    fontWeight: '500',
  },

  slideContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },

  slide: {
    backgroundColor: 'white',
    padding: 23,
    borderRadius: 100,
  },
})
