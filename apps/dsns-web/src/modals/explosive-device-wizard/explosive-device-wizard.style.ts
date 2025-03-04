import { Theme } from '~/styles';

const spin = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 300px;
`);

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
    additional,
    input,
};
