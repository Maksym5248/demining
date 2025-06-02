import { Button } from 'antd';

import { s } from './books-pdf-preview.styles';

type PdfSettingsPanelProps = {
    showPanel: boolean;
    setShowPanel: (v: boolean) => void;
    showPageInput: boolean;
    setShowPageInput: (v: boolean) => void;
    showZoom: boolean;
    setShowZoom: (v: boolean) => void;
    onClose: () => void;
};

export function PdfSettingsPanel({
    showPanel,
    setShowPanel,
    showPageInput,
    setShowPageInput,
    showZoom,
    setShowZoom,
    onClose,
}: PdfSettingsPanelProps) {
    return (
        <div css={s.settingsPanel}>
            <label style={{ display: 'block', marginBottom: 8 }}>
                <input type="checkbox" checked={showPanel} onChange={e => setShowPanel(e.target.checked)} /> Show Panel
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
                <input type="checkbox" checked={showPageInput} onChange={e => setShowPageInput(e.target.checked)} /> Show Page Input
            </label>
            <label style={{ display: 'block', marginBottom: 8 }}>
                <input type="checkbox" checked={showZoom} onChange={e => setShowZoom(e.target.checked)} /> Show Zoom Controls
            </label>
            <Button onClick={onClose} style={{ marginTop: 8 }} size="small">
                Close
            </Button>
        </div>
    );
}
