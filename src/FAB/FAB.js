import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FAB_BACKGROUND_COLOR, FAB_BORDER_RADIUS, FAB_HEIGHT, FAB_WIDTH } from '../Constants'

const FAB = (props) => {
    
    const startingStyles = {
        width: FAB_WIDTH,
        height: FAB_HEIGHT,
        borderRadius: FAB_BORDER_RADIUS,
        backgroundColor: FAB_BACKGROUND_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 30,
        right: 30,
    }

    return (
        <View style={startingStyles}>
            <Text style={styles.plus}>+</Text>
        </View>
    )
}

export default FAB

const styles = StyleSheet.create({
    plus: {
        fontSize: 36,
        color: '#EFFBFA',
    }
})
