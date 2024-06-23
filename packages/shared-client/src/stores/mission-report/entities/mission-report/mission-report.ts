import { type Dayjs } from 'dayjs';
import { toLower } from 'lodash';
import { makeAutoObservable } from 'mobx';
import { str } from 'shared-my/common';
import { EQUIPMENT_TYPE, EXPLOSIVE_TYPE, TRANSPORT_TYPE } from 'shared-my/db';

import { dates } from '~/common';
import { type IPoint } from '~/map';

import { type IMissionReportData } from './mission-report.schema';
import { type IEmployeeAction, type IEmployeeStore } from '../../../employee';
import { type IEquipmentAction, type IEquipmentStore } from '../../../equipment';
import { type IExplosiveAction, type IExplosiveStore } from '../../../explosive';
import { type IExplosiveObjectAction, type IExplosiveObjectStore } from '../../../explosive-object';
import { type IMapViewAction, type IMapStore } from '../../../map';
import { type IMissionRequest, type IMissionRequestStore } from '../../../mission-request';
import { type IOrder, type IOrderStore } from '../../../order';
import { type ITransportAction, type ITransportStore } from '../../../transport';

const getLastSign = (arr: any[], i: number) => (arr.length - 1 === i ? '.' : ', ');

export interface IMissionReport {
    id: string;
    data: IMissionReportData;
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
    printData: {
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

export class MissionReport implements IMissionReport {
    stores: Stores;
    data: IMissionReportData;

    constructor(data: IMissionReportData, { stores }: MissionReportParams) {
        this.data = data;

        this.stores = stores;
        makeAutoObservable(this);
    }

    get id() {
        return this.data.id;
    }

    updateFields(data: Partial<IMissionReportData>) {
        Object.assign(this.data, data);
    }

    get equipmentActions() {
        return this.data.equipmentActionsIds?.map((id) => this.stores.equipment.collectionActions.get(id) as IEquipmentAction) ?? [];
    }

    get order() {
        return this.stores.order.collection.get(this.data.orderId) as IOrder;
    }

    get missionRequest() {
        return this.stores.missionRequest.collection.get(this.data.missionRequestId) as IMissionRequest;
    }

    get mapView() {
        return this.stores.map.collection.get(this.data.mapViewId) as IMapViewAction;
    }

    get approvedByAction() {
        return this.stores.employee.collectionActions.get(this.data.approvedByActionId) as IEmployeeAction;
    }

    get transportActions() {
        return this.data.transportActionsIds?.map((id) => this.stores.transport.collectionActions.get(id) as ITransportAction) ?? [];
    }

    get squadLeaderAction() {
        return this.stores.employee.collectionActions.get(this.data.squadLeaderActionId) as IEmployeeAction;
    }

    get squadActions() {
        return this.data.squadActionsIds?.map((id) => this.stores.employee.collectionActions.get(id) as IEmployeeAction) ?? [];
    }

    get explosiveObjectActions() {
        return (
            this.data.explosiveObjectActionsIds?.map(
                (id) => this.stores.explosiveObject.collectionActions.get(id) as IExplosiveObjectAction,
            ) ?? []
        );
    }

    get explosiveActions() {
        return this.data.explosiveActionsIds?.map((id) => this.stores.explosive.collectionActions.get(id) as IExplosiveAction) ?? [];
    }

    get docName() {
        return `${this.data.executedAt.format('YYYY.MM.DD')} ${this.data.number}${this.data.subNumber ? `/${this.data.subNumber}` : ''}`;
    }

    get transportExplosiveObject() {
        return this.transportActions?.find((el) => el?.data.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS);
    }

    get transportHumans() {
        return this.transportActions?.find((el) => el?.data.type === TRANSPORT_TYPE.FOR_HUMANS);
    }

    get mineDetector() {
        return this?.equipmentActions?.find((el) => el?.data.type === EQUIPMENT_TYPE.MINE_DETECTOR);
    }

    get printData() {
        const {
            approvedByAction,
            order,
            missionRequest,
            mapView,
            explosiveObjectActions,
            explosiveActions,
            squadActions,
            squadLeaderAction,
            transportActions,
            equipmentActions,
        } = this;

        const {
            approvedAt,
            number,
            subNumber,
            executedAt,
            address,
            checkedTerritory,
            uncheckedTerritory,
            depthExamination,
            uncheckedReason,
            workStart,
            exclusionStart,
            transportingStart,
            destroyedStart,
            workEnd,
        } = this.data;

        const getDate = (date?: Dayjs, empty?: string) =>
            date
                ? `«${date.format('DD')}» ${toLower(dates.formatGenitiveMonth(date))} ${date.format('YYYY')} року`
                : empty ?? '`«--» ------ року`';

        const getTime = (start?: Dayjs, end?: Dayjs) =>
            start && end
                ? `з ${start?.format('HH')} год. ${start?.format('mm')} хв. по ${end?.format('HH')} год. ${end?.format('mm')} хв.`
                : 'з ---- по ----';

        const actNumber = `${number}${subNumber ? `/${subNumber}` : ''}`;
        const explosive = explosiveActions.filter((el) => el?.data.type === EXPLOSIVE_TYPE.EXPLOSIVE);
        const detonator = explosiveActions.filter((el) => el?.data.type === EXPLOSIVE_TYPE.DETONATOR);

        return {
            approvedAt: getDate(approvedAt),
            approvedByName: `${str.toUpperFirst(approvedByAction?.data.firstName ?? '')} ${str.toUpper(approvedByAction?.data.lastName ?? '')}`,
            approvedByRank: this.approvedByAction?.employee?.rank?.data.fullName ?? '',
            approvedByPosition: approvedByAction?.data.position ?? '',
            actNumber,
            executedAt: getDate(executedAt),
            orderSignedAt: getDate(order?.data.signedAt),
            orderNumber: String(order?.data.number) ?? '',
            missionRequestAt: getDate(missionRequest?.data.signedAt),
            missionNumber: missionRequest?.data.number ?? '',
            address,
            lat: mapView?.data.marker?.lat ? `${mapView?.data.marker?.lat}°` : '',
            lng: mapView?.data.marker?.lng ? `${mapView?.data.marker?.lng}°` : '',
            checkedM2: `${checkedTerritory ?? '---'} м2`,
            checkedGA: `${checkedTerritory ? checkedTerritory / 10000 : '---'} га`,
            uncheckedM2: `${uncheckedTerritory ?? '---'} м2`,
            uncheckedGA: `${uncheckedTerritory ? uncheckedTerritory / 10000 : '---'} га`,
            depthM: String(depthExamination) ?? '---',
            uncheckedReason: uncheckedReason ?? '---',
            explosiveObjectsTotal: explosiveObjectActions.reduce((acc, el) => (el?.data.quantity ?? 0) + acc, 0),
            explosiveObjects: explosiveObjectActions.reduce(
                (acc, el, i) =>
                    `${acc}${el?.explosiveObject.fullDisplayName} - ${el?.data.quantity} од., ${el?.data.category} категорії${getLastSign(explosiveObjectActions, i)}`,
                '',
            ),
            explosive: explosive.reduce((acc, el, i) => `${acc}${el?.data.name} - ${el?.data.weight} кг.${getLastSign(explosive, i)}`, ''),
            detonator: detonator.reduce(
                (acc, el, i) => `${acc}${el?.data.name} - ${el?.data.quantity} од.${getLastSign(detonator, i)}`,
                '',
            ),
            exclusionTime: getTime(exclusionStart, transportingStart ?? destroyedStart ?? workEnd),
            exclusionDate: getDate(exclusionStart, ''),
            transportingTime: getTime(transportingStart, destroyedStart ?? workEnd),
            transportingDate: getDate(transportingStart, ''),
            explosiveObjectsTotalTransport: explosiveObjectActions.reduce(
                (acc, el) => (el?.data.isTransported ? el.data.quantity : 0) + acc,
                0,
            ),
            squadTotal: squadActions.length + 1,
            humanHours: (squadActions.length + 1) * (workEnd.hour() - workStart.hour()),
            transportHuman:
                transportActions.find((el) => el?.transport.data.type === TRANSPORT_TYPE.FOR_HUMANS)?.transport?.fullName ?? '--',
            transportExplosiveObjects:
                transportActions.find((el) => el?.transport.data.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)?.transport?.fullName ??
                '--',
            mineDetector: equipmentActions.find((el) => el?.equipment.data.type === EQUIPMENT_TYPE.MINE_DETECTOR)?.data.name ?? '--',
            squadLead: squadLeaderAction?.employee.signName ?? '',
            squadPosition: squadActions.reduce(
                (prev, el, i) => `${prev}${el?.employee.data.position}${squadActions.length - 1 !== i ? `\n` : ''}`,
                '',
            ),
            squadName: squadActions.reduce(
                (prev, el, i) => `${prev}${el?.employee?.signName}${squadActions.length - 1 !== i ? `\n` : ''}`,
                '',
            ),
            polygon:
                (mapView?.data.polygon || mapView?.data.line)?.points.map((el: IPoint, i: number) => ({
                    lat: `${el.lat}°`,
                    lng: `${el.lng}°`,
                    name: i === 0 ? 'СТ' : `ПТ${i}`,
                })) ?? [],
        };
    }
}
