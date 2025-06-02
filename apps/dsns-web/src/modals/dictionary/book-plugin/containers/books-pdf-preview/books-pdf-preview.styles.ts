import { Theme } from '~/styles';

const container = Theme.css(`
    position: relative;
    width: 100%;
    height: 100%;
`);

const panel = Theme.css(`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    gap: 8px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
`);

const settingsButton = Theme.css(`
    position: absolute;
    top: 8px;
    right: 16px;
    z-index: 11;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 8px;
    box-shadow: 0 2px 8px #0001;
    cursor: pointer;
`);

const settingsPanel = Theme.css(`
    position: absolute;
    top: 40px;
    right: 16px;
    z-index: 10;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 12px;
    box-shadow: 0 2px 8px #0001;
`);

const pdfContent = Theme.css(`
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`);

export const s = {
    container,
    panel,
    settingsButton,
    settingsPanel,
    pdfContent,
};
