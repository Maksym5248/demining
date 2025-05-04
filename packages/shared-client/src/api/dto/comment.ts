import { type ICommentDB } from 'shared-my';

import { type IUserDTO } from './dto';

export interface ICommentDTO extends Omit<ICommentDB, 'author'> {}
export interface ICommentCreateParamsDTO extends Pick<ICommentDB, 'text' | 'imageUris' | 'type' | 'entityId' | 'parentId'> {}
export interface ICommentUpdateParamsDTO extends Omit<ICommentDB, 'author' | 'replyCount'> {}
export interface ICommentFullDTO extends ICommentDB {
    author: IUserDTO;
}
