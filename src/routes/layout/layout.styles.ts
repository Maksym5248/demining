import { Theme } from '~/styles'

const content = Theme.css(({ token }) => `
    flex: 1;
    margin: 24px 16px;
    padding: 24px;
    minHeight: 400px;
    background: ${token.colorBgBase};
`);

export const s = {
    content,
}
    