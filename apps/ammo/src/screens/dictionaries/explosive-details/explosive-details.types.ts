export interface IExplosiveDetailsScreenProps {
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
