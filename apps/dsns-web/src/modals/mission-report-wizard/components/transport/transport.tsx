import { useCallback } from 'react';

import { Form } from 'antd';
import { observer } from 'mobx-react';
import { useSelectStore } from 'shared-my-client/common';
import { type ITransportAction } from 'shared-my-client/stores';

import { SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';
import { select } from '~/utils';

import { type IMissionReportForm } from '../../mission-report-wizard.types';

interface TransportProps {
    initialValues: Pick<Partial<IMissionReportForm>, 'transportExplosiveObjectId' | 'transportHumansId'>;

    selectedTransportHumanAction?: ITransportAction;
    selectedTransportExplosiveAction?: ITransportAction;
}

export const Transport = observer(({ selectedTransportHumanAction, selectedTransportExplosiveAction, initialValues }: TransportProps) => {
    const { transport } = useStore();

    const { initialItem: explosiveObjectItem, ...explosiveObjectProps } = useSelectStore(
        transport,
        initialValues.transportExplosiveObjectId,
    );
    const { initialItem: humansItem, ...humansProps } = useSelectStore(transport, initialValues.transportHumansId);

    const onAdd = useCallback(() => {
        Modal.show(MODALS.TRANSPORT_WIZARD, { mode: WIZARD_MODE.CREATE });
    }, []);

    return (
        <>
            <Form.Item label="Авто для ВР" name="transportExplosiveObjectId">
                <SelectAsync
                    {...explosiveObjectProps}
                    onAdd={onAdd}
                    options={select.append(
                        transport.transportExplosiveObjectList.map((el) => ({
                            label: el.fullName,
                            value: el.data.id,
                        })),
                        [
                            {
                                label: selectedTransportExplosiveAction?.transport.fullName,
                                value: selectedTransportExplosiveAction?.data.transportId,
                            },
                            {
                                label: explosiveObjectItem?.fullName,
                                value: explosiveObjectItem?.data.id,
                            },
                        ].filter((el) => !!el.value),
                    )}
                />
            </Form.Item>
            <Form.Item label="Авто для О/С" name="transportHumansId">
                <SelectAsync
                    {...humansProps}
                    onAdd={onAdd}
                    options={select.append(
                        transport.transportHumansList.map((el) => ({
                            label: el.fullName,
                            value: el.data.id,
                        })),
                        [
                            {
                                label: selectedTransportHumanAction?.transport.fullName,
                                value: selectedTransportHumanAction?.data.transportId,
                            },
                            { label: humansItem?.fullName, value: humansItem?.data.id },
                        ].filter((el) => !!el.value),
                    )}
                />
            </Form.Item>
        </>
    );
});
