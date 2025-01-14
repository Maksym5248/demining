import { Theme } from '~/styles';

const section = Theme.css(
    (theme) => `
    background: ${theme.token['blue-1']};
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 1;   
`,
);

const classification = Theme.css(`
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    display: flex;   
`);

const container = Theme.css(`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;   
`);

const title = Theme.css(
    (theme) => `
    color: ${theme.token.blue};  
`,
);

export const s = {
    container,
    section,
    classification,
    title,
};
