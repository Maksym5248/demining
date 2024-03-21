import { Form, Drawer, Input, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { WizardButtons, Select, WizardFooter } from '~/components'
import { WIZARD_MODE } from "~/constants"
import { useStore, useWizard , useItemStore } from '~/hooks'
import { EXPLOSIVE_TYPE } from '~/constants/db/explosive-type';

import { s } from './explosive-wizard.style'
import { IExplosiveForm } from './explosive-wizard.types';

interface Props {
  id?: string;
  isVisible: boolean;
  mode: WIZARD_MODE;
  hide: () => void;
}

const typeOptions = [{
	label: "Вибухова речовна",
	value: EXPLOSIVE_TYPE.EXPLOSIVE
}, {
	label: "Засіб підриву",
	value: EXPLOSIVE_TYPE.DETONATOR
}]

export const ExplosiveWizardModal = observer(({ id, isVisible, hide, mode }: Props) => {
	const store = useStore();
	const wizard = useWizard({id, mode});

	const { isLoading, item } = useItemStore(store.explosive, id as string);

	const isEdit = !!id;

	const onFinishCreate = async (values: IExplosiveForm) => {
		await store.explosive.create.run(values);
		hide();
	};

	const onFinishUpdate = async (values: IExplosiveForm) => {
		await item.update.run(values);
		hide();
	};

	const onRemove = async () => {
		store.explosive.remove.run(id);
		hide();
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} ВР та ЗП`}
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
						name="explosive-form"
						onFinish={isEdit ? onFinishUpdate : onFinishCreate}
						labelCol={{ span: 8 }}
						wrapperCol={{ span: 16 }}
						disabled={wizard.isView}
						initialValues={ item
							? ({ ...item})
							: {  type: EXPLOSIVE_TYPE.EXPLOSIVE }
						}
					>
						<Form.Item
							label="Тип"
							name="type"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select
								options={typeOptions}
							/>
						</Form.Item>
						<Form.Item
							label="Назва"
							name="name"
							rules={[{ required: true, message: 'Прізвище є обов\'язковим полем' }]}
						>
							<Input placeholder="Введіть дані" />
						</Form.Item>
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});

