export interface IExplosiveDeviceDetailsScreenProps {
    route?: {
        params?: {
            id: string;
        };
    };
}

export interface IListItem {
    id: string;
    isVisible: boolean;
    render: () => JSX.Element;
}
