import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default function App() {
    // const [v, setVar] = useState("00:00");
    // const [count, setCount] = useState(0);
    function handlePress() {
        // setCount(5);
    }
    return (
        <View style={styles.container}>
            <View style={styles.timebox}>
                <Text
                    style={styles.timeboxText}>
                    00:00
                </Text>
            </View>
            <View style={styles.timebox}>
                <Text
                    style={styles.timeboxText}>
                    0 in
                </Text>
            </View>
            <TouchableOpacity
                style={styles.circleButton}
                onPress={handlePress}
            >
                <Text style={styles.buttonText}>
                    Start/Stop
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
    },
    circleButton: {
        borderWidth: 1,
        borderColor: '#e6e6e6',
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 100,
        marginTop: "70%",
        backgroundColor: '#ccf5ff',
        borderRadius: 50,
    },
    buttonText: {
        color: "#000000",
        fontSize: 20,
        // fontFamily: "Roboto",
    },
    timebox: {
        backgroundColor: "#600080",
        width: '60%',
        height: '10%',
        justifyContent: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: '25%',
        alignItems: 'center',
        borderRadius: 20,
    },
    timeboxText: {
        // fontFamily: 'Roboto',
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
});
