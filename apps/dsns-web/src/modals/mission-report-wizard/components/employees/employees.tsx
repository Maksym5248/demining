import { useCallback } from 'react';

import { CloseOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { type IEmployee, type IEmployeeAction } from 'shared-my-client/stores';

import { Select } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { Modal } from '~/services';
import { select } from '~/utils';

interface IEmployeesProps {
    squadLeads: IEmployee[];
    workers: IEmployee[];
    selectedSquadLead?: IEmployeeAction;
    selectedWorkers?: IEmployeeAction[];
}

export function Employees({ squadLeads, workers, selectedSquadLead, selectedWorkers }: IEmployeesProps) {
    const onAdd = useCallback(() => {
        Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE });
    }, []);

    return (
        <>
            <Form.Item label="Керівник розрахунку" name="squadLeaderId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                <Form.Item noStyle shouldUpdate={() => true}>
                    {({ getFieldValue }) => {
                        const squadIds = getFieldValue('squadIds');

                        return (
                            <Select
                                options={select.append(
                                    squadLeads
                                        .filter((el) => !squadIds.includes(el.data.id))
                                        .map((el) => ({ label: el.fullName, value: el.data.id })),
                                    {
                                        label: selectedSquadLead?.employee.fullName,
                                        value: selectedSquadLead?.data.employeeId,
                                    },
                                )}
                                value={getFieldValue('squadLeaderId')}
                                onAdd={onAdd}
                            />
                        );
                    }}
                </Form.Item>
            </Form.Item>
            <Form.Item label="Розрахунок" name="squadIds" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                <Form.List name="squadIds">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Form.Item key={key} noStyle shouldUpdate={() => true}>
                                    {({ getFieldValue }) => {
                                        const squadIds = getFieldValue('squadIds');
                                        const squadLeaderId = getFieldValue('squadLeaderId');

                                        const currentSelectedId = squadIds[name];
                                        const selected = selectedWorkers?.find((el) => el.data.employeeId === currentSelectedId);

                                        return (
                                            <Form.Item name={name} {...restField}>
                                                <Select
                                                    options={select.append(
                                                        workers
                                                            .filter((el) => el.data.id !== squadLeaderId)
                                                            .filter(
                                                                (el) => el.data.id === currentSelectedId || !squadIds.includes(el.data.id),
                                                            )
                                                            .map((el) => ({
                                                                label: el?.fullName,
                                                                value: el.data.id,
                                                            })),
                                                        {
                                                            label: selected?.employee.fullName,
                                                            value: selected?.data.employeeId,
                                                        },
                                                    )}
                                                    value={currentSelectedId}
                                                    suffixIcon={
                                                        currentSelectedId ? (
                                                            <CloseOutlined
                                                                onClick={() => {
                                                                    remove(name);
                                                                }}
                                                            />
                                                        ) : (
                                                            <DownOutlined />
                                                        )
                                                    }
                                                    onAdd={onAdd}
                                                />
                                            </Form.Item>
                                        );
                                    }}
                                </Form.Item>
                            ))}
                            <Form.Item noStyle shouldUpdate={() => true}>
                                {({ getFieldValue }) => {
                                    const squadIds = getFieldValue('squadIds');
                                    const squadLeaderId = getFieldValue('squadLeaderId');

                                    const freeWorkers = workers.filter(
                                        (el) => !(el.data.id === squadLeaderId || squadIds.includes(el.data.id)),
                                    );

                                    return (
                                        !!freeWorkers.length && (
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Додати
                                            </Button>
                                        )
                                    );
                                }}
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
        </>
    );
}
