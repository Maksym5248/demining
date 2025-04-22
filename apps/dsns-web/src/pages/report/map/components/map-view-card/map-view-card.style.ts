import { Theme } from '~/styles';

const container = Theme.css(`
    display: : flex;
    width: 400px;
    height: 185px;
    left: calc(50% - 200px);
    bottom: 40px;
    position: absolute;
`);

const content = Theme.css(`
    position: relative;
    display: : flex;
    flex: 1;
`);

const close = Theme.css(`
    position: absolute;
    right: 8px;
    top: 8px;
`);

const button = Theme.css(`
    padding-left: 0;
`);

const spin = Theme.css(`
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
`);

const row = Theme.css(`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`);

export const s = {
    container,
    content,
    close,
    row,
    button,
    spin,
};
