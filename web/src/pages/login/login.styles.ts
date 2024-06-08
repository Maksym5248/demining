import { Theme } from '~/styles';

const container = Theme.css(`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #4070f4;
    column-gap: 30px;
`);

const content = Theme.css(
    ({ token }) => `
    min-width: 100px;
    width: 40vh;
    padding: 30px;
    border-radius: 6px;
    background: ${token.colorBgBase};
    flex-direction: column;
    align-items: center;
`,
);

const title = Theme.css(`
     color: #232836;
     text-align: center;
     padding-bottom: 30px;
`);

const button = Theme.css(`
    align-self: center;
    width: 100%;
`);

const buttonGoogle = Theme.css(`
    align-self: center;
    width: 100%;
    background: #DB4437
`);

const appIcon = Theme.css(`
    position: absolute;
    top: 4vh;
    width: 10vh;
    fill: #FFF;
    margin-bottom: 40px;
`);

export const s = {
    container,
    content,
    title,
    button,
    buttonGoogle,
    appIcon,
};
