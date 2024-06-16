import { type IQuery } from '@/shared';
import { type UpdateValue } from '@/shared-client';

import { DOCUMENT_TYPE, EMPLOYEE_TYPE } from '~/constants';
import { DB } from '~/db';

import { type IOrderDTO, type IOrderDTOParams, type IOrderPreviewDTO } from '../types';

const create = async (value: IOrderDTOParams): Promise<IOrderDTO> => {
    const employee = await DB.employee.get(value.signedById);

    if (!employee) {
        throw new Error('there is no employee with selected id');
    }

    const { id, ...employeeData } = employee;
    const orderId = DB.order.uuid();

    const [order, employeeAction] = await Promise.all([
        DB.order.create({
            id: orderId,
            ...value,
        }),
        DB.employeeAction.create({
            ...employeeData,
            executedAt: null,
            typeInDocument: EMPLOYEE_TYPE.CHIEF,
            documentType: DOCUMENT_TYPE.ORDER,
            documentId: orderId,
            employeeId: id,
        }),
    ]);

    return {
        ...order,
        signedByAction: employeeAction,
    };
};

const update = async (id: string, { signedById, ...value }: UpdateValue<IOrderDTOParams>): Promise<IOrderDTO> => {
    const [order, signedByArr] = await Promise.all([
        DB.order.update(id, value),
        DB.employeeAction.select({
            where: {
                documentId: id,
                documentType: DOCUMENT_TYPE.ORDER,
            },
            limit: 1,
        }),
    ]);

    let [signedBy] = signedByArr;

    if (signedById && signedById !== signedBy.employeeId) {
        const newEmployee = await DB.employee.get(signedById);
        if (!newEmployee) throw new Error('there is no employee');

        signedBy = await DB.employeeAction.update(signedBy.id, {
            ...newEmployee,
            employeeId: newEmployee.id,
        });
    }

    if (!order) throw new Error('there is no order');
    if (!signedBy) throw new Error('there is no signedBy');

    return {
        ...order,
        signedByAction: signedBy,
    };
};

const remove = async (id: string) =>
    Promise.all([
        DB.employeeAction.removeBy({
            documentId: id,
        }),
        DB.order.remove(id),
    ]);

const getList = async (query?: IQuery): Promise<IOrderPreviewDTO[]> =>
    DB.order.select({
        order: {
            by: 'createdAt',
            type: 'desc',
        },
        ...(query ?? {}),
    });

const get = async (id: string): Promise<IOrderDTO> => {
    const [order, employeeActionArr] = await Promise.all([
        DB.order.get(id),
        DB.employeeAction.select({
            where: {
                documentId: id,
                documentType: DOCUMENT_TYPE.ORDER,
            },
            limit: 1,
        }),
    ]);

    const [employeeAction] = employeeActionArr;

    if (!employeeAction) throw new Error('There is no employee action by order id');
    if (!order) throw new Error('There is no order by id');

    return {
        ...order,
        signedByAction: employeeAction,
    };
};

export const order = {
    create,
    update,
    remove,
    get,
    getList,
};
