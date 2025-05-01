export interface IExplosiveObjectDetailsScreenProps {
    route?: {
        params?: {
            id: string;
        };
    };
}

export interface IListItem {
    id: string;
    render: () => JSX.Element;
}
