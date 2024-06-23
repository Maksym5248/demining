import {
    type EXPLOSIVE_OBJECT_CATEGORY,
    type IEmployeeDB,
    type IEmployeeActionDB,
    type IOrderDB,
    type IMissionRequestDB,
    type IExplosiveObjectDB,
    type IExplosiveObjectActionDB,
    type ITransportDB,
    type ITransportActionDB,
    type IEquipmentDB,
    type IEquipmentActionDB,
    type IMissionReportDB,
    type IMapViewActionDB,
    type IUserDB,
    type IOrganizationDB,
    type IDocumentDB,
    type IExplosiveActionDB,
    type IExplosiveDB,
    type IPointDB,
    type IAddressDB,
    type Timestamp,
} from 'shared-my/db';

export type IAddressDTO = IAddressDB;

export type IEmployeeDTO = IEmployeeDB;
export type IEmployeeActionDTO = IEmployeeActionDB;

export type IOrderPreviewDTO = IOrderDB;

export interface IOrderDTO extends IOrderPreviewDTO {
    signedByAction: IEmployeeActionDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | 'id' | 'signedByActionId' | 'authorId'> & {
    signedById: string;
};

export type IMissionRequestDTO = IMissionRequestDB;
export interface IMissionRequestSumDTO {
    total: number;
}
export type IExplosiveObjectDTO = IExplosiveObjectDB;

export type IExplosiveObjectActionDTO = IExplosiveObjectActionDB;

export interface IExplosiveObjectActionSumDTO {
    total: number;
    discovered: number;
    transported: number;
    destroyed: number;
}

export type IExplosiveDTO = IExplosiveDB;

export type IExplosiveActionDTO = IExplosiveActionDB;

export interface IExplosiveActionSumDTO {
    explosive: number;
    detonator: number;
}

export type IExplosiveObjectDTOParams = IExplosiveObjectDB;
export interface IExplosiveObjectActionDTOParams {
    id?: string;
    explosiveObjectId: string;
    quantity: number;
    category: EXPLOSIVE_OBJECT_CATEGORY;
    isDiscovered: boolean;
    isTransported: boolean;
    isDestroyed: boolean;
}

export type ITransportDTO = ITransportDB;
export type ITransportActionDTO = ITransportActionDB;
export type IEquipmentDTO = IEquipmentDB;
export type IEquipmentActionDTO = IEquipmentActionDB;
export type IMapViewActionDTO = Omit<IMapViewActionDB, 'geo'>;
export type IDocumentDTO = IDocumentDB;

export type IMissionReportPreviewDTO = IMissionReportDB;
export interface IMissionReportDTO extends IMissionReportPreviewDTO {
    order: IOrderDTO;
    missionRequest: IMissionRequestDTO;
    approvedByAction: IEmployeeActionDTO;
    mapView: IMapViewActionDTO;
    transportActions: ITransportActionDTO[];
    equipmentActions: IEquipmentActionDTO[];
    explosiveObjectActions: IExplosiveObjectActionDTO[];
    squadLeaderAction: IEmployeeActionDTO;
    squadActions: IEmployeeActionDTO[];
    explosiveActions: IExplosiveActionDTO[];
}

export interface IMissionReportSumDTO {
    total: number;
}

export type IMapViewActionDTOParams = Omit<
    IMapViewActionDTO,
    'id' | 'documentId' | 'documentType' | 'updatedAt' | 'createdAt' | 'executedAt' | 'authorId' | 'geo'
>;
export interface IExplosiveActionDTOParams {
    id?: string;
    explosiveId: string;
    weight: number | null /* in kilograms */;
    quantity: number | null;
}

export interface IMissionReportDTOParams {
    approvedAt: Timestamp;
    approvedById: string;
    number: number;
    subNumber: number | null;
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number | null;
    uncheckedTerritory: number | null;
    uncheckedReason: string | null;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    transportExplosiveObjectId?: string;
    transportHumansId?: string;
    mineDetectorId?: string;
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    explosiveActions?: IExplosiveActionDTOParams[];
    address: string;
    addressDetails: IAddressDTO;
}

export interface IMissionReportDTOParamsUpdate {
    id: string;
    approvedAt: Timestamp;
    approvedById: string;
    number: number;
    subNumber: number | null;
    executedAt: Timestamp;
    orderId: string;
    missionRequestId: string;
    checkedTerritory: number | null;
    depthExamination: number | null;
    uncheckedTerritory: number | null;
    uncheckedReason: string | null;
    mapView: IMapViewActionDTOParams;
    workStart: Timestamp;
    exclusionStart: Timestamp | null;
    transportingStart: Timestamp | null;
    destroyedStart: Timestamp | null;
    workEnd: Timestamp;
    transportExplosiveObjectId: string;
    transportHumansId: string;
    mineDetectorId: string;
    explosiveObjectActions: IExplosiveObjectActionDTOParams[];
    squadLeaderId: string;
    squadIds: string[];
    address: string;
}

export interface ICurrentUserDTO extends Omit<IUserDB, 'organizationId'> {
    organization: IUserOrganizationDTO | null;
}

export type IUserDTO = IUserDB;

export type IOrganizationDTO = Omit<IOrganizationDB, 'membersIds'>;

export type IUserOrganizationDTO = Omit<IOrganizationDB, 'membersIds'>;

export type ICreateOrganizationDTO = Pick<IOrganizationDB, 'name'>;
export type ICreateOrganizationMembersDTO = Pick<IOrganizationDB, 'membersIds'>;

export interface IGetAllInRectParams {
    topLeft: IPointDB;
    bottomRight: IPointDB;
}
