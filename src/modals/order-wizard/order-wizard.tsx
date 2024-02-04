import { useEffect } from 'react';

import { Form, DatePicker, Drawer, InputNumber, Spin} from 'antd';
import { observer } from 'mobx-react-lite'

import { WizardButtons, Select, WizardFooter } from '~/components'
import { useStore, useWizard } from '~/hooks'
import { dates } from '~/utils'
import { WIZARD_MODE } from '~/constants';

import { s } from './order-wizard.style'
import { IOrderForm } from './order-wizard.types';

const { Option } = Select;

interface Props {
  id?: string;
  isVisible: boolean;
  hide: () => void;
  mode: WIZARD_MODE;
}

export const OrderWizardModal  = observer(({ id, isVisible, hide, mode }: Props) => {
	const { order, employee } = useStore();
	const wizard = useWizard({id, mode});

	const currentOrder = order.collection.get(id as string);
	const {employeesListChief} = employee;
	const employeeChiefFirst = employeesListChief[0];

	useEffect(() => {
		order.fetchList.run();
		employee.fetchList.run();
	}, []);

	const isEdit = !!id;
	const isLoading = (!order.fetchList.isLoaded && order.fetchList.inProgress) || (!order.fetchList.isLoaded && order.fetchList.inProgress);

	const onFinishCreate = async (values: IOrderForm) => {
		await order.add.run(values);
		hide();
	};

	const onFinishUpdate = async (values: IOrderForm) => {
		await currentOrder.update.run(values);
		hide();
	};

	const onRemove = () => {
		order.remove.run(id);
	};

	return (   
		<Drawer
			open={isVisible}
			destroyOnClose
			title={`${isEdit ? "Редагувати": "Створити"} наказ`}
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
						initialValues={currentOrder
							? ({ ...currentOrder, signedById: currentOrder.signedByAction?.employeeId})
							: {
								number: (order.list.first?.number ?? 0) + 1,
								signedById: order.list.first?.signedByAction.employeeId || employeeChiefFirst?.id,
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
						<Form.Item
							label="Підписав"
							name="signedById"
							rules={[{ required: true, message: 'Обов\'язкове поле' }]}
						>
							<Select>
								{employeesListChief.map(el => (
									<Option value={el.id} key={el.type}>{el.fullName}</Option>
								))}
							</Select>
						</Form.Item>
						<WizardFooter {...wizard} onCancel={hide}/>
					</Form>
				)}
		</Drawer>
	);
});

