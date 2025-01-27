import { Dimensions, Platform, type EmitterSubscription } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

function getOrientation(height: number, width: number) {
    return width < height ? Orientation.Portrait : Orientation.Landscape;
}

// @ts-ignore
const isPad = () => !!Platform?.isPad;

export enum Orientation {
    Portrait = 'portrait',
    Landscape = 'landscape',
}

interface IDeviceInternal {
    dimentsionSubscription: EmitterSubscription | null;
    addDimensionsEventListener(callback: any): void;
    removeListeners(): void;
}

export interface IDevice {
    isAndroid: boolean;
    isIOS: boolean;
    isTablet: boolean;
    isIphoneX: boolean;
    window: { width: number; height: number };
    screen: { width: number; height: number };
    orientation: Orientation;
    isLandscape: boolean;
    isPortrait: boolean;
    inset: { right: number; left: number; top: number; bottom: number };
    isSmallScreen: boolean;
    isShortScreen: boolean;
    screenAspectRatio: number;
}

export class DeviceClass implements IDevice, IDeviceInternal {
    dimentsionSubscription: EmitterSubscription | null = null;

    get isAndroid() {
        return Platform.OS === 'android';
    }
    get isIOS() {
        return Platform.OS === 'ios';
    }

    get isTablet() {
        return isPad() || (this.screenAspectRatio < 1.6 && Math.max(this.window.width, this.window.height) >= 900);
    }

    get isIphoneX() {
        return this.isIOS && isPad() && !Platform.isTV && (this.window.height >= 812 || this.window.width >= 812);
    }

    get window() {
        return Dimensions.get('window');
    }

    get screen() {
        return Dimensions.get('screen');
    }

    get orientation() {
        return getOrientation(this.window.height, this.window.width);
    }

    get isLandscape() {
        return this.orientation === Orientation.Landscape;
    }

    get isPortrait() {
        return this.orientation === Orientation.Portrait;
    }

    get inset() {
        return {
            right: initialWindowMetrics?.insets.right || 0,
            left: initialWindowMetrics?.insets.left || 0,
            top: initialWindowMetrics?.insets.top || 0,
            bottom: initialWindowMetrics?.insets.bottom || 0,
        };
    }

    get isSmallScreen() {
        return this.window.width <= 340;
    }
    get isShortScreen() {
        return this.window.height <= 600;
    }
    get screenAspectRatio() {
        return this.isPortrait ? this.window.height / this.window.width : this.window.width / this.window.height;
    }

    addDimensionsEventListener(callback: any) {
        this.dimentsionSubscription = Dimensions.addEventListener('change', callback);
    }

    removeListeners() {
        this.dimentsionSubscription?.remove();
    }
}

export const Device = new DeviceClass();
