import { useCallback, useState } from 'react';
import * as React from 'react';

import { StatusBar, StyleSheet, View } from 'react-native';
import AwesomeGallery, { type RenderItemInfo } from 'react-native-awesome-gallery';

import { Icon, Image, Modal, Text } from '~/core';
import { useTranslate } from '~/localization';
import { useStylesCommon } from '~/styles';

import { useStyles } from './gallery.style';
import { type IGalleryProps } from './gallery.type';

const renderItem = ({ item, setImageDimensions }: RenderItemInfo<{ uri: string }>) => {
    return (
        <Image
            uri={item.uri}
            style={StyleSheet.absoluteFillObject}
            resizeMode="contain"
            onLoad={e => {
                e.persist();
                const { width, height } = e?.nativeEvent?.source ?? { height: 0, width: 0 };
                console.log('onLoad', width, height);
                setImageDimensions({ width, height });
            }}
        />
    );
};

export const GalleryModal = ({ images, index: initialIndex, hide, ...rest }: IGalleryProps) => {
    const t = useTranslate('modals.gallery');
    const s = useStyles();
    const styles = useStylesCommon();
    const [index, setIndex] = useState(initialIndex ?? 0);
    const [infoVisible, setInfoVisible] = useState(true);

    const onIndexChange = useCallback(
        (index: number) => {
            setIndex(index);
        },
        [setIndex],
    );

    const onTap = () => {
        StatusBar.setHidden(infoVisible, 'slide');
        setInfoVisible(!infoVisible);
    };

    const onScaleEnd = (scale: number) => {
        if (scale < 0.8) {
            hide();
        }
    };

    return (
        <Modal style={styles.modalBottomSheet} hide={hide} {...rest}>
            <View style={styles.container}>
                {infoVisible && (
                    <View style={s.toolbar}>
                        <View style={s.textContainer}>
                            <Text style={s.headerText} text={`${index + 1} ${t('of')} ${images.length}`} />
                        </View>
                        <Icon style={s.close} name="close" size={24} color="white" onPress={hide} />
                    </View>
                )}
                <AwesomeGallery
                    data={images}
                    renderItem={renderItem}
                    initialIndex={index}
                    numToRender={3}
                    doubleTapInterval={150}
                    onIndexChange={onIndexChange}
                    onTap={onTap}
                    loop
                    keyExtractor={item => item.uri}
                    onScaleEnd={onScaleEnd}
                />
            </View>
        </Modal>
    );
};
