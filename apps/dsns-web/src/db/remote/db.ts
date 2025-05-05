import { type WriteBatch, getFirestore, writeBatch } from 'firebase/firestore';
import {
    type IExplosiveObjectTypeDB,
    TABLES,
    TABLES_DIR,
    mapUtils,
    type IDocumentDB,
    type IEmployeeActionDB,
    type IEmployeeDB,
    type IEquipmentActionDB,
    type IEquipmentDB,
    type IExplosiveDeviceActionDB,
    type IExplosiveDeviceDB,
    type IExplosiveObjectActionDB,
    type IExplosiveObjectDB,
    type IMapViewActionDB,
    type IMissionReportDB,
    type IMissionRequestDB,
    type IOrderDB,
    type IOrganizationDB,
    type ITransportActionDB,
    type ITransportDB,
    type IUserInfoDB,
    type IExplosiveObjectClassDB,
    type IExplosiveObjectClassItemDB,
    type IExplosiveDB,
    type IBookDB,
    type IExplosiveObjectDetailsDB,
    type IAppConfigDB,
    type IUserAccessDB,
    type IMemberDB,
    type IBookTypeDB,
    type ICountryDB,
    type IExplosiveDeviceTypeDB,
    type IExplosiveObjectComponentDB,
    type IMaterialDB,
    type IMissionRequestTypeDB,
    type IRankDB,
    type IStatusDB,
} from 'shared-my';
import { type IDB } from 'shared-my-client';

import { Auth } from '~/services';

import { DBBase } from './db-base';

let organizationId: string | null = null;

const getCreateData = () => ({
    authorId: Auth.uuid() as string,
    organizationId,
});

const getCreateDataMap = (value: Omit<IMapViewActionDB, 'createdAt' | 'updatedAt' | 'authorId' | 'id' | 'geo'>) => ({
    authorId: Auth.uuid() as string,
    geo: mapUtils.getGeoDB(value),
    organizationId,
});

const getUpdateDataMap = (value: Partial<IMapViewActionDB>) => {
    if (!value.polygon && !value.circle && !value.marker) {
        return {};
    }

    return {
        geo: mapUtils.getGeoDB(value),
    };
};

export class DBRemote implements Omit<IDB, 'comment' | 'complain'> {
    /** COMMON COLLECTIONS */
    userInfo = new DBBase<IUserInfoDB>(TABLES.USER_INFO, ['name']);

    userAccess = new DBBase<IUserAccessDB>(TABLES.USER_ACCESS, []);

    member = new DBBase<IMemberDB>(TABLES.MEMBER, []);

    organization = new DBBase<IOrganizationDB>(TABLES.ORGANIZATION, ['name'], getCreateData);

    explosiveObjectType = new DBBase<IExplosiveObjectTypeDB>(TABLES.EXPLOSIVE_OBJECT_TYPE, ['name', 'fullName'], getCreateData, undefined);

    explosiveObjectClass = new DBBase<IExplosiveObjectClassDB>(TABLES.EXPLOSIVE_OBJECT_CLASS, ['name'], getCreateData, undefined);

    explosiveObjectClassItem = new DBBase<IExplosiveObjectClassItemDB>(
        TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM,
        ['name'],
        getCreateData,
        undefined,
    );

    explosiveObject = new DBBase<IExplosiveObjectDB>(TABLES.EXPLOSIVE_OBJECT, ['name'], getCreateData, undefined);

    explosiveObjectDetails = new DBBase<IExplosiveObjectDetailsDB>(TABLES.EXPLOSIVE_OBJECT_DETAILS, [], getCreateData, undefined);

    explosiveDevice = new DBBase<IExplosiveDeviceDB>(TABLES.EXPLOSIVE_DEVICE, ['name'], getCreateData);

    explosive = new DBBase<IExplosiveDB>(TABLES.EXPLOSIVE, ['name'], getCreateData);

    /** ORGANIZATION SUBCOLLECTION */
    employee = new DBBase<IEmployeeDB>(TABLES.EMPLOYEE, ['firstName', 'lastName', 'surname', 'position'], getCreateData);

    employeeAction = new DBBase<IEmployeeActionDB>(TABLES.EMPLOYEE_ACTION, [], getCreateData);

    mapViewAction = new DBBase<IMapViewActionDB>(TABLES.MAP_VIEW_ACTION, [], getCreateDataMap, getUpdateDataMap);

    missionReport = new DBBase<IMissionReportDB>(TABLES.MISSION_REPORT, ['number', 'address'], getCreateData);

