import { useEffect, useRef, useState } from 'react'
import { useColorScheme, StyleSheet } from 'react-native'

import Button from '../components/Button'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import BottomSheet, { BottomSheetMethods } from '../components/BottomSheet'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

const SettingsScreen = () => {
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()
  const bottomSheetRef = useRef<BottomSheetMethods>(null)
  const [themeSwitch, setThemeSwitch] = useState<string>('system')
  const [theme, setTheme] = useState<string | null | undefined>(colorScheme)

  useEffect(() => {
    if (themeSwitch === 'system') {
      setTheme(colorScheme)
    }
  }, [colorScheme, themeSwitch])

  const backgroundColorAnimation = useAnimatedStyle(() => {
    return {
      backgroundColor:
        theme === 'dark' ? withTiming('black') : withTiming('white'),
    }
  })

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top },
        backgroundColorAnimation,
      ]}>
      <Button bottomSheetRef={bottomSheetRef} theme={theme} />
      <BottomSheet
        ref={bottomSheetRef}
        themeSwitch={themeSwitch}
        setThemeSwitch={setThemeSwitch}
        theme={theme}
        setTheme={setTheme}
      />
    </Animated.View>
  )
}

export default SettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
