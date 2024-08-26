import { Theme } from '~/styles';

const listHeader = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 8px;
`);

const listItemDesc = Theme.css(`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
`);

const image = Theme.css(`
    width: 80px;
    height: 60px;
`);

export const s = {
    listHeader,
    listItemDesc,
    image,
};
