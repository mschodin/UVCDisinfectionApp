import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import { BleManager } from "react-native-ble-plx";

class Control extends React.Component {

    constructor(){
        super();
        this.manager = new BleManager();
        this.state = {
            nameOfDevice: 'unassigned',
            isConnected: 'Not Connected'
        };
        this.mountedMethod();
    }

    mountedMethod() {
        console.log("in mounted");
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
        }, true);
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if(error){
                return
            }
            this.setState({nameOfDevice: device.name});
            if (device.name === 'some tag') {
                this.setState({isConnected: 'Connected'});
                this.manager.stopDeviceScan();

                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        // Do work on device with services and characteristics
                    })
                    .then((error) => {
                        // Handle Errors
                    });
            }
        });
    }

    handlePress = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.timebox}>
                    <Text
                        style={styles.timeboxText}>
                        00:01
                    </Text>
                </View>
                <View style={styles.timebox}>
                    <Text
                        style={styles.timeboxText}>
                        0 in
                    </Text>
                </View>
                <View style={styles.timebox}>
                    <Text
                        style={styles.connectedText}>
                        Status: {this.state.isConnected}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.circleButton}
                    onPress={this.handlePress}
                >
                    <Text style={styles.buttonText}>
                        Start/Stop
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
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
        marginTop: "20%",
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
    connectedText: {
        // fontFamily: 'Roboto',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});


export default Control;