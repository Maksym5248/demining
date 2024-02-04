import { useEffect } from 'react';

import { Form, DatePicker, Drawer, InputNumber, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore, useWizard } from '~/hooks'
import { dates } from '~/utils'
import { WizardButtons, WizardFooter } from '~/components';
import { WIZARD_MODE } from '~/constants';

import { s } from './mission-request-wizard.style'
import { IMissionRequestForm } from './mission-request-wizard.types';

interface Props {
  id?: string;
  isVisible: boolean;
  mode: WIZARD_MODE
  hide: () => void
}

export const MissionRequestWizardModal  = observer(({ id, isVisible, hide, mode }: Props) => {
	const store = useStore();
	const wizard = useWizard({id, mode});

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

	const onRemove = () => () => {
		store.missionRequest.remove.run(id);
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} заявку`}
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
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});

