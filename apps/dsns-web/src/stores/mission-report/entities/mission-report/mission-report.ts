import { type Dayjs } from 'dayjs';
import { toLower } from 'lodash';

import { EQUIPMENT_TYPE, EXPLOSIVE_TYPE, TRANSPORT_TYPE } from '~/constants';
import { type IPoint } from '~/types';
import { dates, str } from '~/utils';

import { type IMissionReportValue, MissionReportValue } from './mission-report.schema';
import { type IEmployeeAction, type IEmployeeStore } from '../../../employee';
import { type IEquipmentAction, type IEquipmentStore } from '../../../equipment';
import { type IExplosiveAction, type IExplosiveStore } from '../../../explosive';
import { type IExplosiveObjectAction, type IExplosiveObjectStore } from '../../../explosive-object';
import { type IMapViewAction, type IMapStore, type IMapViewActionValue } from '../../../map';
import { type IMissionRequest, type IMissionRequestStore } from '../../../mission-request';
import { type IOrder, type IOrderStore } from '../../../order';
import { type ITransportAction, type ITransportStore } from '../../../transport';

const getLastSign = (arr: any[], i: number) => (arr.length - 1 === i ? '.' : ', ');

export interface IMissionReport extends IMissionReportValue {
    equipmentActions: IEquipmentAction[];
    order: IOrder;
    missionRequest: IMissionRequest;
    mapView: IMapViewAction;
    approvedByAction: IEmployeeAction;
    transportActions: ITransportAction[];
    squadLeaderAction: IEmployeeAction;
    squadActions: IEmployeeAction[];
    explosiveObjectActions: IExplosiveObjectAction[];
    explosiveActions: IExplosiveAction[];
    docName: string;
    transportExplosiveObject?: ITransportAction;
    transportHumans?: ITransportAction;
    mineDetector?: IEquipmentAction;
    data: {
        approvedAt: string;
        approvedByName: string;
        approvedByRank: string;
        approvedByPosition: string;
        actNumber: string;
        executedAt: string;
        orderSignedAt: string;
        orderNumber: string;
        missionRequestAt: string;
        missionNumber: string;
        address: string;
        lat: string;
        lng: string;
        checkedM2: string;
        checkedGA: string;
        uncheckedM2: string;
        uncheckedGA: string;
        depthM: string;
        uncheckedReason: string;
        explosiveObjectsTotal: number;
        explosiveObjects: string;
        explosive: string;
        detonator: string;
        exclusionTime: string;
        exclusionDate: string;
        transportingTime: string;
        transportingDate: string;
        explosiveObjectsTotalTransport: number;
        squadTotal: number;
        humanHours: number;
        transportHuman: string;
        transportExplosiveObjects?: string;
        squadLead: string;
        squadPosition: string;
        squadName: string;
        polygon: { lat: string; lng: string; name: string }[];
    };
}
interface Stores {
    equipment: IEquipmentStore;
    explosive: IExplosiveStore;
    explosiveObject: IExplosiveObjectStore;
    employee: IEmployeeStore;
    map: IMapStore;
    missionRequest: IMissionRequestStore;
    order: IOrderStore;
    transport: ITransportStore;
}

interface MissionReportParams {
    stores: Stores;
}

export class MissionReport extends MissionReportValue implements IMissionReport {
    stores: Stores;

    constructor(value: IMissionReportValue, { stores }: MissionReportParams) {
        super(value);
        this.stores = stores;
    }

    updateFields(data: Partial<IMissionReportValue>) {
        Object.assign(self, data);
    }

    get equipmentActions() {
        return this.equipmentActionsIds?.map((id) => this.stores.equipment.collectionActions.get(id) as IEquipmentAction) ?? [];
    }

    get order() {
        return this.stores.order.collection.get(this.orderId) as IOrder;
    }

    get missionRequest() {
        return this.stores.missionRequest.collection.get(this.missionRequestId) as IMissionRequest;
    }

    get mapView() {
        return this.stores.map.collection.get(this.mapViewId) as IMapViewActionValue;
    }

    get approvedByAction() {
        return this.stores.employee.collectionActions.get(this.approvedByActionId) as IEmployeeAction;
    }

    get transportActions() {
        return this.transportActionsIds?.map((id) => this.stores.transport.collectionActions.get(id) as ITransportAction) ?? [];
    }

    get squadLeaderAction() {
        return this.stores.employee.collectionActions.get(this.squadLeaderActionId) as IEmployeeAction;
    }

    get squadActions() {
        return this.squadActionsIds?.map((id) => this.stores.employee.collectionActions.get(id) as IEmployeeAction) ?? [];
    }

    get explosiveObjectActions() {
        return (
            this.explosiveObjectActionsIds?.map((id) => this.stores.explosiveObject.collectionActions.get(id) as IExplosiveObjectAction) ??
            []
        );
    }

    get explosiveActions() {
        return this.explosiveActionsIds?.map((id) => this.stores.explosive.collectionActions.get(id) as IExplosiveAction) ?? [];
    }

    get docName() {
        return `${this.executedAt.format('YYYY.MM.DD')} ${this.number}${this.subNumber ? `/${this.subNumber}` : ''}`;
    }

