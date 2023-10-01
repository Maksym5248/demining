import { Theme } from '~/styles'

const layout = Theme.css(`
    height: 100%;
`);


const slider = Theme.css(({ token }) => `
    padding: 10px 1px;
`);

const content = Theme.css(({ token }) => `
    flex: 1;
    margin: 24px 16px;
    padding: 24px;
    minHeight: 400px;
    background: ${token.colorBgBase};
`);

export const s = {
    layout,
    content,
    slider,
}
    