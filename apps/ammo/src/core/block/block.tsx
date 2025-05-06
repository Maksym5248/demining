import { View } from 'react-native';

import { Text } from '~/core';
import { useStylesCommon } from '~/styles';

import { type IBlockProps } from './block.type';

export const Block = ({ title, children, style, hidden, require = true }: IBlockProps) => {
    const styles = useStylesCommon();

    if (hidden || (!require && !children && !title)) {
        return null;
    }

    return (
        <View style={[styles.block, style]}>
            {!!title && <Text type="h3" style={styles.label} text={title} />}
            {children}
        </View>
    );
};
