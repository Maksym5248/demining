import { type Dayjs } from 'dayjs';
import { COMMENT_TYPE } from 'shared-my';

import { type ICommentUpdateParamsDTO, type ICommentDTO, type ICommentCreateParamsDTO } from '~/api';
import { dates, data, type ICreateValue } from '~/common';

export interface ICommentData {
    id: string;
    text: string;
    type: COMMENT_TYPE;
    authorId: string;
    entityId: string;
    parentId: string | null;
    imageUris: string[];
    likes: string[];
    dislikes: string[];
    replyCount: number;
    createdAt: Dayjs;
    updatedAt: Dayjs;
}

export type ICreateCommentData = Pick<ICommentData, 'text' | 'imageUris' | 'parentId'>;

export const createCommentDTO = (value: ICreateValue<ICommentCreateParamsDTO>): ICreateValue<ICommentCreateParamsDTO> => ({
    text: value.text,
    type: value.type,
    entityId: value.entityId,
    parentId: value.parentId,
    imageUris: value.imageUris,
    originalLang: value.originalLang,
});

export const updateCommentDTO = data.createUpdateDTO<ICommentData, ICommentUpdateParamsDTO>(value => ({
    text: value.text ?? '',
    type: value.type ?? COMMENT_TYPE.DEFAULT,
    entityId: value.entityId ?? '',
    parentId: value.parentId ?? null,
    imageUris: value.imageUris?.length ? value.imageUris : null,
    likes: value.likes?.length ? value.likes : null,
    dislikes: value.dislikes?.length ? value.dislikes : null,
}));

export const createComment = (value: ICommentDTO): ICommentData => ({
    id: value.id,
    text: value.text,
    type: value.type,
    authorId: value.authorId ?? '',
    entityId: value.entityId,
    parentId: value.parentId,
    imageUris: value.imageUris ?? [],
    likes: value.likes ?? [],
    dislikes: value.dislikes ?? [],
    replyCount: value.replyCount ?? 0,
    createdAt: dates.fromServerDate(value.createdAt),
    updatedAt: dates.fromServerDate(value.updatedAt),
});
