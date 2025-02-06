import { type LayoutAnimationConfig, LayoutAnimation } from 'react-native';

import { Device } from '../device';

const keyboard = {
    duration: 200,
    update: {
        type: Device.isIOS ? 'keyboard' : 'linear',
    },
} as LayoutAnimationConfig;

const fade = {
    duration: 200,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
    update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
    delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
    },
};

export const layoutConfig = { keyboard, fade };
