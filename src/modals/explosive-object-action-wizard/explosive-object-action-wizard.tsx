import { useEffect } from 'react';

import { Button, Form, Space, InputNumber, Drawer, Spin, Switch} from 'antd';
import { observer } from 'mobx-react-lite'

import { useStore } from '~/hooks'
import { IExplosiveObjectTypeValue } from '~/stores'
import { EXPLOSIVE_OBJECT_CATEGORY, MODALS, WIZARD_MODE } from '~/constants'
import { Modal } from '~/services'
import { Select } from '~/components'

import { IExplosiveObjectActionForm } from './explosive-object-action-wizard.types';
import { s } from './explosive-object-action-wizard.styles';

const optionsExplosiveObjectCategory = [{
	value: EXPLOSIVE_OBJECT_CATEGORY.I,
	label: `${EXPLOSIVE_OBJECT_CATEGORY.I} дозволено транспортувати`
}, {
	value: EXPLOSIVE_OBJECT_CATEGORY.II,
	label: `${EXPLOSIVE_OBJECT_CATEGORY.II} не дозволено транспортувати`
}]

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void;
  initialValue: IExplosiveObjectTypeValue;
  onSubmit: (value: IExplosiveObjectActionForm) => void;
}

export const ExplosiveObjectActionWizardModal  = observer(({ isVisible, hide, onSubmit, initialValue }: Props) => {
	const { explosiveObject } = useStore();

	const onFinish = async (values: IExplosiveObjectActionForm) => {
		onSubmit?.(values);
		hide();
	};

	const onAddExplosiveObject = () => {
		Modal.show(MODALS.EXPLOSIVE_OBJECT_WIZARD,  { mode: WIZARD_MODE.CREATE})
	};

	useEffect(() => {
		explosiveObject.fetchList.run();
	}, []);

	const isLoading = explosiveObject.fetchList.inProgress;

	return (
		<Drawer
			open={isVisible}
			destroyOnClose
			title="Створити виявлений ВНП"
			placement="right"
			width={500}
			onClose={hide}
		>
			{ isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="explosive-object-actions--form"
						onFinish={onFinish}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						initialValues={initialValue ?? {
							explosiveObjectId: explosiveObject.list?.first.id,
							quantity: 1,
							category: EXPLOSIVE_OBJECT_CATEGORY.I, 
							isDiscovered: true,
							isTransported: true,
							isDestroyed: true,
						}
						}
					>
						<Form.Item
							label="ВНП"
							name="explosiveObjectId"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select
								onAdd={onAddExplosiveObject}                  
								options={explosiveObject.list?.asArray.map((el) => ({ label: el.fullDisplayName, value: el.id }))}
							/>
						</Form.Item>
						<Form.Item
							label="Категорія"
							name="category"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select options={optionsExplosiveObjectCategory} placeholder="Вибрати" />
						</Form.Item>
						<Form.Item
							label="Кількість"
							name="quantity"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<InputNumber size="middle" min={1} max={100000}/>
						</Form.Item>
						<Form.Item
							label="Виявлено: "
							name="isDiscovered"
							valuePropName="checked"
						>
							<Switch />
						</Form.Item>
						<Form.Item
							label="Транспортовано: "
							name="isTransported"
							valuePropName="checked"
						>
							<Switch />
						</Form.Item>
						<Form.Item
							label="Знищено: "
							name="isDestroyed"
							valuePropName="checked"
						>
							<Switch />
						</Form.Item>
						<Form.Item label=" " colon={false}>
							<Space>
								<Button onClick={hide}>Скасувати</Button>
								<Button htmlType="submit" type="primary">Додати</Button>
							</Space>
						</Form.Item>
					</Form>
				)}
		</Drawer>
	);
});