import { useCallback } from 'react';

import { View, Text } from 'react-native';

import { Carousel, type IRenderItemParams } from '~/core';
import { useDevice } from '~/styles';

import { useStyles } from './home.style';

export const HomeScreen = () => {
    const device = useDevice();
    const s = useStyles();

    const renderFooter = useCallback(() => {
        return <View />;
    }, []);

    const renderItem = useCallback(
        ({ index }: IRenderItemParams<object>) => {
            return <View style={index % 2 ? s.green : s.red} />;
        },
        [s],
    );

    return (
        <View style={s.container}>
            <Text>Sign Up Screen</Text>
            <Carousel
                width={device.window.width}
                itemWidth={device.window.width}
                style={s.carousel}
                containerStyle={s.carouselContent}
                data={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]}
                renderItem={renderItem}
                renderFooter={renderFooter}
            />
        </View>
    );
};
