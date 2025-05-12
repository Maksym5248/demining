import { DOCUMENT_TYPE, EMPLOYEE_TYPE } from 'shared-my';
import { type IEmployeeActionDB, type IOrderDB, type IEmployeeDB } from 'shared-my';

import { type IUpdateValue, type IDBRemote, type IQuery } from '~/common';

import { type IOrderFullDTO, type IOrderDTOParams, type IOrderDTO } from '../dto';

export interface IOrderAPI {
    create: (value: IOrderDTOParams) => Promise<IOrderFullDTO>;
    update: (id: string, value: IUpdateValue<IOrderDTOParams>) => Promise<IOrderFullDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<IOrderDTO[]>;
    get: (id: string) => Promise<IOrderFullDTO>;
}

export class OrderAPI implements IOrderAPI {
    constructor(
        private db: {
            employee: IDBRemote<IEmployeeDB>;
            employeeAction: IDBRemote<IEmployeeActionDB>;
            order: IDBRemote<IOrderDB>;
        },
    ) {}

    create = async (value: IOrderDTOParams): Promise<IOrderFullDTO> => {
        const employee = await this.db.employee.get(value.signedById);

        if (!employee) {
            throw new Error('there is no employee with selected id');
        }

        const { id, ...employeeData } = employee;
        const orderId = this.db.order.uuid();

        const [order, employeeAction] = await Promise.all([
            this.db.order.create({
                id: orderId,
                ...value,
            }),
            this.db.employeeAction.create({
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

    update = async (id: string, { signedById, ...value }: IUpdateValue<IOrderDTOParams>): Promise<IOrderFullDTO> => {
        const [order, signedByArr] = await Promise.all([
            this.db.order.update(id, value),
            this.db.employeeAction.select({
                where: {
                    documentId: id,
                    documentType: DOCUMENT_TYPE.ORDER,
                },
                limit: 1,
            }),
        ]);

        let [signedBy] = signedByArr;

        if (signedById && signedById !== signedBy.employeeId) {
            const newEmployee = await this.db.employee.get(signedById);
            if (!newEmployee) throw new Error('there is no employee');

            signedBy = await this.db.employeeAction.update(signedBy.id, {
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

    remove = async (id: string) => {
        await Promise.all([
            this.db.employeeAction.removeBy({
                documentId: id,
                documentType: DOCUMENT_TYPE.ORDER,
            }),
            this.db.order.remove(id),
        ]);

        return id;
    };

    getList = async (query?: IQuery): Promise<IOrderDTO[]> =>
        this.db.order.select({
            order: {
                by: 'createdAt',
                type: 'desc',
            },
            ...(query ?? {}),
        });

    get = async (id: string): Promise<IOrderFullDTO> => {
        const [order, employeeActionArr] = await Promise.all([
            this.db.order.get(id),
            this.db.employeeAction.select({
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
}
