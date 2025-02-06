import { useEffect } from 'react';

import _ from 'lodash';
import { BackHandler } from 'react-native';

import { Device } from '~/utils';

export const useAndroidBackButton = (onPress: () => boolean | void, deps: any[] = []) => {
    useEffect(() => {
        if (Device.isAndroid) {
            const backHander = BackHandler.addEventListener('hardwareBackPress', () => {
                const res = onPress();

                return _.isBoolean(res) ? res : true;
            });

            return () => backHander.remove();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
