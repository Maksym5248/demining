import React, { useEffect } from 'react';

import { List, Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { Icon } from '~/components';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';
import { IOrder } from '~/stores';

import { s } from './orders-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IOrder}) => {
  const store = useStore();

  const onGoToOrderEdit = (id:string) => (e:React.SyntheticEvent) => {
    e.preventDefault();
    console.log('TEST')
    Modal.show(MODALS.ORDER_CREATE, { id })
  };

  const onRemove = (id:string) => (e: React.MouseEvent<HTMLElement>) => {
    store.order.removeOrder.run(id);
  };
  
  const onCancel = (e: React.MouseEvent<HTMLElement>) => {
    message.error('Скасовано');
  };

  return (
    <List.Item
      actions={[
       <Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoToOrderEdit(item.id)}/>,
       <Popconfirm
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
          avatar={<Icon.FileTextOutlined />}
          title={`№${item.number}`}
          description={
            <Space css={s.listItemDesc}>
                <Text type="secondary">{item.signedAt.format('DD/MM/YYYY')}</Text>
            </Space>
          }
        >
          </List.Item.Meta>
    </List.Item>
  )
});

export const OrdersListPage: React.FC = observer(() => {
  const store = useStore();
  const title = useRouteTitle();

  const onGoToEmployeesCreate = (e:React.SyntheticEvent) => {
    e.preventDefault();
    Modal.show(MODALS.ORDER_CREATE)
  };

  useEffect(() => {
    store.order.fetchOrders.run();
  }, []);

  return (
    <List
      rowKey="id"
      itemLayout="horizontal"
      loading={store.order.fetchOrders.inProgress}
      dataSource={store.order.orderList.asArray}
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