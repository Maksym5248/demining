import { Button, Form, Space, InputNumber, Drawer } from 'antd';
import { observer } from 'mobx-react-lite'

import { useSelectStore, useStore } from '~/hooks'
import { IExplosiveActionValue } from '~/stores'
import { MODALS, WIZARD_MODE } from '~/constants'
import { Modal } from '~/services'
import { SelectAsync } from '~/components'

import { IExplosiveActionForm } from './explosive-action-wizard.types';

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void;
  initialValue: IExplosiveActionValue;
  onSubmit: (value: IExplosiveActionForm) => void;
}

export const ExplosiveActionWizardModal  = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
	const { explosive } = useStore();
	const { initialItem, ...explosiveProps} = useSelectStore(explosive);

	const onFinish = async (values: IExplosiveActionForm) => {
		onSubmit?.(values);
		hide();
	};

	const onCreateExplosive = () => {
		Modal.show(MODALS.EXPLOSIVE_WIZARD,  { mode: WIZARD_MODE.CREATE })
	};

	
	return (
		<Drawer
			open={isVisible}
			destroyOnClose
			title="Використано ВР та ЗП"
			placement="right"
			width={500}
			onClose={hide}
		>
			<Form
				name="explosive-actions--form"
				onFinish={onFinish}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				initialValues={initialValue ?? {
					explosiveId: undefined,
					quantity: 0,
					weight: 0, 
				}}
			>
				<Form.Item
					label="ВНП"
					name="explosiveId"
					rules={[{ required: true, message: 'Обов\'язкове поле' }]}
				>
					<SelectAsync
						{...explosiveProps}
						onAdd={onCreateExplosive}
						options={explosiveProps.list.map((el) => ({ label: el?.name, value: el.id }))}
					/>
				</Form.Item>
				<Form.Item
					label="Кількість"
					name="quantity"
					rules={[{ required: true, message: 'Обов\'язкове поле' }]}
				>
					<InputNumber size="middle" min={1} max={100000}/>
				</Form.Item>
				<Form.Item
					label="Вага"
					name="weight"
					rules={[{ required: true, message: 'Обов\'язкове поле' }]}
				>
					<InputNumber size="middle" min={0.001} max={100000}/>
				</Form.Item>
				<Form.Item label=" " colon={false}>
					<Space>
						<Button onClick={hide}>Скасувати</Button>
						<Button htmlType="submit" type="primary">Додати</Button>
					</Space>
				</Form.Item>
			</Form>
		</Drawer>
	);
});