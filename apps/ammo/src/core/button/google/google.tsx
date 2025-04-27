import React from 'react';

import { useTheme } from '~/styles';

import { useStyles } from './google.style';
import { type IButtonGoogleProps } from './google.types';
import { Icon } from '../../icon';
import { Button } from '../button';

export const ButtonGoogle = (props: IButtonGoogleProps) => {
    const s = useStyles();
    const theme = useTheme();

    return <Button {...props} style={[props?.style, s.container]} center={<Icon name="google" color={theme.colors.white} />} />;
};
