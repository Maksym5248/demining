import { useEffect } from 'react';

import { Button, Form, Select, Space, Drawer, Input, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { EQUIPMENT_TYPE } from "~/constants"
import { useStore } from '~/hooks'

import { s } from './equipment-create.style'
import { IEquipmentForm } from './equipment-create.types';

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

const typeOptions = [{
	label: "Міношукач",
	value: EQUIPMENT_TYPE.MINE_DETECTOR
}]

export const EquipmentCreateModal  = observer(({ id, isVisible, hide }: Props) => {
	const store = useStore();

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

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} обладнання`}
			placement="right"
			width={500}
			onClose={hide}
		>
			{ isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="complex-form"
						onFinish={isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
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
						<Form.Item label=" " colon={false}>
							<Space>
								<Button onClick={hide}>Скасувати</Button>
								<Button htmlType="submit" type="primary">
									{isEdit ? "Зберегти" : "Додати"}
								</Button>
							</Space>
						</Form.Item>
					</Form>
				)}
		</Drawer>
	);
});

