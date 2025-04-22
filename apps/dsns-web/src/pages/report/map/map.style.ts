import { Theme } from '~/styles';

const container = Theme.css(`
    display: : flex;
    flex: 1;
    position: relative;
`);

const map = Theme.css(`
    border-radius: 0;
`);

export const s = {
    container,
    map,
};
