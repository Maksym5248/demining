import { message as antd } from 'antd';
import { type IMessage } from 'shared-my-client/services';

export class MessageService implements IMessage {
    error = (text: string) => antd.error(text);
    success = (text: string) => antd.success(text);
    info = (text: string) => antd.info(text);
}
