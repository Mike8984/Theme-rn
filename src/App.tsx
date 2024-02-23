import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SettingsScreen from './screens/SettingsScreen'

function App(): JSX.Element {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsScreen />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

export default App
