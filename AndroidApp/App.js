import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';

export default function App() {
    const [v, setVar] = useState("00:00");
    const [count, setCount] = useState(0);
    function handlePress() {
        setCount(5);
    }
    return (
        <View style={styles.container}>
            <View style={styles.timebox}>
                <Text
                    style={styles.timeboxText}>
                    {v}
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
        width: "15vh",
        height: "15vh",
        marginTop: "40vh",
        backgroundColor: '#ccf5ff',
        borderRadius: "15vh",
    },
    buttonText: {
        color: "#000000",
        fontSize: "1.5vh",
        // fontFamily: "Roboto",
    },
    timebox: {
        backgroundColor: "#600080",
        width: '60vw',
        height: '10vh',
        justifyContent: 'center',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: '10vh',
        alignItems: 'center',
        borderRadius: '20px',
    },
    timeboxText: {
        // fontFamily: 'Roboto',
        color: 'white',
        fontSize: '5vh',
        fontWeight: 'bold',
    },
});
