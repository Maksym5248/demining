import { theme } from 'antd';
import { SeedToken } from 'antd/es/theme/interface/seeds'
import { AliasToken } from 'antd/es/theme/interface/alias'
import { css } from '@emotion/react'
import _ from 'lodash'

const { getDesignToken } = theme;
interface Token extends SeedToken, AliasToken {}


class ThemeClass {
    token: Token;
    constructor(){
        this.token = getDesignToken();
    }
    css(arg: ((obj: {token: Token }) => string) | string) {
        return _.isString(arg) ? css`${arg}`: css`${arg({ token: this.token })}`;
    }
    getToken(){
        return this.token;
    }
    
}


export const Theme = new ThemeClass();