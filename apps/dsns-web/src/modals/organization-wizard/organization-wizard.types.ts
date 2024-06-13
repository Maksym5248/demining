import { IUser } from '~/stores';

export interface IOrganizationForm {
    name: string;
}

export interface UserProps {
    item: IUser;
    onRemove: (id: string) => void;
}
