import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TouchableHighlight } from 'react-native';
import BluetoothSerial from 'react-native-bluetooth-serial';

const DeviceList = ({ devices, connectedId, showConnectedIcon, onDevicePress }) =>
    <View>
        <Text style={{fontSize: 40, color: '#FFFFFF', fontWeight: 'bold', paddingBottom: 20,}}>
            Connect To HC-05
        </Text>
        <View style={styles.listContainer}> 
            {devices.map((device, i) => {
                return (
                    <TouchableHighlight
                        underlayColor='#000000'
                        key={`${device.id}_${i}`}
                        style={styles.listItem} onPress={() => onDevicePress(device)}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', color: '#FFFFFF', }}>{device.name}</Text>
                                <Text style={{ color: '#FFFFFF', }}>{`<${device.id}>`}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            })}
        </View>
    </View>


class Control extends React.Component {

    constructor() {
        super();
        this.state = {
            nameOfDevice: 'unassigned',
            isConnected: 'Not Connected',
            lastWrite: 's',

            isEnabled: false,
            discovering: false,
            devices: [],
            unpairedDevices: [],
            connected: false,
            section: 0,

            msg: "",
            isRunning: false,
            runtime: 0,
            distance: 0,
            status: "Not Running"
        };
    }

    componentDidMount() {
        Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list()
        ])
            .then((values) => {
                const [isEnabled, devices] = values
                this.setState({ isEnabled, devices })
            });

        BluetoothSerial.on('bluetoothEnabled', () => console.log('Bluetooth enabled'))
        BluetoothSerial.on('bluetoothDisabled', () => console.log('Bluetooth disabled'))
        BluetoothSerial.on('error', (err) => console.log(`Error: ${err.message}`))
        BluetoothSerial.on('connectionLost', () => {
            if (this.state.device) {
                console.log(`Connection to device ${this.state.device.name} has been lost`)
            }
            this.setState({ connected: false })
        })

        BluetoothSerial.withDelimiter('\n').then(() => {
            Promise.all([
                BluetoothSerial.isEnabled(),
                BluetoothSerial.list(),
            ]).then(values => {
                const [isEnabled, devices] = values;
                this.setState({ devices });
            });
            BluetoothSerial.on('read', data => {
                if(data.data != null && data.data != " "){
                    var info = data.data.split(" ");
                    if(info[0] === "isRunning:"){
                        this.setState({
                            isRunning: (info[1].includes("true"))
                        });
                        if(this.state.isRunning){
                            this.setState({
                                status: 'Cycle Running'
                            })
                        } else {
                            this.setState({
                                status: 'Not Running'
                            })
                        }
                    } else if (info[0] === "runtime:"){
                        this.setState({
                            runtime: info[1].split("\n")
                        })
                    } else if (info[0] === "distance:"){
                        this.setState({
                            distance: info[1].split("\n")
                        })
                    } else if (info[0] === "status:"){
                        var eStatus = "";
                        if(info[1].includes("startingtoofar")){
                            eStatus = "Can't start cycle, device too far";
                        } else if (info[1].includes("startingtoofar")){
                            eStatus = "Can't start cycle, device too close";
                        } else if (info[1].includes("runningtoofar")){
                            eStatus = "Canceled cycle, device too far";
                        } else if (info[1].includes(runningtooclose)){
                            eStatus = "Canceled cycle, device too close";
                        }
                        this.setStatus({
                            status: eStatus
                        })
                    }
                }
                
            });
        });
    }


    /**
     * [android]
     * request enable of bluetooth from user
     */
    requestEnable() {
        BluetoothSerial.requestEnable()
            .then((res) => this.setState({ isEnabled: true }))
            .catch((err) => console.log(err.message))
    }

    /**
     * [android]
     * enable bluetooth on device
     */
    enable() {
        BluetoothSerial.enable()
            .then((res) => this.setState({ isEnabled: true }))
            .catch((err) => console.log(err.message))
    }

    /**
     * [android]
     * disable bluetooth on device
     */
    disable() {
        BluetoothSerial.disable()
            .then((res) => this.setState({ isEnabled: false }))
            .catch((err) => console.log(err.message))
    }

    /**
     * [android]
     * toggle bluetooth
     */
    toggleBluetooth(value) {
        if (value === true) {
            this.enable()
        } else {
            this.disable()
        }
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    discoverUnpaired() {
        if (this.state.discovering) {
            return false
        } else {
            this.setState({ discovering: true })
            BluetoothSerial.discoverUnpairedDevices()
                .then((unpairedDevices) => {
                    this.setState({ unpairedDevices, discovering: false })
                })
                .catch((err) => console.log(err.message))
        }
    }

    /**
     * [android]
     * Discover unpaired devices, works only in android
     */
    cancelDiscovery() {
        if (this.state.discovering) {
            BluetoothSerial.cancelDiscovery()
                .then(() => {
                    this.setState({ discovering: false })
                })
                .catch((err) => console.log(err.message))
        }
    }

    /**
     * [android]
     * Pair device
     */
    pairDevice(device) {
        BluetoothSerial.pairDevice(device.id)
            .then((paired) => {
                if (paired) {
                    console.log(`Device ${device.name} paired successfully`)
                    const devices = this.state.devices
                    devices.push(device)
                    this.setState({ devices, unpairedDevices: this.state.unpairedDevices.filter((d) => d.id !== device.id) })
                } else {
                    console.log(`Device ${device.name} pairing failed`)
                }
            })
            .catch((err) => console.log(err.message))
    }

    /**
     * Connect to bluetooth device by id
     * @param  {Object} device
     */
    connect(device) {
        this.setState({ connecting: true })
        BluetoothSerial.connect(device.id)
            .then((res) => {
                console.log(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })
            })
            .catch((err) => console.log(err.message))
    }

    /**
     * Disconnect from bluetooth device
     */
    disconnect() {
        BluetoothSerial.disconnect()
            .then(() => this.setState({ connected: false }))
            .catch((err) => console.log(err.message))
    }

    /**
     * Toggle connection when we have active device
     * @param  {Boolean} value
     */
    toggleConnect(value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
    }

    /**
     * Write message to device
     * @param  {String} message
     */
    write(message) {
        if (!this.state.connected) {
            console.log('You must connect to device first')
        }

        BluetoothSerial.write(message)
            .then((res) => {
                console.log('Successfuly wrote to device')
                this.setState({ connected: true })
            })
            .catch((err) => console.log(err.message))
    }

    onDevicePress(device) {
        if(BluetoothSerial.isConnected){
            console.log("IS CONNECTED");
            BluetoothSerial.disconnect()
                .then(() => this.setState({ connected: false }))
                .catch((err) => console.log(err.message))
        }
        if (this.state.section === 0) {
            this.connect(device)
        } else {
            this.pairDevice(device)
        }
    }

    writePackets(message, packetSize = 64) {
        const toWrite = iconv.encode(message, 'cp852')
        const writePromises = []
        const packetCount = Math.ceil(toWrite.length / packetSize)

        for (var i = 0; i < packetCount; i++) {
            const packet = new Buffer(packetSize)
            packet.fill(' ')
            toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
            writePromises.push(BluetoothSerial.write(packet))
        }

        Promise.all(writePromises)
            .then((result) => {
            })
    }




















    handlePress = () => {
        if (!this.state.isRunning) {
            this.write('S');
        } else {
            this.write('s');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.connected === false ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <DeviceList
                            showConnectedIcon={this.state.section === 0}
                            connectedId={this.state.device && this.state.device.id}
                            devices={this.state.section === 0 ? this.state.devices : this.state.unpairedDevices}
                            onDevicePress={(device) => this.onDevicePress(device)} />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.timebox}>
                            <Text
                                style={styles.timeboxText}>
                                {this.state.runtime} seconds
                            </Text>
                        </View>
                        <View style={styles.timebox}>
                            <Text
                                style={styles.timeboxText}>
                                {this.state.distance} cm
                            </Text>
                        </View>
                        <View style={styles.timebox}>
                            <Text
                                style={styles.statusText}>
                                {this.state.status}
                            </Text>
                        </View>
                        <View style={styles.timebox}>
                            <Text
                                style={styles.timeboxText}>
                                bar here
                            </Text>
                        </View>
                        {/* <View style={styles.timebox}>
                            <Text
                                style={styles.statusText}>
                                Status: {this.state.isConnected}
                            </Text>
                        </View> */}
                        <TouchableOpacity
                            style={styles.circleButton}
                            onPress={this.handlePress}
                        >
                            <Text style={styles.buttonText}>
                                Start/Stop
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        width: '100%',
        height: '100%',
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
        marginTop: '15%',
        alignItems: 'center',
        borderRadius: 20,
    },
    timeboxText: {
        // fontFamily: 'Roboto',
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
    statusText: {
        // fontFamily: 'Roboto',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        borderColor: '#ccc',
        borderTopWidth: 0.5,
    },
    listItem: {
        // flex: 1,
        height: 48,
        paddingHorizontal: 16,
        borderColor: '#ccc',
        borderBottomWidth: 0.5,
        justifyContent: 'center'
    },
});


export default Control;