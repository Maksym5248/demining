import { Button, Dropdown, type MenuProps, Space, Tooltip } from 'antd';

import { Icon } from '../icon';

interface DrawerExtraProps extends React.PropsWithChildren {
    onEdit?: () => void;
    onView?: () => void;
    onSave?: () => void;
    isView?: boolean;
    isEdit?: boolean;
    isSave?: boolean;
    menu?: MenuProps['items'];
}

export function WizardButtons({ onEdit, onView, onSave, isView, isEdit, isSave, children, menu }: DrawerExtraProps) {
    const items: MenuProps['items'] = [];

    if (onSave && isSave) {
        items.push({
            label: 'WORD',
            key: 'word',
            icon: <Icon.DownloadOutlined />,
            onClick: onSave,
        });
    }

    if (menu) {
        items.push(...menu);
    }

    return (
        <Space>
            {children}
            {!!onView && isEdit && (
                <Tooltip placement="bottomRight" title="Переглянути" arrow>
                    <Button icon={<Icon.EyeOutlined />} onClick={onView} />
                </Tooltip>
            )}
            {!!onEdit && isView && (
                <Tooltip placement="bottomRight" title="Редагувати" arrow>
                    <Button icon={<Icon.EditOutlined />} onClick={onEdit} />
                </Tooltip>
            )}
            {!!items.length && isView && (
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button icon={<Icon.MoreOutlined />} />
                </Dropdown>
            )}
        </Space>
    );
}
