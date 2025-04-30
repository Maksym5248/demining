import { type IBaseDB } from './common';
import { type COMMENT_TYPE } from '../enum/entities/comment';

export interface ICommentDB extends Omit<IBaseDB, 'organizationId'> {
    text: string;
    type: COMMENT_TYPE;
    entityId: string;
    parentId: string | null;
    imageUris: string[] | null;
    likes: string[] | null;
    dislikes: string[] | null;
    replyCount: number;
    authorId: string;
}
