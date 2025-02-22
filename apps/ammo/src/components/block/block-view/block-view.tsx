import { View } from 'react-native';

import { Text } from '~/core';
import { useStylesCommon } from '~/styles';

import { type IBlockViewProps } from './block-view.type';

export const BlockView = ({ title, children }: IBlockViewProps) => {
    const styles = useStylesCommon();

    return (
        <View style={styles.block}>
            {!!title && <Text type="h3" style={styles.label} text={title} />}
            {children}
        </View>
    );
};
