import { Form, Input, Select, Drawer } from 'antd';
import { observer } from 'mobx-react-lite';
import { EMPLOYEE_TYPE } from 'shared-my/db';

import { WizardButtons, WizardFooter } from '~/components';
import { type WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';

import { type IEmployeeForm } from './employees-wizard.types';

const { Option } = Select;

const employeeTypesData = [
    {
        type: EMPLOYEE_TYPE.WORKER,
        name: 'Підлеглий',
    },
    {
        type: EMPLOYEE_TYPE.SQUAD_LEAD,
        name: 'Керівник розрахунку на виїзд',
    },
    {
        type: EMPLOYEE_TYPE.CHIEF,
        name: 'Керівник підрозділу',
    },
];

interface Props {
    id?: string;
    isVisible: boolean;
    mode: WIZARD_MODE;
    hide: () => void;
}

export const EmployeesWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const store = useStore();
    const wizard = useWizard({ id, mode });

    const employee = store.employee.collection.get(id as string);
    const isEdit = !!id;

    const onFinishCreate = async (values: IEmployeeForm) => {
        await store.employee.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IEmployeeForm) => {
        await employee?.update.run(values);
        hide();
    };

    const onRemove = () => {
        !!id && store.employee.remove.run(id);
        hide();
    };

    const ranks = store.employee.ranksList.asArray;

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} особовий склад`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            <Form
                name="emplooye-form"
                onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                disabled={wizard.isView}
                initialValues={
                    employee
                        ? { ...employee, rank: employee.rank?.id }
                        : {
                              type: employeeTypesData[0]?.type,
                              rankId: store.employee.ranksList.first?.id,
                          }
                }>
                <Form.Item label="Прізвище" name="lastName" rules={[{ required: true, message: "Прізвище є обов'язковим полем" }]}>
                    <Input placeholder="Введіть дані" />
                </Form.Item>
                <Form.Item label="Ім'я" name="firstName" rules={[{ required: true, message: "Ім'я є обов'язковим полем" }]}>
                    <Input placeholder="Введіть дані" />
                </Form.Item>
                <Form.Item label="По-батькові" name="surname" rules={[{ required: true, message: "По-батькові є обов'язковим полем" }]}>
                    <Input placeholder="Введіть дані" />
                </Form.Item>
                <Form.Item
                    label="Спеціальне звання"
                    name="rankId"
                    rules={[{ required: true, message: "Спеціальне звання є обов'язковим полем" }]}>
                    <Select>
                        {ranks.map((el) => (
                            <Option value={el.id} key={el.id}>
                                {el.fullName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Посада" name="position" rules={[{ required: true, message: "Посада є обов'язковим полем" }]}>
                    <Input.TextArea placeholder="Введіть дані" />
                </Form.Item>
                <Form.Item label="Тип посади" name="type" rules={[{ required: true, message: "Тип посади є обов'язковим полем" }]}>
                    <Select>
                        {employeeTypesData.map((el) => (
                            <Option value={el.type} key={el.type}>
                                {el.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
            </Form>
        </Drawer>
    );
});
