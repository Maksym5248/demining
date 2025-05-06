export interface IAlertParams {
    title: string;
    subTitle: string;
    isVisibleLoading?: boolean;
    cancel?: {
        title?: string;
        run?: (() => void) | (() => Promise<void>);
    };
    confirm?: {
        title?: string;
        run?: (() => void) | (() => Promise<void>);
    };
}

export interface IAlert {
    show: (params: IAlertParams) => void;
    hide: () => void;
}
