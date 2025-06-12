import { Theme } from '~/styles';

const panel = Theme.css(`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    gap: 8px;
    position: absolute;
    top: 10px;
    left: 0;
    right: 0;
    z-index: 10;
`);

const zoom = Theme.css(`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    position: absolute;
    bottom: 16px;
    right: 16px;
    z-index: 10;
`);

const components = Theme.css(`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    gap: 8px;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
`);

export const s = {
    zoom,
    panel,
    components,
};
