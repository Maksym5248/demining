import React, { useEffect } from 'react';

import { List, Button, Typography, Space, message, Popconfirm } from 'antd';
import { observer } from 'mobx-react';

import { IEmployee } from '~/stores';
import { Icon } from '~/components';
import { str } from '~/utils';
import { useStore, useRouteTitle } from '~/hooks';
import { Modal } from '~/services';
import { MODALS } from '~/constants';

import { s } from './mission-reports-list.styles';

const { Title, Text } = Typography;


const ListItem = observer(({ item }: { item: IEmployee}) => {
  const store = useStore();

  const onGoToEmployeesEdit = (id:string) => (e:React.SyntheticEvent) => {
    e.preventDefault();
    Modal.show(MODALS.MISSION_REPORT_CREATE, { id })
  };

  const onRemove = (id:string) => (e: React.MouseEvent<HTMLElement>) => {
    store.employee.removeEmployee.run(id);
  };
  
  const onCancel = (e: React.MouseEvent<HTMLElement>) => {
    message.error('Скасовано');
  };

  return (
    <List.Item
      actions={[
       <Button key="list-edit" icon={<Icon.EditOutlined type="danger"/>} onClick={onGoToEmployeesEdit(item.id)}/>,
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
          avatar={<Icon.UserOutlined />}
          title={str.getFullName(item)}
          description={
            <Space css={s.listItemDesc}>
                <Text type="secondary">{str.upperFirst(item.rank.fullName)}</Text>
                <Text type="secondary">{str.upperFirst(item.position)}</Text>
            </Space>
          }
        >
          </List.Item.Meta>
    </List.Item>
  )
});

export const MissionReportsListPage: React.FC = observer(() => {
  const title = useRouteTitle();

  const store = useStore();

  const onGoToMissionReportCreate = (e:React.SyntheticEvent) => {
    e.preventDefault();
    Modal.show(MODALS.MISSION_REPORT_CREATE)
  };

  useEffect(() => {
    store.employee.fetchEmployees.run();
  }, []);

  return (
    <List
      rowKey="id"
      itemLayout="horizontal"
      loading={store.employee.fetchEmployees.inProgress}
      dataSource={store.employee.employeesList.asArray}
      header={
        <Space css={s.listHeader}>
            <Title level={4}>{title}</Title>
            <Button type="primary" icon={<Icon.FileAddOutlined />} onClick={onGoToMissionReportCreate}/>
        </Space>
      }
      renderItem={(item) => <ListItem item={item}/>}
    />
  );
});