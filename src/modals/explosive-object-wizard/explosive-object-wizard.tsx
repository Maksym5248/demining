import { useEffect } from 'react';

import { Form, Input, Drawer, InputNumber, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { WizardButtons, Select, WizardFooter } from '~/components'
import { useStore, useWizard } from '~/hooks'
import { WIZARD_MODE } from '~/constants';
import { select } from '~/utils';

import { s } from './explosive-object-wizard.style'
import { IExplosiveObjectForm } from './explosive-object-wizard.types';

interface Props {
  id?: string;
  isVisible: boolean;
  mode: WIZARD_MODE;
  hide: () => void
}

export const ExplosiveObjectWizardModal  = observer(({ id, isVisible, hide, mode }: Props) => {
	const { explosiveObject } = useStore();
	const wizard = useWizard({id, mode});

	const currentExplosiveObject = explosiveObject.collection.get(id as string);

	useEffect(() => {
		explosiveObject.fetchListTypes.run();
	}, []);

	const isEdit = !!id;
	const isLoading = explosiveObject.fetchListTypes.inProgress;
	const firstType = explosiveObject.listTypes.first;

	const onFinishCreate = async (values: IExplosiveObjectForm) => {
		await explosiveObject.create.run(values);
		hide();
	};

	const onFinishUpdate = async (values: IExplosiveObjectForm) => {
		await currentExplosiveObject.update.run(values);
		hide();
	};

	const onRemove = () => {
		explosiveObject.remove.run(id);
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} ВНП`}
			placement="right"
			width={500}
			onClose={hide}
			extra={
				<WizardButtons
					onRemove={onRemove}
					{...wizard}
				/>
			}
		>
			{ isLoading
				? (<Spin css={s.spin} />)
				: (
					<Form
						name="explosive-object-form"
						onFinish={isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						disabled={wizard.isView}
						initialValues={currentExplosiveObject
							? ({typeId: currentExplosiveObject?.type?.id, ...currentExplosiveObject})
							: {
								typeId: firstType?.id
							}
						}
					>
						<Form.Item
							label="Тип"
							name="typeId"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select
								options={select.append(
									explosiveObject.sortedListTypes.map((el) => ({ label: el.fullName, value: el.id })),
									{ label: currentExplosiveObject?.type.fullName, value: currentExplosiveObject?.type?.id }
								)}
							/>
						</Form.Item>
						<Form.Item
							label="Калібр"
							name="caliber"
						>
							<InputNumber size="middle" min={1} max={100000} />
						</Form.Item>
						<Form.Item
							label="Назва"
							name="name"
							rules={[{ message: 'Прізвище є обов\'язковим полем' }]}
						>
							<Input placeholder="Введіть дані" />
						</Form.Item>
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});

