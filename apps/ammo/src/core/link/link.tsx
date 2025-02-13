import { Touchable, Icon, Text } from '~/core';
import { useStylesCommon, useTheme } from '~/styles';

import { useStyles } from './link.style';
import { type ILinkProps } from './link.type';

export const Link = ({ text, onPress, style, arrow, ...rest }: ILinkProps) => {
    const s = useStyles();
    const styles = useStylesCommon();
    const theme = useTheme();

    return (
        <Touchable onPress={onPress} style={[s.container, style]}>
            <Text type="h6" style={styles.label} color={theme.colors.link} {...rest}>
                {text}
            </Text>
            {arrow && <Icon name="arrow-right" color={theme.colors.link} size={12} />}
        </Touchable>
    );
};
