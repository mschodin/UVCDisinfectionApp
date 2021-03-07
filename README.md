# UVCDisinfectionApp

## To install development environment follow the instructions below:
Clone the project  
run 'npm install'
run 'npm install -g expo-cli'
run 'expo build:android' select yes when warned about building with native modules
run 'expo eject' 
run 'npm install -g react-native-cli'
run 'npm install react-native-ble-plx --save'
run 'react-native link react-native-ble-plx'
Check the AndroidApp/android/build.gradle and get the minSdkVersion
In AndroidApp/android/src/main/AndroidManifest.xml paste the following:
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission-sdk-23 android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-sdk android:minSdkVersion="USE MIN SDK VERSION FOUND ABOVE"/>
Plug in android phone and enable developer options
From project directory run 'react-native run-android'

Notes:
You may need to add abd.exe to path, if you see 'adb is not a command'
You may need to create a file called 'local.properties' in the /android directory and add 'sdk.dir=C:\\Users\\Username\\AppData\\Local\\Android\\Sdk' if given error 'sdk location not found'
