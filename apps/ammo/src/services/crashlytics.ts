import { type ICrashlytics, type ILogger } from 'shared-my-client/services';

export class CrashlyticsClass implements ICrashlytics {
    constructor(private logger: ILogger) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    init() {}

    error = (message: string, e: any) => {
        this.logger.error(e?.message);
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addBreadcrumb = () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setUser = async () => {};

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setTag = async () => {};
}
