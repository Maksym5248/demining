import { Theme } from '~/styles';

const container = Theme.css(`
    position: relative;
    height: calc(100vh - 48px);
    width: 100%;
    overflow: hidden;
`);

const content = Theme.css(`
    width: 100%;
    max-height: calc(100vh - 48px);
    overflow: auto;
`);

const pdfContent = Theme.css(`
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
`);

const settingsButton = Theme.css(`
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 11;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 8px;
    box-shadow: 0 2px 8px #0001;
    cursor: pointer;
    margin: 0;
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

export const s = {
    container,
    content,
    document,
    settingsButton,
    pdfContent,
    settingsPanel,
};
