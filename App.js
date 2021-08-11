import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import FAB from './src/FAB/FAB'
import SubButton from './src/SubButton/SubButton'

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <FAB />
      <SubButton backgroundColor='#6adcd1' label='3' />
      <SubButton backgroundColor='#6adcd1' label='2' />
      <SubButton backgroundColor='#6adcd1' label='1' />
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create({
  root: {
    flex: 1,    
  }
})
