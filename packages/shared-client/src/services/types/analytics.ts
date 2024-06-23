export interface IAnalyticsEventParams {
    [key: string]: any;
}

export interface IAnalytics {
    page: (name: string, params?: IAnalyticsEventParams) => void;
    modal: (name: string, params?: IAnalyticsEventParams) => void;
    event: (name: string, params?: IAnalyticsEventParams) => void;
    setUserId: (uid: string | null) => void;
}
