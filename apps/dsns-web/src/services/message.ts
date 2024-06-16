import { type IMessageService } from '@/shared-client';
import { message as antd } from 'antd';

export class MessageService implements IMessageService {
    error = (text: string) => antd.error(text);
    success = (text: string) => antd.success(text);
    info = (text: string) => antd.info(text);
}
