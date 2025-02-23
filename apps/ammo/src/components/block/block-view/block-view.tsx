import { View } from 'react-native';

import { Text } from '~/core';
import { useStylesCommon } from '~/styles';

import { type IBlockViewProps } from './block-view.type';

export const BlockView = ({ title, children, hidden, require = true }: IBlockViewProps) => {
    const styles = useStylesCommon();

    if (hidden || (!require && !children && !title)) {
        return null;
    }

    return (
        <View style={styles.block}>
            {!!title && <Text type="h3" style={styles.label} text={title} />}
            {children}
        </View>
    );
};
