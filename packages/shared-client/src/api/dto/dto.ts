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
    type IOrganizationDB,
    type IDocumentDB,
    type IExplosiveDeviceActionDB,
    type IExplosiveDeviceDB,
    type IPointDB,
    type IAddressDB,
    type Timestamp,
    type IRankDB,
    type IExplosiveObjectTypeDB,
    type IExplosiveDB,
    type IBookDB,
    type IRangeDB,
    type IFieldDB,
    type IUserInfoDB,
    type IUserAccessDB,
    type IMemberDB,
} from 'shared-my';

import { type IExplosiveObjectDetailsDTO } from './explosive-object';

export type IAddressDTO = IAddressDB;
export type IFieldDTO = IFieldDB;

export type IRankDTO = IRankDB;
export type IEmployeeDTO = IEmployeeDB;
export type IEmployeeActionDTO = IEmployeeActionDB;

export type IOrderDTO = IOrderDB;

export interface IOrderFullDTO extends IOrderDTO {
    signedByAction: IEmployeeActionDTO;
}

export type IOrderDTOParams = Omit<IOrderDB, 'updatedAt' | 'createdAt' | 'id' | 'signedByActionId' | 'authorId'> & {
    signedById: string;
};

export type IMissionRequestDTO = IMissionRequestDB;
export interface IMissionRequestSumDTO {
    total: number;
}

export type IExplosiveObjectActionDTO = IExplosiveObjectActionDB;

export interface IExplosiveObjectActionSumDTO {
    total: number;
    discovered: number;
    transported: number;
    destroyed: number;
}

export type IExplosiveDeviceDTO = IExplosiveDeviceDB;

export type IExplosiveActionDTO = IExplosiveDeviceActionDB;

export interface IExplosiveActionSumDTO {
    explosive: number;
    detonator: number;
}

export interface IExplosiveObjectDTOParams extends Omit<IExplosiveObjectDB, 'imageUri'> {
    image?: File;
    details: Omit<IExplosiveObjectDetailsDTO, 'id' | 'createdAt' | 'updatedAt'> | null;
}

export interface IExplosiveObjectTypeDTOParams extends Omit<IExplosiveObjectTypeDB, 'imageUri'> {
    image?: File;
}

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
export type IBookDTO = IBookDB;

export type IMissionReportDTO = IMissionReportDB;
export interface IMissionReportFullDTO extends IMissionReportDTO {
    order: IOrderFullDTO;
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

export interface ICurrentUserDTO {
    id: string;
    info: IUserInfoDB;
    access: IUserAccessDB;
    member: IMemberDB;
    organization: IUserOrganizationDTO | null;
}

export type IUserDTO = {
    id: string;
    info: IUserInfoDB;
    access: IUserAccessDB;
    member: IMemberDB;
};

export type IUpdateUserDTO = {
    info?: Omit<IUserInfoDB, 'id' | 'createdAt' | 'updatedAt'>;
    access?: Partial<Omit<IUserAccessDB, 'id' | 'createdAt' | 'updatedAt'>>;
    member?: Omit<IMemberDB, 'id' | 'createdAt' | 'updatedAt'>;
};

export type IOrganizationDTO = IOrganizationDB;

export type IUserOrganizationDTO = Omit<IOrganizationDB, 'search'>;

export type ICreateOrganizationDTO = Pick<IOrganizationDB, 'name'>;
export type ICreateOrganizationMembersDTO = IOrganizationDB;

export interface IGetAllInRectParams {
    topLeft: IPointDB;
    bottomRight: IPointDB;
}

export type IExplosiveDTO = IExplosiveDB;
export type IRangeDTO = IRangeDB;
export interface IExplosiveDTOParams extends Omit<IExplosiveDTO, 'imageUri'> {
    image?: File;
}
