import { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import { Device } from '~/utils';

interface IUseStatusBar {
    backgroundColor?: string;
    barStyle?: 'light-content' | 'dark-content';
    translucent?: boolean;
}

/**
 * withNavigation can not be change during render
 **/
export function useStatusBar(params: IUseStatusBar, withNavigation = true, unMountParams?: IUseStatusBar) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigation = withNavigation ? useNavigation() : null;

    const { backgroundColor = 'transparent', barStyle = 'light-content', translucent = true } = params;

    useEffect(() => {
        const updateStatusBar = () => {
            Device.isAndroid && StatusBar.setBackgroundColor(backgroundColor);
            StatusBar.setBarStyle(barStyle);
            Device.isAndroid && StatusBar.setTranslucent(translucent);
        };

        let unsubscribe: (() => void) | undefined = undefined;

        if (navigation) {
            unsubscribe = navigation.addListener('focus', updateStatusBar);
        }
        updateStatusBar();

        return () => {
            unsubscribe?.();
            if (unMountParams) {
                Device.isAndroid && StatusBar.setBackgroundColor(unMountParams.backgroundColor || backgroundColor);
                StatusBar.setBarStyle(unMountParams.barStyle || barStyle);
                Device.isAndroid && StatusBar.setTranslucent(unMountParams.translucent || translucent);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [backgroundColor, translucent, barStyle, navigation]);
}
