import { message } from 'antd';

import { Api } from '~/api';
import { UpdateValue } from '~/types';
import { IRequestModel, RequestModel } from '~/utils/models';

import { ITransportValue, updateTransportDTO, createTransport, TransportValue } from './transport.schema';

export interface ITransport extends ITransportValue {
    updateFields(data: Partial<ITransportValue>): void;
    update: IRequestModel<[UpdateValue<ITransportValue>]>;
    fullName: string;
}

export class Transport extends TransportValue implements ITransport {
    updateFields(data: Partial<ITransportValue>) {
        Object.assign(this, data);
    }
    get fullName() {
        return `${this.name} н/з ${this.number}`;
    }

    update = new RequestModel({
        run: async (data: UpdateValue<ITransportValue>) => {
            const res = await Api.transport.update(this.id, updateTransportDTO(data));

            this.updateFields(createTransport(res));
        },
        onSuccuss: () => message.success('Збережено успішно'),
        onError: () => message.error('Не вдалось додати'),
    });
}
