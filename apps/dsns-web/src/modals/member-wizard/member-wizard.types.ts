import { type IUser } from 'shared-my-client/stores';

export interface IMemberForm {
    id: string;
    isAdmin: boolean;
}

export interface UserProps {
    item: IUser;
    onRemove: (id: string) => void;
}
