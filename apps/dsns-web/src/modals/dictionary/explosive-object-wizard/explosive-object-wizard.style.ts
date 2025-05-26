import { Theme } from '~/styles';

const spin = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 300px;
`);

const size = Theme.css(`
    margin: 0 8px;
`);

const inert = Theme.css(
    theme => `
    color: ${theme.token.colorInfoActive};

`,
);

const additional = Theme.css(
    () => `
    flex-direction: row;

`,
);

const input = Theme.css(
    () => `
    margin-bottom: 5px;
`,
);

export const s = {
    spin,
    size,
    inert,
    additional,
    input,
};
