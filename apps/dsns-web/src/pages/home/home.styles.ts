import { Theme } from '~/styles';

const container = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    padding-top: 24px;
    gap: 24px;
`);

const header = Theme.css(`
    display: flex;
    justify-content: space-between;
`);

const mainData = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
`);

const card = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
`);

export const s = {
    header,
    container,
    mainData,
    card,
};
