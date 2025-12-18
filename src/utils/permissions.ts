import { PermissionsAndroid, Platform } from 'react-native';

export async function requestContactsPermission() {
    if (Platform.OS !== 'android') {
        return true;
    }

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
                title: 'Contacts Permission',
                message: 'This app needs access to your contacts to work properly.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Deny',
                buttonPositive: 'OK',
            }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {

        return false;
    }

}
