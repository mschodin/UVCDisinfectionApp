import React, { useState } from "react";
import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
// import { BleManager } from "react-native-ble-plx";

class Connect extends React.Component {

    constructor(){
        super();
        this.manager = new BleManager();
        this.state = {
            nameOfDevice: 'unassigned'
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
                this.manager.stopDeviceScan();
            }
        });
    }

    render () {
        return (
            <Text>
                {this.state.nameOfDevice}
            </Text>
        );
    }
}

export default Connect;