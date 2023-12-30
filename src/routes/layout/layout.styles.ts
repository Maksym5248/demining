import { Theme } from '~/styles'

const content = Theme.css(({ token }) => `
    flex: 1;
    margin: 0 16px 24px 16px;
    padding: 12px 24px;
    minHeight: 400px;
    background: ${token.colorBgBase};
`);

const breadcrumb = Theme.css(() => `
    margin: 12px 16px;
    padding: 8px;
`);

export const s = {
	content,
	breadcrumb
}
    