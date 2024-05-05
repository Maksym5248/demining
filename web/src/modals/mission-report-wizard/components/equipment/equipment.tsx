import { Form} from 'antd';
import { observer } from 'mobx-react';

import { SelectAsync } from '~/components'
import { MODALS, WIZARD_MODE } from '~/constants';
import { useStore, useSelectStore } from '~/hooks';
import { Modal } from '~/services';
import { IEquipmentAction } from '~/stores';
import { select } from '~/utils';

import { IMissionReportForm } from '../../mission-report-wizard.types';

interface EquipmentProps {
	initialValues: Pick<Partial<IMissionReportForm>, "mineDetectorId">
	selectedMineDetector?: IEquipmentAction;
}

export const Equipment = observer(({ initialValues, selectedMineDetector }: EquipmentProps ) => {
	const { equipment } = useStore();

	const { initialItem, ...props} = useSelectStore(equipment, initialValues.mineDetectorId);
	
	const onAdd = () => Modal.show(MODALS.EQUIPMENT_WIZARD, { mode: WIZARD_MODE.CREATE})
	
	return <Form.Item
		label="Міношукач"
		name="mineDetectorId"
		rules={[{ required: true, message: 'Обов\'язкове поле' }]}
	>
		<SelectAsync
			{...props}
			onAdd={onAdd}
			options={select.append(
				equipment.listMineDetectors.map((el) => ({ label: el.name, value: el.id })),
				[
					{ label: selectedMineDetector?.name, value: selectedMineDetector?.equipmentId },
					{ label: initialItem?.name, value: initialItem?.id }
				].filter(el => !!el.value)
			)}
		/>
	</Form.Item>
})