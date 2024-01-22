import { DB } from '~/db';
import { DB_FIELD, DOCUMENT_TYPE } from "~/constants";
import { UpdateValue } from '~/types';

import { IOrderDTO, IOrderDTOParams } from '../types';

const add = async (value: IOrderDTOParams):Promise<IOrderDTO> => {
	const order = await DB.order.add({
		...value,
		signedByActionId: DB_FIELD.NONE
	});

	const { id, ...employee} = await DB.employee.get(value.signedById);
	const employeeAction = await DB.employeeAction.add({
		...employee,
		documentType: DOCUMENT_TYPE.ORDER,
		documentId: order.id,
		employeeId: id,
	});

	const {signedByActionId, ...res} = await DB.order.update(order.id, { signedByActionId: employeeAction.id });

	return {
		...res,
		signedByAction: employeeAction,
	};
};

const update = async (id:string, {signedById, ...value}: UpdateValue<IOrderDTOParams>):Promise<IOrderDTO> => {
	const order = await DB.order.get(id);
	const signedBy = await DB.employeeAction.get(order?.signedByActionId);

	if(signedById && signedById !== signedBy.employeeId){
		const employee = await DB.employee.get(signedById);
		await DB.employeeAction.update(order.signedByActionId, {
			...employee,
			employeeId: employee.id,
		});
	}

	await DB.order.update(id, value);

	const resOrder = await DB.order.get(id);
	const resSignedBy = await DB.employeeAction.get(resOrder?.signedByActionId)

	const { signedByActionId: signedByIdRes, ...res} = resOrder;

	return {
		...res,
		signedByAction: resSignedBy
	}
};

const remove = async (id:string) => {
	const order = await DB.order.get(id);
	await Promise.all([
		DB.employeeAction.remove(order.signedByActionId),
		DB.order.remove(id)
	])
};

const getList = async ():Promise<IOrderDTO[]> => {
	const list = await DB.order.select({
		order: {
			by: "number",
			type: "desc",
		},
	});

	const newList = await Promise.all(list.map(async ({ signedByActionId, ...order }) => {
		const employeeAction = await DB.employeeAction.get(signedByActionId)

		return {
			...order,
			signedByAction: employeeAction
		}
	}));

	return newList
};

export const order = {
	add,
	update,
	remove,
	getList
}