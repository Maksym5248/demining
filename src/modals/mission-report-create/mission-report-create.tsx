import React, { useEffect } from 'react';

import { Button, Form, Space, InputNumber, DatePicker, TimePicker, Drawer, Select, Divider, Input, Spin} from 'antd';
import { observer } from 'mobx-react-lite'
import { PlusOutlined } from '@ant-design/icons';

import { useStore } from '~/hooks'
import { Modal } from '~/services'
import { MODALS } from '~/constants'

import { IMissionReportForm } from './mission-report-create.types';
import { s } from './mission-report-create.styles';

const { Option } = Select;

// номер акту маю бути за порядком + 1;

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const MissionReportCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const { explosiveObject, order, missionRequest} = useStore();

  const isEdit = !!id;

  const onAddOrder = () => {
    Modal.show(MODALS.ORDER_CREATE)
  };

  const onAddMissionRequest = () => {
    Modal.show(MODALS.MISSION_REQUEST_CREATE)
  };

  const onFinishCreate = async (values: IMissionReportForm) => {
    // await employee.add.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IMissionReportForm) => {
    // await employee.update.run(values);
    hide();
  };

  useEffect(() => {
      explosiveObject.fetchList.run();
      order.fetchList.run();
      missionRequest.fetchList.run();
  }, [])

  const isLoading = explosiveObject.fetchList.inProgress || order.fetchList.inProgress || missionRequest.fetchList.inProgress;

  return (
    <Drawer
      open={isVisible}
      destroyOnClose
      title={`${isEdit ? "Редагувати": "Створити"} акт виконаних робіт`}
      placement="right"
      width={700}
      onClose={hide}
    >
    { isLoading
      ? (<Spin css={s.spin} />)
      : (
        <Form
          name="complex-form"
          onFinish={isEdit ? onFinishUpdate : onFinishCreate}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
            <Form.Item
              label="Дата затвердження"
              name="approvedAt"
              rules={[{ required: true, message: 'Дата затвердження є обов\'язковим полем' }]}
            >
                  <DatePicker />
            </Form.Item>
            <Form.Item label="Номер" css={s.item}>
                  <Form.Item
                    name="number"
                    rules={[{ required: true }]}
                    css={s.first}
                  >
                      <InputNumber size="middle" min={1} max={100000} />
                  </Form.Item>
                  <Form.Item
                    name="subNumber"
                    css={s.last}
                  >
                      <InputNumber size="middle" min={1} max={100000}/>
                </Form.Item>
            </Form.Item>
            
            <Form.Item
              label="Дата виконання"
              name="executedAt"
              rules={[{ required: true, message: 'Дата виконання є обов\'язковим полем' }]}
            >
                  <DatePicker />
            </Form.Item>
            <Divider/>
            <Form.Item
                  label="Наказ"
                  name="orderId"
                  rules={[{ required: true, message: 'Обов\'язкове поле' }]}
                >
                <Select
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                          <Button type="text" icon={<PlusOutlined />} onClick={onAddOrder}>Додати наказ</Button>
                      </Space>
                    </>
                  )}
                  options={order.list.asArray.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
                />
              </Form.Item>
              <Form.Item
                  label="Заявка"
                  name="missionRequestId"
                  rules={[{ required: true, message: 'Обов\'язкове поле' }]}
                >
                <Select
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <Space style={{ padding: '0 8px 4px' }}>
                          <Button type="text" icon={<PlusOutlined />} onClick={onAddMissionRequest}>Додати заявку</Button>
                      </Space>
                    </>
                  )}
                  options={missionRequest.list.asArray.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
                />
              </Form.Item>
              <Divider/>
              <Form.Item label="Обстежено, м2" css={s.item}>
                  <Form.Item
                    name="checkedTerritory"
                    rules={[{ required: true }]}
                    css={s.first}
                  >
                      <InputNumber size="middle" min={1} max={100000} />
                  </Form.Item>
                  <Form.Item
                    name="depthExamination"
                    label="на глибину, м"
                    css={s.last}
                  >
                      <InputNumber size="middle" min={1} max={100000}/>
                </Form.Item>
            </Form.Item>
            <Form.Item label="Не можливо обстежити, м2" css={s.item}>
                  <Form.Item
                    name="uncheckedTerritory"
                    rules={[{ required: true }]}
                    css={s.first}
                  >
                      <InputNumber size="middle" min={1} max={100000} />
                  </Form.Item>
            </Form.Item>
            <Form.Item
             label="Причина"
              name="uncheckedReason"
              css={s.item}
            >
              <Input size="middle" />
            </Form.Item>
            <Divider/>
            <Form.Item
              label="Вилучення з:"
              css={s.item}
            >
                <Form.Item
                  name="exclusionStart"
                  css={s.first}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
                <Form.Item
                 label="по"
                  name="exclusionEnd"
                  css={s.last}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
            </Form.Item>
            <Form.Item
              label="Транспортування з:"
              css={s.item}
            >
                <Form.Item
                  name="transportingStart"
                  css={s.first}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
                <Form.Item
                 label="по"
                  name="transportingEnd"
                  css={s.last}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
            </Form.Item>
            <Form.Item
              label="Знищення з:"
              css={s.item}
            >
                <Form.Item
                  name="destroyedStart"
                  css={s.first}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
                <Form.Item
                  label="по"
                  name="destroyedEnd"
                  css={s.last}
                >
                  <TimePicker format="HH:mm"/>
                </Form.Item>
            </Form.Item>
            <Divider/>
            <Form.Item label="Виявлено ВНП" css={s.item}>
                <Form.Item
                    name="explosiveObjectId"
                    rules={[{ required: true, message: 'Обов\'язкове поле' }]}
                >
                  <Select
                    options={explosiveObject.sortedList.map((el) => ({ label: el.fullDisplayName, value: el.id }))}
                  />
                </Form.Item>
                <Form.Item
                  name="number"
                  rules={[{ required: true }]}
                  css={s.first}
                >
                  <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
                <Form.Item
                  name="subNumber"
                  label="на глибину, м"
                  css={s.last}
                >
                  <InputNumber size="middle" min={1} max={100000}/>
                </Form.Item>
            </Form.Item>
            <Form.Item label=" " colon={false}>
                <Space>
                  <Button onClick={hide}>Скасувати</Button>
                  <Button htmlType="submit" type="primary">
                    {isEdit ? "Зберегти" : "Додати"}
                  </Button>
                </Space>
              </Form.Item>
        </Form>
      )}
    </Drawer>
  );
});