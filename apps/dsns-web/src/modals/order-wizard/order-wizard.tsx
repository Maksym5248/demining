import { useEffect } from 'react';

import { Form, DatePicker, Drawer, InputNumber, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { dates } from 'shared-my-client';

import { WizardButtons, Select, WizardFooter } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useWizard } from '~/hooks';
import { Modal } from '~/services';
import { select } from '~/utils';

import { s } from './order-wizard.style';
import { type IOrderForm } from './order-wizard.types';

interface Props {
    id?: string;
    isVisible: boolean;
    hide: () => void;
    mode: WIZARD_MODE;
}

export const OrderWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
    const { order, employee } = useStore();
    const wizard = useWizard({ id, mode });

    const currentOrder = order.collection.get(id as string);
    const { chiefs } = employee;
    const employeeChiefFirst = chiefs[0];

    useEffect(() => {
        if (id) order.fetchItem.run(id);
        employee.fetchListAll.run();
    }, []);

    const isEdit = !!id;
    const isLoading = order?.fetchItem.isLoading;
    const onAdd = () => Modal.show(MODALS.EMPLOYEES_WIZARD, { mode: WIZARD_MODE.CREATE });

    const onFinishCreate = async (values: IOrderForm) => {
        await order.create.run(values);
        hide();
    };

    const onFinishUpdate = async (values: IOrderForm) => {
        await currentOrder?.update.run(values);
        hide();
    };

    const onRemove = () => {
        !!id && order.remove.run(id);
        hide();
    };

    return (
        <Drawer
            open={isVisible}
            destroyOnClose
            title={`${isEdit ? 'Редагувати' : 'Створити'} наказ`}
            placement="right"
            width={500}
            onClose={hide}
            extra={<WizardButtons {...wizard} />}>
            {isLoading ? (
                <Spin css={s.spin} />
            ) : (
                <Form
                    name="order-form"
                    onFinish={isEdit ? onFinishUpdate : onFinishCreate}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    disabled={wizard.isView}
                    initialValues={
                        currentOrder
                            ? {
                                  ...currentOrder,
                                  signedById: currentOrder?.signedByAction?.data.employeeId,
                              }
                            : {
                                  number: (order.list.first?.data.number ?? 0) + 1,
                                  signedById: order.list.first?.signedByAction?.data.employeeId || employeeChiefFirst?.data.id,
                                  signedAt: dates.today(),
                              }
                    }>
                    <Form.Item label="Номер" name="number" rules={[{ required: true }]}>
                        <InputNumber size="middle" min={1} max={100000} />
                    </Form.Item>
                    <Form.Item label="Дата підписання" name="signedAt" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Підписав" name="signedById" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                        <Select
                            onAdd={onAdd}
                            options={select.append(
                                chiefs.map((el) => ({ label: el.fullName, value: el.data.id })),
                                {
                                    label: currentOrder?.signedByAction?.employee.fullName,
                                    value: currentOrder?.signedByAction?.data.employeeId,
                                },
                            )}
                        />
                    </Form.Item>
                    <WizardFooter {...wizard} onCancel={hide} onRemove={onRemove} />
                </Form>
            )}
        </Drawer>
    );
});
