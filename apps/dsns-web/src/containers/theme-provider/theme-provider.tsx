import React from 'react';

import { ThemeProvider as Theme } from '@emotion/react';
import { theme } from 'antd';

const { useToken } = theme;

export function ThemeProvider({ children }: { children: React.ReactElement }) {
    const { token } = useToken();

    return <Theme theme={token}>{children}</Theme>;
}
