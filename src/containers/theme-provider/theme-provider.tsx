
import React from 'react';

import { theme } from 'antd';
import { ThemeProvider as Theme } from '@emotion/react'

const { useToken } = theme;

export function ThemeProvider({ children }: {children: React.ReactElement }) {
    const { token } = useToken();

    return (
      <Theme theme={token}>
          {children}
      </Theme>
    )
}