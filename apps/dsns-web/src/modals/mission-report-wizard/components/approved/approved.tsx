import { Form, DatePicker } from 'antd';
import { type IEmployee, type IEmployeeAction } from 'shared-my-client/stores';

import { Select } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { select } from '~/utils';

interface ApprovedProps {
    data: IEmployee[];
    selectedEmployee?: IEmployeeAction;
}

export function Approved({ data, selectedEmployee }: ApprovedProps) {
    const onAddEmployee = () => {
        Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE });
    };

    return (
        <>
            <Form.Item
                label="Дата затвердження"
                name="approvedAt"
                rules={[{ required: true, message: "Дата затвердження є обов'язковим полем" }]}>
                <DatePicker />
            </Form.Item>
            <Form.Item label="Затвердив" name="approvedById" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                <Select
                    options={select.append(
                        data.map((el) => ({ label: el.fullName, value: el.data.id })),
                        { label: selectedEmployee?.employee.fullName, value: selectedEmployee?.data.employeeId },
                    )}
                    onAdd={onAddEmployee}
                />
            </Form.Item>
        </>
    );
}
