import type React from 'react';

import { type ViewStyle } from 'react-native';

import { type ISharedValue } from '~/types';

export interface IBaseParams {
    animatedIndex: ISharedValue;
    itemWidth: number;
}

export interface IRenderItemParams<T extends object> extends IBaseParams {
    item: T;
    index: number;
}

export interface IRenderFooterParams extends IBaseParams {
    data: any[];
}

export interface ICarouselProps {
    width: number;
    itemWidth: number;
    initialIndex?: number;
    data: any[];
    renderItem: (params: IRenderItemParams<any>) => React.ReactNode;
    renderFooter?: (params: IRenderFooterParams) => React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    containerStyle?: ViewStyle | ViewStyle[];
    contentContainerStyle?: ViewStyle | ViewStyle[];
    isFooterInsideTouchable?: boolean;
    keyExtractor?: (...args: any[]) => string;
    lazy?: boolean;
    onChangedIndex?: (index: number) => void;
    delayChangeIndexCallBack?: number;
}

export interface ICarouselRef {
    animatedToIdex: (index: number) => void;
}
