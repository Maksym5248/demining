import React, { useCallback, useMemo } from 'react';

import { observer } from 'mobx-react';
import { View } from 'react-native';
import { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CommentInput, CommentView, Section } from '~/components';
import { CommentsPreview } from '~/containers';
import { Header, type IFlatListRenderedItem, List, Paragraph, CarouselImage, Block } from '~/core';
import { useViewModel } from '~/hooks';
import { useTranslate } from '~/localization';
import { useDevice, useStylesCommon } from '~/styles';

import { Details } from './components';
import { useStyles } from './explosive-object-details.style';
import { type IListItem, type IExplosiveObjectDetailsScreenProps } from './explosive-object-details.types';
import { createVM, type IExplosiveObjectDetailsVM } from './explosive-object-details.vm';

const mockId = 'SgmgAFIy3xkBUagzM5ZU';

export const ExplosiveObjectDetailsScreen = observer(({ route }: IExplosiveObjectDetailsScreenProps) => {
    const device = useDevice();
    const styles = useStylesCommon();
    const s = useStyles();
    const t = useTranslate('screens.explosive-object-details');
    const visible = useSharedValue(0);
    const scrollY = useSharedValue(0);
    const commentInputHeight = useSharedValue(0);

    const vm = useViewModel<IExplosiveObjectDetailsVM>(createVM(route?.params?.id), route?.params?.id ? route?.params : { id: mockId });

    const { details } = vm.item ?? {};

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
            id: 'fullDescription',
            isVisible: !!details?.data?.fullDescription,
            render: () => (
                <Block title={t('fullDescription')}>
                    <Paragraph text={details?.data?.fullDescription ?? '-'} />
                </Block>
            ),
        },
        {
            id: 'historical',
            isVisible: vm.historical.isVisible,
            render: () => <Section.Carousel title={t('historical')} item={vm.historical} />,
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
            id: 'folding',
            isVisible: vm.folding.isVisible,
            render: () => <Section.Carousel title={t('folding')} item={vm.folding} />,
        },
        {
            id: 'action',
            isVisible: vm.action.isVisible,
            render: () => <Section.Carousel title={t('action')} item={vm.action} />,
        },
        {
            id: 'extraction',
            isVisible: vm.extraction.isVisible,
            render: () => <Section.Carousel title={t('extraction')} item={vm.extraction} />,
        },
        {
            id: 'liquidator',
            isVisible: vm.liquidator.isVisible,
            render: () => <Section.Carousel title={t('liquidator')} item={vm.liquidator} />,
        },
        {
            id: 'installation',
            isVisible: vm.installation.isVisible,
            render: () => <Section.Carousel title={t('installation')} item={vm.installation} />,
        },
        {
            id: 'neutralization',
            isVisible: vm.neutralization.isVisible,
            render: () => <Section.Carousel title={t('neutralization')} item={vm.neutralization} />,
        },
        {
            id: 'marking',
            isVisible: vm.marking.isVisible,
            render: () => <Section.Carousel title={t('marking')} item={vm.marking} />,
        },
        {
            id: 'comment',
            isVisible: true,
            render: () => (
                <CommentsPreview isComments={vm.comments.isComments} onLayout={e => console.log('TEST', e.nativeEvent.layout.y)} />
            ),
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
        [vm.comments.items],
    );

    const data = [...dictionary, ...comments].filter(item => item.isVisible);

    const renderItem = useCallback(({ item }: IFlatListRenderedItem<IListItem>) => item.render(), []);

    const onLayoutCommentInput = useCallback(
        (event: any) => {
            const { height } = event.nativeEvent.layout;
            commentInputHeight.value = height;
        },
        [vm.input],
    );

    const handler = useAnimatedScrollHandler(
        {
            onEndDrag: e => {
                scrollY.value = e.contentOffset.y;

                if (e.contentOffset.y > 120) {
                    visible.value = withTiming(1, { duration: 200 });
                } else {
                    visible.value = withTiming(0, { duration: 200 });
                }
            },
        },
        [],
    );

    const commentStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(visible.value, [0, 1], [commentInputHeight.value, 0]),
                },
            ],
        };
    }, []);

    return (
        <View style={styles.container}>
            <Header title={vm.item?.data.name} backButton="back" />
            <List
                isAnimated
                data={data}
                renderItem={renderItem}
                contentContainerStyle={[styles.scrollViewContent, s.contentContainer]}
                isLoading={vm.comments.isLoading}
                isLoadingMore={vm.comments.isLoadingMore}
                isEndReached={vm.comments.isEndReached}
                onEndReached={() => vm.comments.loadMore()}
                onScroll={handler}
            />
            <CommentInput item={vm.input} style={[styles.fillAbsoluteBottom, commentStyles]} onLayout={onLayoutCommentInput} />
        </View>
    );
});
