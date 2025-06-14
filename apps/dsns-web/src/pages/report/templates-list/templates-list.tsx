import React, { useEffect } from 'react';

import { Button, Typography, Space } from 'antd';
import { observer } from 'mobx-react';
import { type IDocument } from 'shared-my-client';

import { Icon, List, ListHeader } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useRouteTitle, useSearch } from '~/hooks';
import { Modal } from '~/services';
import { str } from '~/utils';

import { s } from './templates-list.styles';

const { Text } = Typography;

const ListItem = observer(({ item }: { item: IDocument }) => {
    const onOpen = (e: React.SyntheticEvent) => {
        e.preventDefault();
        Modal.show(MODALS.TEMPLATE_WIZARD, { id: item.id, mode: WIZARD_MODE.VIEW });
    };

    return (
        <List.Item actions={[<Button key="list-view" icon={<Icon.EyeOutlined />} onClick={onOpen} />]}>
            <List.Item.Meta
                avatar={<Icon.FileTextOutlined />}
                title={item.data.name}
                description={
                    <Space css={s.listItemDesc}>
                        <Text type="secondary">{str.getValue(item.data.documentType)}</Text>
                    </Space>
                }
            />
        </List.Item>
    );
});

export const TemplatesListPage = observer(() => {
    const { document } = useStore();
    const title = useRouteTitle();
    const search = useSearch();

    const onCreate = () => {
        Modal.show(MODALS.TEMPLATE_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    const onOpenInfo = () => {
        Modal.show(MODALS.TEMPLATE_DATA_PREVIEW);
    };

    const onSearch = (value: string) => {
        search.updateSearchParams(value);
        document.fetchTemplatesList.run(value);
    };

    const onLoadMore = () => {
        document.fetchTemplatesListMore.run(search.searchValue);
    };

    useEffect(() => {
        document.fetchTemplatesList.run(search.searchValue);
    }, []);

    return (
        <List
            rowKey="id"
            itemLayout="horizontal"
            loading={document.fetchTemplatesList.isLoading}
            loadingMore={document.fetchTemplatesListMore.isLoading}
            isReachedEnd={!document.listTemplates.isMorePages}
            dataSource={document.listTemplates.asArray}
            onLoadMore={onLoadMore}
            header={<ListHeader title={title} onSearch={onSearch} onCreate={onCreate} onOpenInfo={onOpenInfo} {...search} />}
            renderItem={item => <ListItem item={item} />}
        />
    );
});
