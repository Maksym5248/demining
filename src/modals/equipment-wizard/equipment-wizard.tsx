import { useEffect } from 'react';

import { Form, Select, Drawer, Input, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { EQUIPMENT_TYPE, WIZARD_MODE } from "~/constants"
import { useStore, useWizard } from '~/hooks'
import { WizardButtons, WizardFooter } from '~/components';

import { s } from './equipment-wizard.style'
import { IEquipmentForm } from './equipment-wizard.types';

interface Props {
  id?: string;
  isVisible: boolean;
  mode: WIZARD_MODE
  hide: () => void
}

const typeOptions = [{
	label: "Міношукач",
	value: EQUIPMENT_TYPE.MINE_DETECTOR
}]

export const EquipmentWizardModal  = observer(({ id, isVisible, hide, mode }: Props) => {
	const store = useStore();
	const wizard = useWizard({id, mode});

	const equipment = store.equipment.collection.get(id as string);

	useEffect(() => {
		store.equipment.fetchList.run();
	}, []);

	const isEdit = !!id;
	const isLoading = !store.equipment.fetchList.isLoaded && store.equipment.fetchList.inProgress;

	const onFinishCreate = async (values: IEquipmentForm) => {
		await store.equipment.add.run(values);
		hide();
	};

	const onFinishUpdate = async (values: IEquipmentForm) => {
		await equipment.update.run(values);
		hide();
	};

	const onRemove = () => () => {
		store.equipment.remove.run(id);
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} обладнання`}
			placement="right"
			width={500}
			onClose={hide}
			extra={
				<WizardButtons
					onRemove={onRemove}
					isRemove={!wizard.isCreate}
					isSave={!wizard.isCreate}
					{...wizard}
				/>
			}
		>
			{ isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="complex-form"
						onFinish={isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						disabled={wizard.isView}
						initialValues={equipment
							? ({ ...equipment})
							: {  type: EQUIPMENT_TYPE.MINE_DETECTOR }
						}
					>
						<Form.Item
							label="Назва"
							name="name"
							rules={[{ required: true, message: 'Назва є обов\'язковим полем' }]}
						>
							<Input placeholder="Введіть дані" />
						</Form.Item>
						<Form.Item
							label="Тип"
							name="type"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select
								options={typeOptions}
							/>
						</Form.Item>
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});