    missionRequest = new DBBase<IMissionRequestDB>(TABLES.MISSION_REQUEST, ['number'], getCreateData);

    order = new DBBase<IOrderDB>(TABLES.ORDER, ['number'], getCreateData);

    explosiveObjectAction = new DBBase<IExplosiveObjectActionDB>(TABLES.EXPLOSIVE_OBJECT_ACTION, [], getCreateData);

    explosiveDeviceAction = new DBBase<IExplosiveDeviceActionDB>(TABLES.EXPLOSIVE_DEVICE_ACTION, [], getCreateData);

    transport = new DBBase<ITransportDB>(TABLES.TRANSPORT, ['name', 'number'], getCreateData);

    transportAction = new DBBase<ITransportActionDB>(TABLES.TRANSPORT_ACTION, [], getCreateData);

    equipment = new DBBase<IEquipmentDB>(TABLES.EQUIPMENT, ['name'], getCreateData);

    equipmentAction = new DBBase<IEquipmentActionDB>(TABLES.EQUIPMENT_ACTION, [], getCreateData);

    document = new DBBase<IDocumentDB>(TABLES.DOCUMENT, ['name'], getCreateData);

    book = new DBBase<IBookDB>(TABLES.BOOK, ['name'], getCreateData);

    app = new DBBase<IAppConfigDB>(TABLES.APP_CONFIG, [], undefined);

    bookType = new DBBase<IBookTypeDB>(TABLES.BOOK_TYPE, []);
    country = new DBBase<ICountryDB>(TABLES.COUNTRY, []);
    explosiveDeviceType = new DBBase<IExplosiveDeviceTypeDB>(TABLES.EXPLOSIVE_DEVICE_TYPE, []);
    explosiveObjectComponent = new DBBase<IExplosiveObjectComponentDB>(TABLES.EXPLOSIVE_OBJECT_COMPONENT, []);
    material = new DBBase<IMaterialDB>(TABLES.MATERIAL, []);
    missionRequestType = new DBBase<IMissionRequestTypeDB>(TABLES.MISSION_REQUEST_TYPE, []);
    rank = new DBBase<IRankDB>(TABLES.RANKS, []);
    status = new DBBase<IStatusDB>(TABLES.STATUSES, []);

    batch: WriteBatch | null = null;

    init = () => Promise.resolve();

    dropDb = () => Promise.resolve();

    setLang(lang: 'uk' | 'en') {
        const getCollection = (table: TABLES) => `${table}/${TABLES_DIR.LANG}/${lang}`;

        this.country.setTableName(getCollection(TABLES.COUNTRY));
        this.rank.setTableName(getCollection(TABLES.RANKS));
        this.status.setTableName(getCollection(TABLES.STATUSES));
        this.material.setTableName(getCollection(TABLES.MATERIAL));
        this.bookType.setTableName(getCollection(TABLES.BOOK_TYPE));
        this.explosiveDeviceType.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE_TYPE));
        this.explosiveObjectComponent.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_COMPONENT));
        this.missionRequestType.setTableName(getCollection(TABLES.MISSION_REQUEST_TYPE));

        this.explosiveObjectType.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_TYPE));
        this.explosiveObjectClass.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS));
        this.explosiveObjectClassItem.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_CLASS_ITEM));
        this.explosiveObject.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT));
        this.explosiveObjectDetails.setTableName(getCollection(TABLES.EXPLOSIVE_OBJECT_DETAILS));
        this.explosiveDevice.setTableName(getCollection(TABLES.EXPLOSIVE_DEVICE));
        this.explosive.setTableName(getCollection(TABLES.EXPLOSIVE));
    }

    setOrganizationId(id: string) {
        const rootCollection = `${TABLES_DIR.ORGANIZATION_DATA}/${id}`;
        organizationId = id;

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
        this.explosiveDeviceAction.setRootCollection(rootCollection);
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
        this.explosiveDeviceAction.removeRootCollection();

        organizationId = null;
    }

    private setBatch(batch: WriteBatch | null) {
        this.batch = batch;

        this.userInfo.setBatch(batch);
        this.userAccess.setBatch(batch);
        this.member.setBatch(batch);
        this.organization.setBatch(batch);
        this.explosiveObject.setBatch(batch);
        this.explosiveObjectDetails.setBatch(batch);
        this.explosiveDevice.setBatch(batch);
        this.explosive.setBatch(batch);
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
        this.explosiveDeviceAction.setBatch(batch);
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
