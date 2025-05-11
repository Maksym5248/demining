import { uniq } from 'lodash';
import { type ICommentDB, type IUserInfoDB } from 'shared-my';

import { type ICreateValue, type IUpdateValue, type IDBRemote, type IQuery, type ISubscriptionDocument } from '~/common';

import { type IUserDTO, type ICommentDTO, type ICommentFullDTO, type ICommentCreateParamsDTO, type ICommentUpdateParamsDTO } from '../dto';

export interface ICommentAPI {
    create: (value: ICreateValue<ICommentCreateParamsDTO>) => Promise<ICommentDTO>;
    update: (id: string, value: IUpdateValue<ICommentUpdateParamsDTO>) => Promise<ICommentDTO>;
    remove: (id: string) => Promise<string>;
    getList: (query?: IQuery) => Promise<ICommentFullDTO[]>;
    subscribe: (args: Partial<IQuery> | null, callback: (data: ISubscriptionDocument<ICommentDTO>[]) => void) => Promise<void>;
}

export class CommentAPI implements ICommentAPI {
    constructor(
        private db: {
            comment: IDBRemote<ICommentDB>;
            userInfo: IDBRemote<IUserInfoDB>;
        },
    ) {}

    create = async (value: ICreateValue<ICommentCreateParamsDTO>): Promise<ICommentDTO> => {
        const res = await this.db.comment.create({
            ...value,
            likes: [],
            dislikes: [],
            replyCount: 0,
        });
        return res;
    };

    update = async (id: string, value: IUpdateValue<ICommentUpdateParamsDTO>): Promise<ICommentDTO> => {
        const data = await this.db.comment.update(id, value);
        if (!data) throw new Error('there is comment with id');
        return data;
    };

    remove = async (id: string) => {
        const data = await this.db.comment.update(id, { isDeleted: true });
        if (!data) throw new Error('there is comment with id');
        return id;
    };

    async getList(query?: IQuery): Promise<ICommentFullDTO[]> {
        const comments = await this.db.comment.select({
            ...(query ?? {}),
            order: {
                by: 'createdAt',
                type: 'desc',
                ...(query?.order ?? {}),
            },
            where: {
                isDeleted: false,
                ...(query?.where ?? {}),
            },
        });

        if (!comments || !comments.length) return [];

        const authors = await this.db.userInfo.getByIds(uniq(comments.map(el => el.authorId)).filter(Boolean));
        const map = new Map<string, IUserInfoDB>(authors.map(el => [el.id, el]));

        const res = comments.map(comment => {
            const info = map.get(comment.authorId) as IUserInfoDB;

            if (!info) {
                throw new Error('authorId is undefined');
            }

            return {
                ...comment,
                author: { info, id: info.id } as IUserDTO,
            } as ICommentFullDTO;
        });

        return res;
    }

    subscribe = (args: IQuery | null, callback: (data: ISubscriptionDocument<ICommentDTO>[]) => void) => {
        return this.db.comment.subscribe(args, callback);
    };
}
