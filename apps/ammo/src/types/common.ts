import { type RefObject } from 'react';

import { type NetInfoState } from '@react-native-community/netinfo';
import { type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

export type ISharedValue = { value: number };
export interface ViewModel {
    unmount?: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init?: (...args: any[]) => void;
}
export type ViewModelGeneric<T> = T extends ViewModel ? T : T & ViewModel;
export type Path<T, Depth extends number = 4> = [Depth] extends [never]
    ? never
    : T extends object
      ? {
            [K in keyof T & string]: K | `${K}.${Path<T[K], PrevDepth<Depth>>}`;
        }[keyof T & string]
      : never;
type PrevDepth<T extends number> = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10][T];
export type ITextStyle = StyleProp<TextStyle>;
export type IViewStyle = StyleProp<ViewStyle>;
export type IImageStyle = StyleProp<ImageStyle>;
export type Mask = '9' | 'A' | 'S' | '*';
export type INetInfoState = NetInfoState;
export interface ITooltipContext {
    show: (value: { id: string; text: string }, aref: RefObject<any>) => void;
    hide: (value: { id: string }) => void;
}

export interface ITooltipRootContext {
    onScrollBegin: () => void;
    hide: () => void;
}

export enum DictionaryType {
    Explosive = 'explosive',
    ExplosiveObject = 'explosive-object',
    ExplosiveDevices = 'explosive-device',
}

export interface ISlide {
    uri: string;
    id: number;
}

export interface IOption<T> {
    value: T;
    title: string;
}
