import React from 'react';

import { Button, Form, Space, InputNumber, DatePicker, Drawer, Select, Divider} from 'antd';
import { observer } from 'mobx-react-lite'
import { PlusOutlined } from '@ant-design/icons';

import { useStore } from '~/hooks'
import { Modal } from '~/services'
import { MODALS } from '~/constants'

import { IEmployeeForm } from './mission-report-create.types';
import { s } from './mission-report-create.styles';

const { Option } = Select;

// номер акту маю бути за порядком + 1;

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const MissionReportCreateModal: React.FC = observer(({ id, isVisible, hide }: Props) => {
  const store = useStore();

  const employee = store.employee.collection.get(id);

  const isEdit = !!id;

  const onAddOrder = () => {
    Modal.show(MODALS.ORDER_CREATE)
  };

  const onFinishCreate = async (values: IEmployeeForm) => {
    await store.employee.add.run(values);
    hide();
  };

  const onFinishUpdate = async (values: IEmployeeForm) => {
    await employee.update.run(values);
    hide();
  };

  return (
    <Drawer
      open={isVisible}
      destroyOnClose
      title={`${isEdit ? "Редагувати": "Створити"} акт виконаних робіт`}
      placement="right"
      width={500}
      onClose={hide}
    >
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
          <Form.Item label="Номер" style={{ marginBottom: 0 }}>
                <Form.Item
                  name="number"
                  rules={[{ required: true }]}
                  css={s.number}
                >
                    <InputNumber size="middle" min={1} max={100000} />
                </Form.Item>
                <Form.Item
                  name="subNumber"
                  css={s.subNumber}
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
          <Form.Item
                label="Наказ"
                name="signedBy"
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
                options={store.order.list.asArray.map((el) => ({ label: `№${el.number} ${el.signedAt.format('DD/MM/YYYY')}`, value: el.id }))}
              />
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
    </Drawer>
  );
});



// let index = 0;

// const App: React.FC = () => {
//   const [items, setItems] = useState(['jack', 'lucy']);
//   const [name, setName] = useState('');
//   const inputRef = useRef<InputRef>(null);

//   const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setName(event.target.value);
//   };

//   const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
//     e.preventDefault();
//     setItems([...items, name || `New item ${index++}`]);
//     setName('');
//     setTimeout(() => {
//       inputRef.current?.focus();
//     }, 0);
//   };

//   return (
//     <Select
//       style={{ width: 300 }}
//       placeholder="custom dropdown render"
//       dropdownRender={(menu) => (
//         <>
//           {menu}
//           <Divider style={{ margin: '8px 0' }} />
//           <Space style={{ padding: '0 8px 4px' }}>
//             <Input
//               placeholder="Please enter item"
//               ref={inputRef}
//               value={name}
//               onChange={onNameChange}
//               onKeyDown={(e) => e.stopPropagation()}
//             />
//             <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
//               Add item
//             </Button>
//           </Space>
//         </>
//       )}
//       options={items.map((item) => ({ label: item, value: item }))}
//     />
//   );
// };

// export default App;