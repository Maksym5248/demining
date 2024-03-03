import { DB } from '~/db';
import { DB_FIELD, DOCUMENT_TYPE } from "~/constants";
import { UpdateValue } from '~/types';

import { IOrderDTO, IOrderDTOParams } from '../types';

const create = async (value: IOrderDTOParams):Promise<IOrderDTO> => {
	const order = await DB.order.create({
		...value,
		signedByActionId: DB_FIELD.NONE
	});

	const employee = await DB.employee.get(value.signedById);

	if(!employee){
		throw new Error("there is no employee")
	}

	const { id, ...employeeData} = employee;

	const employeeAction = await DB.employeeAction.create({
		...employeeData,
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

	if(!order){
		throw new Error("there is no order")
	}
	const signedBy = await DB.employeeAction.get(order.signedByActionId);

	if(!signedBy){
		throw new Error("there is no signedBy")
	}

	if(signedById && signedById !== signedBy.employeeId){
		const employee = await DB.employee.get(signedById);

		if(!employee){
			throw new Error("there is no employee")
		}

		await DB.employeeAction.update(order.signedByActionId, {
			...employee,
			employeeId: employee.id,
		});
	}

	await DB.order.update(id, value);

	const resOrder = await DB.order.get(id);

	if(!resOrder){
		throw new Error("there is no order")
	}

	const resSignedBy = await DB.employeeAction.get(resOrder?.signedByActionId)

	if(!resSignedBy){
		throw new Error("there is no employee")
	}

	const { signedByActionId: signedByIdRes, ...res} = resOrder;

	return {
		...res,
		signedByAction: resSignedBy
	}
};

const remove = async (id:string) => Promise.all([
	DB.employeeAction.removeBy({
		documentId: id
	}),
	DB.order.remove(id)
])

const getList = async ():Promise<IOrderDTO[]> => {
	const list = await DB.order.select({
		order: {
			by: "number",
			type: "desc",
		},
	});

	const newList = await Promise.all(list.map(async ({ signedByActionId, ...order }) => {
		const employeeAction = await DB.employeeAction.get(signedByActionId)

		if(!employeeAction){
			throw new Error("there is no employeeAction")
		}

		return {
			...order,
			signedByAction: employeeAction
		}
	}));

	return newList
};

export const order = {
	create,
	update,
	remove,
	getList
}