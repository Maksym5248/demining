import { useEffect } from 'react';

import { Button, Form, DatePicker, Space, Drawer, InputNumber, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { dates } from '~/utils'

import { s } from './mission-request-create.style'
import { IMissionRequestForm } from './mission-request-create.types';

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void
}

export const MissionRequestCreateModal  = observer(({ id, isVisible, hide }: Props) => {
	const store = useStore();

	const missionRequest = store.missionRequest.collection.get(id as string);

	useEffect(() => {
		store.missionRequest.fetchList.run();
	}, []);

	const isEdit = !!id;
	const isLoading = !store.missionRequest.fetchList.isLoaded && store.missionRequest.fetchList.inProgress;

	const onFinishCreate = async (values: IMissionRequestForm) => {
		await store.missionRequest.add.run(values);
		hide();
	};

	const onFinishUpdate = async (values: IMissionRequestForm) => {
		await missionRequest.update.run(values);
		hide();
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} заявку`}
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
						initialValues={missionRequest
							? ({ ...missionRequest})
							: {
								number: (store.missionRequest.list.first?.number ?? 0) + 1,
								signedAt: dates.today(),
							}
						}
					>
						<Form.Item
							label="Номер"
							name="number"
							rules={[{ required: true }]}
						>
							<InputNumber size="middle" min={1} max={100000} />
						</Form.Item>
						<Form.Item
							label="Дата підписання"
							name="signedAt"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<DatePicker/>
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

