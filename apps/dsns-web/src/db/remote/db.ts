import {
    type IDocumentDB,
    type IEmployeeActionDB,
    type IEmployeeDB,
    type IEquipmentActionDB,
    type IEquipmentDB,
    type IExplosiveActionDB,
    type IExplosiveDB,
    type IExplosiveObjectActionDB,
    type IExplosiveObjectDB,
    type IMapViewActionDB,
    type IMissionReportDB,
    type IMissionRequestDB,
    type IOrderDB,
    type IOrganizationDB,
    type ITransportActionDB,
    type ITransportDB,
    type IUserDB,
} from '@/shared';
import { type WriteBatch, getFirestore, writeBatch } from 'firebase/firestore';

import { TABLES, TABLES_DIR } from '~/constants';
import { explosiveObjectTypesData } from '~/data';
import { AuthService } from '~/services';
import { mapUtils } from '~/utils';

import { DBBase } from './db-base';

const getCreateData = () => ({
    authorId: AuthService.uuid() as string,
});

const getCreateDataMap = (value: Omit<IMapViewActionDB, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'>) => ({
    authorId: AuthService.uuid() as string,
    geo: mapUtils.getGeoDB(value),
});

const getSearchDataExplosiveObject = (value: Partial<IExplosiveObjectDB>) => {
    const type = explosiveObjectTypesData.find((item) => item.id === value.typeId);
    return [type?.fullName, type?.name].filter((el) => !!el) as string[];
};

const getUpdateDataMap = (value: Partial<IMapViewActionDB>) => {
    if (!value.polygon && !value.circle && !value.marker) {
        return {};
    }

    return {
        geo: mapUtils.getGeoDB(value as IMapViewActionDB),
    };
};

export class DBRemote {
    /** COMMON COLLECTIONS */
    user = new DBBase<IUserDB>(TABLES.USER, ['email']);

    organization = new DBBase<IOrganizationDB>(TABLES.ORGANIZATION, ['name'], getCreateData);

    explosiveObject = new DBBase<IExplosiveObjectDB>(
        TABLES.EXPLOSIVE_OBJECT,
        ['name', 'caliber'],
        getCreateData,
        undefined,
        getSearchDataExplosiveObject,
    );

    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, ['name'], getCreateData);

    /** ORGANIZATION SUBCOLLECTION */
    employee = new DBBase<IEmployeeDB>(TABLES.EMPLOYEE, ['firstName', 'lastName', 'surname', 'position'], getCreateData);

    employeeAction = new DBBase<IEmployeeActionDB>(TABLES.EMPLOYEE_ACTION, [], getCreateData);

    mapViewAction = new DBBase<IMapViewActionDB>(TABLES.MAP_VIEW_ACTION, [], getCreateDataMap, getUpdateDataMap);

    missionReport = new DBBase<IMissionReportDB>(TABLES.MISSION_REPORT, ['number', 'address'], getCreateData);

    missionRequest = new DBBase<IMissionRequestDB>(TABLES.MISSION_REQUEST, ['number'], getCreateData);

    order = new DBBase<IOrderDB>(TABLES.ORDER, ['number'], getCreateData);

    explosiveObjectAction = new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION, [], getCreateData);

    explosiveAction = new DBBase<IExplosiveActionDB>(TABLES.EXPLOSIVE_ACTION, [], getCreateData);

    transport = new DBBase<ITransportDB>(TABLES.TRANSPORT, ['name', 'number'], getCreateData);

    transportAction = new DBBase<ITransportActionDB>(TABLES.TRANSPORT_ACTION, [], getCreateData);

    equipment = new DBBase<IEquipmentDB>(TABLES.EQUIPMENT, ['name'], getCreateData);

    equipmentAction = new DBBase<IEquipmentActionDB>(TABLES.EQUIPMENT_ACTION, [], getCreateData);

    document = new DBBase<IDocumentDB>(TABLES.DOCUMENT, ['name'], getCreateData);

    batch: WriteBatch | null = null;

    init = () => Promise.resolve();

    dropDb = () => Promise.resolve();

    setOrganizationId(id: string) {
        const rootCollection = `${TABLES_DIR.ORGANIZATION_DATA}/${id}`;

        this.employee.setRootCollection(rootCollection);
        this.employeeAction.setRootCollection(rootCollection);
        this.mapViewAction.setRootCollection(rootCollection);
        this.missionReport.setRootCollection(rootCollection);
        this.missionRequest.setRootCollection(rootCollection);
        this.order.setRootCollection(rootCollection);
        this.explosiveObjectAction.setRootCollection(rootCollection);
        this.transport.setRootCollection(rootCollection);
        this.transportAction.setRootCollection(rootCollection);
        this.equipment.setRootCollection(rootCollection);
        this.equipmentAction.setRootCollection(rootCollection);
        this.document.setRootCollection(rootCollection);
        this.explosiveAction.setRootCollection(rootCollection);
    }

    removeOrganizationId() {
        this.employee.removeRootCollection();
        this.employeeAction.removeRootCollection();
        this.mapViewAction.removeRootCollection();
        this.missionReport.removeRootCollection();
        this.missionRequest.removeRootCollection();
        this.order.removeRootCollection();
        this.explosiveObjectAction.removeRootCollection();
        this.transport.removeRootCollection();
        this.transportAction.removeRootCollection();
        this.equipment.removeRootCollection();
        this.equipmentAction.removeRootCollection();
        this.document.removeRootCollection();
        this.explosiveAction.removeRootCollection();
    }

    private setBatch(batch: WriteBatch | null) {
        this.batch = batch;

        this.user.setBatch(batch);
        this.organization.setBatch(batch);
        this.explosiveObject.setBatch(batch);

        this.employee.setBatch(batch);
        this.employeeAction.setBatch(batch);
        this.mapViewAction.setBatch(batch);
        this.missionReport.setBatch(batch);
        this.missionRequest.setBatch(batch);
        this.order.setBatch(batch);
        this.explosiveObjectAction.setBatch(batch);
        this.transport.setBatch(batch);
        this.transportAction.setBatch(batch);
        this.equipment.setBatch(batch);
        this.equipmentAction.setBatch(batch);
        this.document.setBatch(batch);
        this.explosiveAction.setBatch(batch);
    }

    batchStart() {
        const batch = writeBatch(getFirestore());
        this.setBatch(batch);
    }

    async batchCommit() {
        await this.batch?.commit();
        this.setBatch(null);
    }
}