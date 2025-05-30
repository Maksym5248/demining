import { useCallback, useState } from 'react';

import { Drawer, Tabs, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { useStore } from '~/hooks';

import { type Tab, type BookPluginProps } from './book-plugin.types';
import { BooksList, BooksPdfPreview } from './containers';

const createTab = (key: string, label: string, children: React.ReactNode) => ({
    label,
    key,
    children,
});

const createPdfPreviewTab = (key: string, label: string, children: React.ReactNode) => ({
    label: `Pdf ${label}`,
    key: `pdf-${key}`,
    children,
});

export const BookPluginModal = observer(({ isVisible, hide }: BookPluginProps) => {
    const { book } = useStore();

    const [activeKey, setActiveKey] = useState('booksList');
    const [tabs, setTabs] = useState<Tab[]>([]);

    const openBook = useCallback((id: string) => {
        const item = book.collection.get(id);

        if (!item) {
            message.error('Книгу не завантажено');
            return;
        }

        const tab = createPdfPreviewTab(id, item.displayName, <BooksPdfPreview />);
        setActiveKey(tab.key);
        setTabs(prev => [...prev, tab]);
    }, []);

    const intialTab = createTab('booksList', 'Книги', <BooksList onOpenBook={openBook} />);

    const onChange = (key: string) => setActiveKey(key);

    return (
        <Drawer open={isVisible} placement="left" width="50%" onClose={hide}>
            <Tabs hideAdd defaultActiveKey="booksList" activeKey={activeKey} onChange={onChange} items={[intialTab, ...tabs]} />
        </Drawer>
    );
});
