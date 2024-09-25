import { Form } from 'antd';
import { observer } from 'mobx-react';
import { useSelectStore } from 'shared-my-client';
import { type IEquipmentAction } from 'shared-my-client';

import { SelectAsync } from '~/components';
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore } from '~/hooks';
import { Modal } from '~/services';
import { select } from '~/utils';

import { type IMissionReportForm } from '../../mission-report-wizard.types';

interface EquipmentProps {
    initialValues: Pick<Partial<IMissionReportForm>, 'mineDetectorId'>;
    selectedMineDetector?: IEquipmentAction;
}

export const Equipment = observer(({ initialValues, selectedMineDetector }: EquipmentProps) => {
    const { equipment } = useStore();

    const { initialItem, ...props } = useSelectStore(equipment, initialValues.mineDetectorId);

    const onAdd = () => Modal.show(MODALS.EQUIPMENT_WIZARD, { mode: WIZARD_MODE.CREATE });

    return (
        <Form.Item label="Міношукач" name="mineDetectorId" rules={[{ required: true, message: "Обов'язкове поле" }]}>
            <SelectAsync
                {...props}
                onAdd={onAdd}
                options={select.append(
                    equipment.listMineDetectors.map((el) => ({ label: el.data.name, value: el.data.id })),
                    [
                        {
                            label: selectedMineDetector?.data.name,
                            value: selectedMineDetector?.data.equipmentId,
                        },
                        { label: initialItem?.data.name, value: initialItem?.data.id },
                    ].filter((el) => !!el.value),
                )}
            />
        </Form.Item>
    );
});
