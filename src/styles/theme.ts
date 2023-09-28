import { theme } from 'antd';
import { css } from '@emotion/react'

class ThemeClass {
    css(str: string) {
        return css`${str}`;
    }
    csss(f: (theme: AliasToken) => string) {
        return css`${f(theme)}`;
    }
}


export const Theme = new ThemeClass();