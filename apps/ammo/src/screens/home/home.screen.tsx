import { useCallback } from 'react';

import { View, Text } from 'react-native';

import { Carousel } from '~/core';
import { Device } from '~/utils';

import { useStyles } from './home.style';

export const HomeScreen = () => {
    const s = useStyles();

    const renderFooter = useCallback(() => {
        return <View />;
    }, []);

    const renderItem = useCallback(() => {
        return <View />;
    }, []);

    return (
        <View style={s.container}>
            <Text>Sign Up Screen</Text>
            <Carousel
                width={Device.window.width}
                itemWidth={Device.window.width}
                style={s.carousel}
                containerStyle={s.carouselContent}
                data={[]}
                renderItem={renderItem}
                renderFooter={renderFooter}
            />
        </View>
    );
};
