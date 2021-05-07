# UVCDisinfectionApp

## To install libraries for the microcontroller.ino code:
Open `microcontroller.ino` in the Arduino IDE  
Select Sketch -> Include Library -> Add .ZIP Library  
Navigate to `UVCDisinfectionApp/MicrocontrollerCode/libraries`  
Select `DigiPotX9Cxxx.zip` and click Open  

## To download the controller app:
Note: Only available through the Google Play store  
Open the Google Play store on your Android device  
Search for "UVC Disinfection App"  
Install the purple app that is developed by Team MAMA  

## To install development environment follow the instructions below:
Clone the project  
run `npm install`  
run `npm install -g expo-cli`  
(skip this step) run `expo build:android` select yes when warned about building with native modules  
run `expo eject`   
run `npm install -g react-native-cli`  
(skip this step) run `npm install react-native-bluetooth-serial --save`  
run `react-native link react-native-bluetooth-serial`  
Check the AndroidApp/android/build.gradle and get the minSdkVersion  
In AndroidApp/android/src/main/AndroidManifest.xml paste the following in aligator brackts </>:  
`<uses-permission android:name="android.permission.BLUETOOTH"/>`  
`<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>`  
`<uses-permission-sdk-23 android:name="android.permission.ACCESS_COARSE_LOCATION"/>`  
`<uses-sdk android:minSdkVersion="USE MIN SDK VERSION FOUND ABOVE"/>`  
Plug in android phone and enable developer options  
Locate the AppData/Local/Android/Sdk/platform-tools/ directory, in that directory open a terminal and run `./adb devices`, you should see your phone and it should be authorized or prompt your phone to trust the computer.
Navigate to UVCDisinfectionApp/AndroidApp/node_modeules/react-native-bluetooth-serial/android/src/main/java/com/rusel/RCTBluetoothSerial/RCTBluetoothSerialPackage.java and comment out "@Override" on line 23.
From project directory run 'react-native run-android'  
  
Notes:  
You may need to add abd.exe to path, if you see 'adb is not a command' do this by adding 'C:\Users\username\AppData\Local\Android\Sdk\platform-tools' to Path, then close all programs, then test it by typing 'adb devices' in terminal or bash.  
You may need to create a file called 'local.properties' in the /android directory and add 'sdk.dir=C:\\Users\\Username\\AppData\\Local\\Android\\Sdk' if given error 'sdk location not found'  
