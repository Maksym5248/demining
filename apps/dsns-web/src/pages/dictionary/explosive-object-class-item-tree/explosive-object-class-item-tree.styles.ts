import { Theme } from '~/styles';

const section = Theme.css(
    theme => `
    background: ${theme.token['blue-1']};
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex: 1;   
`,
);

const container = Theme.css(`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 8px;   
`);

const title = Theme.css(`
    display: flex;
    flex: 1;
    gap: 8px;   
`);

const classification = Theme.css(`
    display: flex;
    flex: 1;
    gap: 8px;   
`);

const icon = Theme.css(`
    ::hover {
        cursor: pointer;
        color: red;
    };
`);

export const s = {
    container,
    section,
    classification,
    title,
    icon,
};
