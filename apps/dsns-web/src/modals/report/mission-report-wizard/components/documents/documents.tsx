import { useCallback } from 'react';

import { Form } from 'antd';
import { observer } from 'mobx-react';
import { useSelectStore } from 'shared-my-client';

import { SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';
import { select } from '~/utils';

import { type IMissionReportForm } from '../../mission-report-wizard.types';

interface IDocumentsProps {
    initialValues: Pick<Partial<IMissionReportForm>, 'orderId' | 'missionRequestId'>;
}

export const Documents = observer(({ initialValues }: IDocumentsProps) => {
    const { order, missionRequest } = useStore();

    const { initialItem: orderItem, ...orderProps } = useSelectStore(order, initialValues.orderId);
    const { initialItem: missionRequestItem, ...missionRequestProps } = useSelectStore(missionRequest, initialValues.missionRequestId);

    const onAddOrder = useCallback(() => {
        Modal.show(MODALS.ORDER_WIZARD, { mode: WIZARD_MODE.CREATE });
    }, []);

    const onAddMissionRequest = useCallback(() => {
        Modal.show(MODALS.MISSION_REQUEST_WIZARD, { mode: WIZARD_MODE.CREATE });
    }, []);

    return (
        <>
            <Form.Item label="Наказ" name="orderId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                <SelectAsync
                    {...orderProps}
                    onAdd={onAddOrder}
                    options={select.append(
                        orderProps.list.map((el) => ({ label: el?.displayValue, value: el.data.id })),
                        { label: orderItem?.displayValue, value: orderItem?.data.id },
                    )}
                />
            </Form.Item>
            <Form.Item label="Підстава" name="missionRequestId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
                <SelectAsync
                    {...missionRequestProps}
                    onAdd={onAddMissionRequest}
                    options={select.append(
                        missionRequestProps.list.map((el) => ({
                            label: el.displayValue,
                            value: el.data.id,
                        })),
                        {
                            label: missionRequestItem?.displayValue,
                            value: missionRequestItem?.data.id,
                        },
                    )}
                />
            </Form.Item>
        </>
    );
});
