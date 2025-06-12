import { useCallback, useState } from 'react';

import { Button, Drawer, Tabs, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { Icon } from '~/components';
import { BooksPdfAssets, BooksPdfPreview } from '~/containers';
import { useStore } from '~/hooks';

import { s } from './book-plugin.style';
import { type Tab, type BookPluginProps } from './book-plugin.types';
import { BooksList } from './containers';

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const createTab = (key: string, label: string, children: React.ReactNode, closable = true) => ({
    label,
    key,
    children,
    closable,
});

const createPdfPreviewTab = (key: string, label: string, children: React.ReactNode, closable = true) => ({
    label: `${label}`.slice(0, 15) + (label.length > 15 ? '...' : ''),
    key: `pdf-${key}`,
    children,
    closable,
});

const createPdfAssetsTab = (key: string, label: string, children: React.ReactNode, closable = true) => ({
    label: `${label}`.slice(0, 15) + (label.length > 15 ? '...' : ''),
    key: `assets-${key}`,
    children,
    closable,
});

const MAIN_TAB = 'booksList';
export const BookPluginModal = observer(({ isVisible, hide }: BookPluginProps) => {
    const { book } = useStore();

    const [activeKey, setActiveKey] = useState(MAIN_TAB);
    const [tabs, setTabs] = useState<Tab[]>([]);

    const onOpenComponents = useCallback((id: string, pageNumber: number) => {
        const item = book.collection.get(id);

        if (!item) {
            message.error('Книгу не завантажено');
            return;
        }

        const tab = createPdfAssetsTab(id, item.displayName, <BooksPdfAssets id={id} pageNumber={pageNumber} />);

        setTabs(prev => {
            if (prev.some(t => t.key === tab.key)) {
                return prev;
            }

            return [...prev, tab];
        });

        setActiveKey(tab.key);
    }, []);

    const openBook = useCallback((id: string) => {
        const item = book.collection.get(id);

        if (!item) {
            message.error('Книгу не завантажено');
            return;
        }

        const tab = createPdfPreviewTab(id, item.displayName, <BooksPdfPreview id={id} onOpenComponents={onOpenComponents} />);

        setTabs(prev => {
            if (prev.some(t => t.key === tab.key)) {
                return prev;
            }

            return [...prev, tab];
        });

        setActiveKey(tab.key);
    }, []);

    const intialTab = createTab(MAIN_TAB, 'Список', <BooksList onOpenBook={openBook} />, false);

    const onChange = (key: string) => setActiveKey(key);

    const remove = (targetKey: TargetKey) => {
        if (!tabs || targetKey === MAIN_TAB) return;

        const targetIndex = tabs.findIndex(item => item.key === targetKey);
        const newItems = tabs.filter(item => item.key !== targetKey);

        if (newItems.length && targetKey === activeKey) {
            const newActiveKey = newItems[targetIndex === newItems.length ? targetIndex - 1 : targetIndex].key;
            setActiveKey(newActiveKey);
        }

        setTabs(newItems);
        setActiveKey(newItems[0]?.key || MAIN_TAB);
    };

    const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
        if (action === 'remove') {
            remove(targetKey);
        }
    };
    return (
        <Drawer
            closable={false}
            open={isVisible}
            placement="left"
            width="50%"
            onClose={hide}
            mask={false}
            styles={{
                body: {
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flex: 1,
                    height: '100%',
                    width: '100%',
                },
            }}>
            <Button onClick={hide} css={s.close} type="text" icon={<Icon.CloseOutlined />} />
            <Tabs
                tabBarStyle={{ paddingLeft: 8, paddingRight: 8, paddingTop: 8, marginBottom: 0 }}
                type="editable-card"
                hideAdd
                activeKey={activeKey}
                onChange={onChange}
                onEdit={onEdit}
                style={{ height: '100%', width: '100%' }}
                items={[intialTab, ...tabs]}>
                {tabs.map(tab => (
                    <Tabs.TabPane
                        key={tab.key}
                        tab={tab.label}
                        closable={tab.closable}
                        style={{ height: '100%', width: '100%', position: 'relative' }}>
                        {tab.children}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        </Drawer>
    );
});
