import { type ScrollViewProps, type ScrollView as RNScrollView, type NativeSyntheticEvent, type NativeScrollEvent } from 'react-native';
import { type NativeViewGestureHandlerProps, ScrollView } from 'react-native-gesture-handler';

import { useTooltipRoot } from '~/hooks';

export const Scroll = ({
    children,
    onScrollBeginDrag,
    ...props
}: ScrollViewProps & NativeViewGestureHandlerProps & React.RefAttributes<RNScrollView>) => {
    const tooltip = useTooltipRoot();

    const _onScrollBeginDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        tooltip.onScrollBegin();
        onScrollBeginDrag?.(event);
    };

    return (
        <ScrollView {...props} onScrollBeginDrag={_onScrollBeginDrag}>
            {children}
        </ScrollView>
    );
};
