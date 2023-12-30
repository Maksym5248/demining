import React, { useEffect } from 'react';

import { List, Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { Icon } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';
import { IExplosiveObject } from '~/stores';

import { s } from './explosive-object-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IExplosiveObject}) => {
  const { explosiveObject } = useStore();

  const onGoEdit = (id:string) => (e:React.SyntheticEvent) => {
    e.preventDefault();
    Modal.show(MODALS.EXPLOSIVE_OBJECT_CREATE, { id })
  };

  const onRemove = (id:string) => () => {
    explosiveObject.remove.run(id);
  };
  
  const onCancel = () => {
    message.error('Скасовано');
  };

  return (
    <List.Item
      actions={[
       <Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoEdit(item.id)}/>,
       <Popconfirm
          key="list-remove"
          title="Видалити"
          description="Ви впевнені, після цього дані не можливо відновити ?"
          onConfirm={onRemove(item.id)}
          onCancel={onCancel}
          okText="Так"
          cancelText="Ні"
        >
          <Button key="list-remove" icon={<Icon.DeleteOutlined style={{ color: "red"}}/> }/>
        </Popconfirm>
      ]}
    >
        <List.Item.Meta
          title={item.type.fullName}
          description={
            <Space css={s.listItemDesc}>
                <Text type="secondary">{item.displayName}</Text>
            </Space>
          }
         />
    </List.Item>
  )
});

export const ExplosiveObjectListPage: React.FC = observer(() => {
  const { explosiveObject } = useStore();
  const title = useRouteTitle();

  const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
    e.preventDefault();
    Modal.show(MODALS.EXPLOSIVE_OBJECT_CREATE)
  };

  useEffect(() => {
    explosiveObject.fetchList.run();
  }, []);

  return (
    <List
      rowKey="id"
      itemLayout="horizontal"
      loading={explosiveObject.fetchList.inProgress}
      dataSource={explosiveObject.sortedList}
      header={
        <Space css={s.listHeader}>
            <Title level={4}>{title}</Title>
            <Button type="primary" icon={<Icon.FileAddOutlined />} onClick={onGoToEmployeesCreate}/>
        </Space>
      }
      renderItem={(item) => <ListItem item={item}/>}
    />
  );
});