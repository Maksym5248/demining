import { Theme } from '~/styles'

const expandButton = Theme.css(({ token }) => `
    color: ${token.colorTextLightSolid};
    font-size: 16px;
    width: 64px;
    height: 64px;
    &:hover {
        color: red;
    }
`)

export const s = {
    expandButton,
}
    