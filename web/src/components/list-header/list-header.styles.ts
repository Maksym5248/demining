import { Theme } from '~/styles';

const container = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    padding-right: 8px;
`);

const search = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
`);

const title = Theme.css(`
    margin-top: 0;
`);

const buttons = Theme.css(`
    display: flex;
    gap: 8px;
`);

export const s = {
    container,
    search,
    title,
    buttons,
};
