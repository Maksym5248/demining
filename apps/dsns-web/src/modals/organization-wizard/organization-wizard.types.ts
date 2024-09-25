import { type IUser } from 'shared-my-client';

export interface IOrganizationForm {
    name: string;
}

export interface UserProps {
    item: IUser;
    onRemove: (id: string) => void;
}
