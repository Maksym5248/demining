import { useCallback } from 'react';

import { Form } from 'antd';
import { observer } from 'mobx-react';

import { SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useSelectStore } from '~/hooks';
import { Modal } from '~/services';
import { type ITransportAction } from '~/stores';
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
                            value: el.id,
                        })),
                        [
                            {
                                label: selectedTransportExplosiveAction?.transport.fullName,
                                value: selectedTransportExplosiveAction?.transportId,
                            },
                            {
                                label: explosiveObjectItem?.fullName,
                                value: explosiveObjectItem?.id,
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
                            value: el.id,
                        })),
                        [
                            {
                                label: selectedTransportHumanAction?.transport.fullName,
                                value: selectedTransportHumanAction?.transportId,
                            },
                            { label: humansItem?.fullName, value: humansItem?.id },
                        ].filter((el) => !!el.value),
                    )}
                />
            </Form.Item>
        </>
    );
});