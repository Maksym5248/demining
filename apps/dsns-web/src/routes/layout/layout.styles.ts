import { Theme } from '~/styles';

export const HEADER_HEIGHT = 64;

const content = Theme.css(
    ({ token }) => `
    height: 100%;
    overflow: auto;
    margin: 0 16px 24px 16px;
    padding: 12px 24px;
    background: ${token.colorBgBase};
`,
);

const breadcrumb = Theme.css(
    () => `
    margin: 12px 16px;
    padding: 8px;
`,
);

const logo = Theme.css(`
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
`);

const user = Theme.css(`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
`);

const appIcon = Theme.css(`
    height: ${HEADER_HEIGHT - 16}px;
    fill: #FFF;
`);

const appName = Theme.css(`
    margin-left: 16px;
    color: #FFF;
`);

const header = Theme.css(`
    position: sticky;
    top: 0;
    height: ${HEADER_HEIGHT}px;
    zIndex: 1;
    display: flex;
    align-items: space-between;
    padding: 0 24px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`);

export const s = {
    logo,
    header,
    appIcon,
    content,
    breadcrumb,
    appName,
    user,
};
