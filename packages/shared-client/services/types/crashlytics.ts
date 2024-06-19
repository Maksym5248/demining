export type IPrimitive = number | string | boolean | bigint | symbol | null | undefined;
export type SeverityLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
export enum Severity {
    Fatal = 'fatal',
    Error = 'error',
    Warning = 'warning',
    Log = 'log',
    Info = 'info',
    Debug = 'debug',
}

export interface IBreadcrumb {
    type?: string;
    level?: Severity | SeverityLevel;
    event_id?: string;
    category?: string;
    message?: string;
    data?: {
        [key: string]: any;
    };
    timestamp?: number;
}

export interface ICrashlyticsUser {
    id: string;
}

export interface ICrashlytics {
    init: () => void;
    error: (message: string, e: any) => void;
    addBreadcrumb: (breadcrumb: IBreadcrumb) => void;
    setUser: (user: ICrashlyticsUser | null) => void;
    setTag: (key: string, value: IPrimitive) => void;
}
