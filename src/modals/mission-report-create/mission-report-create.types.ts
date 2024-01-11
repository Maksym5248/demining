import { IExplosiveObjectActionListItem } from "./components";

export interface IMissionReportForm {
    firstName: string;
    lastName: string;
    position: string;
    rank: string;
    surname: string;
    explosiveObjectActions: IExplosiveObjectActionListItem[];
}