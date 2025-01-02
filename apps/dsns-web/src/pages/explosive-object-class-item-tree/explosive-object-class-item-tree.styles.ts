import { Theme } from '~/styles';

const section = Theme.css(
    (theme) => `
    background: ${theme.token['blue-1']};
    border-radius: 4px;
    align-items: center;
    justify-content: center;
    display: flex;   
`,
);

export const s = {
    section,
};