    get transportExplosiveObject() {
        return this.transportActions?.find((el) => el?.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
    }

    get transportHumans() {
        return this.transportActions?.find((el) => el?.type === TRANSPORT_TYPE.FOR_HUMANS);
    }

    get mineDetector() {
        return this?.equipmentActions?.find((el) => el?.type === EQUIPMENT_TYPE.MINE_DETECTOR);
    }

    get data() {
        const {
            approvedAt,
            approvedByAction,
            number,
            subNumber,
            executedAt,
            order,
            missionRequest,
            address,
            mapView,
            checkedTerritory,
            uncheckedTerritory,
            depthExamination,
            uncheckedReason,
            explosiveObjectActions,
            explosiveActions,
            workStart,
            exclusionStart,
            transportingStart,
            destroyedStart,
            workEnd,
            squadActions,
            squadLeaderAction,
            transportActions,
            equipmentActions,
        } = this;

        const getDate = (date?: Dayjs, empty?: string) =>
            date
                ? `«${date.format('DD')}» ${toLower(dates.formatGenitiveMonth(date))} ${date.format('YYYY')} року`
                : empty ?? '`«--» ------ року`';

        const getTime = (start?: Dayjs, end?: Dayjs) =>
            start && end
                ? `з ${start?.format('HH')} год. ${start?.format('mm')} хв. по ${end?.format('HH')} год. ${end?.format('mm')} хв.`
                : 'з ---- по ----';

        const actNumber = `${number}${subNumber ? `/${subNumber}` : ''}`;
        const explosive = explosiveActions.filter((el) => el?.type === EXPLOSIVE_TYPE.EXPLOSIVE);
        const detonator = explosiveActions.filter((el) => el?.type === EXPLOSIVE_TYPE.DETONATOR);

        return {
            approvedAt: getDate(approvedAt),
            approvedByName: `${str.toUpperFirst(approvedByAction?.firstName ?? '')} ${str.toUpper(approvedByAction?.lastName ?? '')}`,
            approvedByRank: this.approvedByAction?.employee?.rank?.fullName ?? '',
            approvedByPosition: approvedByAction?.position ?? '',
            actNumber,
            executedAt: getDate(executedAt),
            orderSignedAt: getDate(order?.signedAt),
            orderNumber: String(order?.number) ?? '',
            missionRequestAt: getDate(missionRequest?.signedAt),
            missionNumber: missionRequest?.number ?? '',
            address,
            lat: mapView?.marker?.lat ? `${mapView?.marker?.lat}°` : '',
            lng: mapView?.marker?.lng ? `${mapView?.marker?.lng}°` : '',
            checkedM2: `${checkedTerritory ?? '---'} м2`,
            checkedGA: `${checkedTerritory ? checkedTerritory / 10000 : '---'} га`,
            uncheckedM2: `${uncheckedTerritory ?? '---'} м2`,
            uncheckedGA: `${uncheckedTerritory ? uncheckedTerritory / 10000 : '---'} га`,
            depthM: String(depthExamination) ?? '---',
            uncheckedReason: uncheckedReason ?? '---',
            explosiveObjectsTotal: explosiveObjectActions.reduce((acc, el) => (el?.quantity ?? 0) + acc, 0),
            explosiveObjects: explosiveObjectActions.reduce(
                (acc, el, i) =>
                    `${acc}${el?.explosiveObject.fullDisplayName} - ${el?.quantity} од., ${el?.category} категорії${getLastSign(explosiveObjectActions, i)}`,
                '',
            ),
            explosive: explosive.reduce((acc, el, i) => `${acc}${el?.name} - ${el?.weight} кг.${getLastSign(explosive, i)}`, ''),
            detonator: detonator.reduce((acc, el, i) => `${acc}${el?.name} - ${el?.quantity} од.${getLastSign(detonator, i)}`, ''),
            exclusionTime: getTime(exclusionStart, transportingStart ?? destroyedStart ?? workEnd),
            exclusionDate: getDate(exclusionStart, ''),
            transportingTime: getTime(transportingStart, destroyedStart ?? workEnd),
            transportingDate: getDate(transportingStart, ''),
            explosiveObjectsTotalTransport: explosiveObjectActions.reduce((acc, el) => (el?.isTransported ? el.quantity : 0) + acc, 0),
            squadTotal: squadActions.length + 1,
            humanHours: (squadActions.length + 1) * (workEnd.hour() - workStart.hour()),
            transportHuman: transportActions.find((el) => el?.transport.type === TRANSPORT_TYPE.FOR_HUMANS)?.transport?.fullName ?? '--',
            transportExplosiveObjects:
                transportActions.find((el) => el?.transport.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)?.transport?.fullName ?? '--',
            mineDetector: equipmentActions.find((el) => el?.equipment.type === EQUIPMENT_TYPE.MINE_DETECTOR)?.name ?? '--',
            squadLead: squadLeaderAction?.employee.signName ?? '',
            squadPosition: squadActions.reduce(
                (prev, el, i) => `${prev}${el?.employee.position}${squadActions.length - 1 !== i ? `\n` : ''}`,
                '',
            ),
            squadName: squadActions.reduce(
                (prev, el, i) => `${prev}${el?.employee?.signName}${squadActions.length - 1 !== i ? `\n` : ''}`,
                '',
            ),
            polygon:
                (mapView?.polygon || mapView?.line)?.points.map((el: IPoint, i: number) => ({
                    lat: `${el.lat}°`,
                    lng: `${el.lng}°`,
                    name: i === 0 ? 'СТ' : `ПТ${i}`,
                })) ?? [],
        };
    }
}