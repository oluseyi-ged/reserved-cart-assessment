import {AvailableMapApp, NavigationAppType} from '@slices/navigationPreference';
import {Linking, Platform} from 'react-native';

// Map app configurations with URL schemes
const MAP_APP_CONFIGS: Record<
  Exclude<NavigationAppType, 'SHOPRESERVE'>,
  {
    name: string;
    icon: string;
    iosScheme: string;
    androidPackage: string;
    getDirectionsUrl: (
      destLat: number,
      destLng: number,
      srcLat?: number,
      srcLng?: number,
    ) => string;
  }
> = {
  GOOGLE_MAPS: {
    name: 'Google Maps',
    icon: 'gmap',
    iosScheme: 'comgooglemaps://',
    androidPackage: 'com.google.android.apps.maps',
    getDirectionsUrl: (destLat, destLng, srcLat, srcLng) => {
      const origin = srcLat && srcLng ? `&origin=${srcLat},${srcLng}` : '';
      if (Platform.OS === 'ios') {
        return `comgooglemaps://?daddr=${destLat},${destLng}${origin}&directionsmode=driving`;
      }
      return `google.navigation:q=${destLat},${destLng}`;
    },
  },
  APPLE_MAPS: {
    name: 'Apple Maps',
    icon: 'apple-maps',
    iosScheme: 'maps://',
    androidPackage: '', // Not available on Android
    getDirectionsUrl: (destLat, destLng, srcLat, srcLng) => {
      const origin =
        srcLat && srcLng
          ? `&saddr=${srcLat},${srcLng}`
          : '&saddr=Current%20Location';
      return `maps://?daddr=${destLat},${destLng}${origin}&dirflg=d`;
    },
  },
  WAZE: {
    name: 'Waze',
    icon: 'waze',
    iosScheme: 'waze://',
    androidPackage: 'com.waze',
    getDirectionsUrl: (destLat, destLng) => {
      return `waze://?ll=${destLat},${destLng}&navigate=yes`;
    },
  },
};

/**
 * Check if a specific map app is installed on the device
 */
export const checkMapAppAvailability = async (
  appType: Exclude<NavigationAppType, 'SIMPLIRIDE'>,
): Promise<boolean> => {
  const config = MAP_APP_CONFIGS[appType];
  if (!config) return false;

  // Apple Maps is only available on iOS
  if (appType === 'APPLE_MAPS' && Platform.OS !== 'ios') {
    return false;
  }

  try {
    const scheme =
      Platform.OS === 'ios' ? config.iosScheme : `${config.androidPackage}://`;

    // For Android, we check if the package can be opened
    if (Platform.OS === 'android' && appType !== 'APPLE_MAPS') {
      // Use intent scheme for Android
      const androidUrl =
        appType === 'GOOGLE_MAPS'
          ? 'google.navigation:q=0,0'
          : appType === 'WAZE'
          ? 'waze://?ll=0,0'
          : '';
      return await Linking.canOpenURL(androidUrl);
    }

    return await Linking.canOpenURL(scheme);
  } catch {
    return false;
  }
};

/**
 * Get all available map apps on the device
 */
export const getAvailableMapApps = async (): Promise<AvailableMapApp[]> => {
  const apps: AvailableMapApp[] = [
    {
      id: 'SHOPRESERVE',
      name: 'ShopReserve',
      icon: 'app-icon',
      isAvailable: true,
      urlScheme: '',
    },
  ];

  const appTypes: Exclude<NavigationAppType, 'SIMPLIRIDE'>[] = [
    'GOOGLE_MAPS',
    'WAZE',
  ];

  // Add Apple Maps only for iOS
  if (Platform.OS === 'ios') {
    appTypes.push('APPLE_MAPS');
  }

  for (const appType of appTypes) {
    const isAvailable = await checkMapAppAvailability(appType);
    const config = MAP_APP_CONFIGS[appType];

    if (isAvailable && config) {
      apps.push({
        id: appType,
        name: config.name,
        icon: config.icon,
        isAvailable: true,
        urlScheme:
          Platform.OS === 'ios' ? config.iosScheme : config.androidPackage,
      });
    }
  }

  return apps;
};

/**
 * Open external map app with navigation to destination
 */
export const openExternalMapApp = async (
  appType: Exclude<NavigationAppType, 'SIMPLIRIDE'>,
  destination: {latitude: number; longitude: number},
  origin?: {latitude: number; longitude: number},
): Promise<boolean> => {
  const config = MAP_APP_CONFIGS[appType];
  if (!config) {
    return false;
  }

  try {
    const url = config.getDirectionsUrl(
      destination.latitude,
      destination.longitude,
      origin?.latitude,
      origin?.longitude,
    );

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
      return true;
    } else {
      // Fallback to web version for Google Maps
      if (appType === 'GOOGLE_MAPS') {
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${
          destination.latitude
        },${destination.longitude}${
          origin ? `&origin=${origin.latitude},${origin.longitude}` : ''
        }&travelmode=driving`;
        await Linking.openURL(webUrl);
        return true;
      }
      return false;
    }
  } catch {
    return false;
  }
};

/**
 * Start navigation based on user's preference
 * Returns true if external app was opened, false if should use in-app navigation
 */
export const startNavigation = async (
  selectedApp: NavigationAppType,
  destination: {latitude: number; longitude: number},
  origin?: {latitude: number; longitude: number},
): Promise<{useInApp: boolean; success: boolean}> => {
  // If ShopReserve is selected, use in-app navigation
  if (selectedApp === 'SHOPRESERVE') {
    return {useInApp: true, success: true};
  }

  // Try to open the external app
  const success = await openExternalMapApp(
    selectedApp as Exclude<NavigationAppType, 'SIMPLIRIDE'>,
    destination,
    origin,
  );

  if (!success) {
    // Fall back to in-app navigation if external app fails
    return {useInApp: true, success: false};
  }

  return {useInApp: false, success: true};
};
