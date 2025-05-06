import React, { useCallback, useMemo } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';

import { CommentInput, CommentView, Section } from '~/components';
import { CommentsPreview } from '~/containers';
import { Header, CarouselImage, List, type IFlatListRenderedItem } from '~/core';
import { useAnimatedCommentInput, useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';

import { Characteristic, Details } from './components';
import { type IListItem, type IExplosiveDeviceDetailsScreenProps } from './explosive-device-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-device-details.vm';
import { useStyles } from './explosive-object-details.style';

export const ExplosiveDeviceDetailsScreen = observer(({ route }: IExplosiveDeviceDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const t = useTranslate('screens.explosive-device-details');
    const s = useStyles();
    const animatedComment = useAnimatedCommentInput();

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params);

    const dictionary: IListItem[] = [
        {
            id: 'carousel',
            isVisible: true,
            render: () => <CarouselImage width={device.window.width} data={vm.slides} />,
        },
        {
            id: 'details',
            isVisible: true,
            render: () => <Details item={vm.item} />,
        },
        {
            id: 'characteristic',
            isVisible: true,
            render: () => <Characteristic item={vm.item} characteristic={vm.characteristic} />,
        },
        {
            id: 'marking',
            isVisible: vm.marking.isVisible,
            render: () => <Section.Carousel title={t('marking')} item={vm.marking} />,
        },
        {
            id: 'purpose',
            isVisible: vm.purpose.isVisible,
            render: () => <Section.Carousel title={t('purpose')} item={vm.purpose} />,
        },
        {
            id: 'structure',
            isVisible: vm.structure.isVisible,
            render: () => <Section.Carousel title={t('structure')} item={vm.structure} />,
        },
        {
            id: 'action',
            isVisible: vm.action.isVisible,
            render: () => <Section.Carousel title={t('action')} item={vm.action} />,
        },
        {
            id: 'comment',
            isVisible: true,
            render: () => <CommentsPreview item={vm.comments} onMeasure={animatedComment.onMeasureCommentPreview} />,
        },
    ];

    const comments: IListItem[] = useMemo(
        () =>
            vm.comments.items?.map(
                el =>
                    ({
                        id: el.id,
                        isVisible: true,
                        render: () => <CommentView item={el} />,
                    }) as IListItem,
            ) ?? ([] as IListItem[]),
        [vm.comments.items?.length],
    );

    const data = [...dictionary, ...comments].filter(item => item.isVisible);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <View style={[styles.container, styles.hidden]}>
                <List
                    isAnimated
                    data={data}
                    renderItem={renderItem}
                    contentContainerStyle={[styles.scrollViewContent, s.contentContainer]}
                    style={animatedComment.containerStyles}
                    isLoadingMore={vm.comments.isLoadingMore}
                    isEndReached={vm.comments.isEndReached}
                    onEndReached={() => vm.comments.loadMore.run()}
                    onScroll={animatedComment.onScroll}
                />
            </View>
            <CommentInput
                item={vm.input}
                style={[styles.fillAbsoluteBottom, animatedComment.styles]}
                onLayout={animatedComment.onLayoutCommentInput}
            />
        </View>
    );
});
