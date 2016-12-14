#build apk
cordova build --release android

#move to folder
cd platforms/android/build/outputs/apk/

#sign with keystore
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/.keystores/my-release-key.keystore android-release-unsigned.apk alias_name 

#verify
zipalign -v 4 android-release-unsigned.apk WingNet.apk

