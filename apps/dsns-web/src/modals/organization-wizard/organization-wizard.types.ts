import { type IUser } from '@/shared-client/stores';

export interface IOrganizationForm {
    name: string;
}

export interface UserProps {
    item: IUser;
    onRemove: (id: string) => void;
}
