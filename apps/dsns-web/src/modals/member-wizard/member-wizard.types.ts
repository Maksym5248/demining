import { type IUser } from 'shared-my-client';

export interface IMemberForm {
    id: string;
    ORGANIZATION_ADMIN: boolean;
    AMMO_CONTENT_ADMIN: boolean;
    DEMINING_VIEWER: boolean;
    AMMO_AUTHOR: boolean;
}

export interface UserProps {
    item: IUser;
    onRemove: (id: string) => void;
}
