import { type ICommentDB } from 'shared-my';

import { type IUserDTO } from './dto';

export interface ICommentDTO extends Omit<ICommentDB, 'author'> {}
export interface ICommentParamsDTO extends Omit<ICommentDB, 'author' | 'replyCount'> {}
export interface ICommentFullDTO extends ICommentDB {
    author: IUserDTO;
}
