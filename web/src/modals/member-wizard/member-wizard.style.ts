import { Theme } from '~/styles';

const spin = Theme.css(`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    height: 300px;
`);

const item = Theme.css(`
    margin-bottom: 0px
`);

export const s = {
    spin,
    item,
};
