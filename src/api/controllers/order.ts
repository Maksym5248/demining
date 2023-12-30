import { DB } from '~/db';
import { DOCUMENT_TYPE } from "~/constants";
import { UpdateValue } from '~/types';

import { IOrderDTO, IOrderDTOParams } from '../types';

const add = async (value: IOrderDTOParams):Promise<IOrderDTO> => {
	const order = await DB.order.add({
		...value,
		signedById: "NONE"
	});

	const { id, ...employee} = await DB.employee.get(value.signedById);
	const employeeHistory = await DB.employeeHistory.add({
		...employee,
		documentType: DOCUMENT_TYPE.ORDER,
		documentId: order.id,
		employeeId: id,
	});

	const res = await DB.order.update(order.id, { signedById: employeeHistory.id });

	delete res.signedById

	return {
		...res,
		signedBy: employeeHistory,
	};
};

const update = async (id:string, {signedById, ...value}: UpdateValue<IOrderDTOParams>):Promise<IOrderDTO> => {
	const order = await DB.order.get(id);
	const signedBy = await DB.employeeHistory.get(order?.signedById);

	if(signedById !== signedBy.employeeId){
		const employee = await DB.employee.get(signedById);
		await DB.employeeHistory.update(order.signedById, employee);
	}

	await DB.order.update(id, value);

	const resOrder = await DB.order.get(id);
	const resSignedBy = await DB.employeeHistory.get(resOrder?.signedById)

	delete resOrder.signedById

	return {
		...resOrder,
		signedBy: resSignedBy
	}
};

const remove = async (id:string) => {
	const order = await DB.order.get(id);
	await Promise.all([
		DB.employeeHistory.remove(order.signedById),
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

	const newList = await Promise.all(list.map(async ({ signedById, ...order }) => {
		const employeeHistory = await DB.employeeHistory.get(signedById)

		return {
			...order,
			signedBy: employeeHistory
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