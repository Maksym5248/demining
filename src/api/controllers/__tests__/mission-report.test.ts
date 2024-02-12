import { DOCUMENT_TYPE, EMPLOYEE_TYPE, EQUIPMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY, TRANSPORT_TYPE } from '~/constants';
import { IMissionReportDTO } from '~/api/types';

import { getCreateList } from '../mission-report';


jest.mock("~/db");

const baseValue = {
	"approvedAt":  new Date("2024-02-04T17:18:19.202Z"),
	"approvedById": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
	"number": 1,
	"executedAt":  new Date("2024-02-04T17:18:19.202Z"),
	"orderId": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
	"missionRequestId": "MISSION_REQUEST-14e2e3fc-d8eb-4ee6-b7d4-4937a7ab8616",
	"checkedTerritory": 100,
	"depthExamination": 0.014,
	"mapView": {
		"markerLat": 50.4032592,
		"markerLng": 30.519838,
		"circleCenterLat": 50.40330119,
		"circleCenterLng": 30.519830598,
		"circleRadius": 33.424996681,
		"zoom": 18
	},
	"workStart":  new Date("2024-02-04T17:18:19.202Z"),
	"exclusionStart":  new Date("2024-02-04T00:25:03.668Z"),
	"transportingStart":  new Date("2024-02-04T02:20:06.580Z"),
	"destroyedStart":  new Date("2024-02-04T05:20:09.733Z"),
	"workEnd":  new Date("2024-02-04T08:30:12.837Z"),
	"transportExplosiveObjectId": "TRANSPORT-2219e1f0-eb07-428b-a8ad-3a439740daf0",
	"transportHumansId": "TRANSPORT-5207e63d-cdfa-46ca-bd84-3235dc7986f9",
	"mineDetectorId": "EQUIPMENT-f4929004-6c13-40d7-9f05-2ba865860673",
	"explosiveObjectActions": [
		{
			"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e7f0",
			"type": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
			"name": "ТМ-62М",
			"caliber": 0,
			"createdAt": new Date("2024-02-04T17:20:17.502Z"),
			"updatedAt": new Date("2024-02-12T07:50:49.854Z"),
			"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"quantity": 132,
			"category": "I",
			"isDiscovered": true,
			"isTransported": true,
			"isDestroyed": false
		}
	],
	"squadLeadId": "EMPLOYEE-1cb833c1-72bb-42da-ad57-6d2631782b04",
	"workersIds": [
		"EMPLOYEE-2d639faa-dfb0-4530-a7aa-f6fa96b8ca81",
		"EMPLOYEE-6e67b207-6f47-4017-ae9c-4efc5ff389b6",
		"EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f",
		"EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e"
	],
	"address": "місто Київ, Київ, проспект 40-річчя Жовтня, 11"
}

const baseMissionReportDTO = {
	"approvedAt":  new Date("2024-02-04T17:18:19.202Z"),
	"number": 1,
	"executedAt":  new Date("2024-02-04T17:18:19.202Z"),
	"checkedTerritory": 100,
	"depthExamination": 0.015,
	"workStart": new Date("2024-02-04T17:18:19.202Z"),
	"exclusionStart":  new Date("2024-02-04T00:25:03.668Z"),
	"transportingStart":  new Date("2024-02-04T02:20:06.580Z"),
	"destroyedStart":  new Date("2024-02-04T05:20:09.733Z"),
	"workEnd":  new Date("2024-02-04T08:30:12.837Z"),
	"address": "місто Київ, Київ, проспект 40-річчя Жовтня, 11",
	"id": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"createdAt": new Date("2024-02-04T17:20:17.477Z"),
	"updatedAt": new Date("2024-02-11T14:02:48.819Z"),
	subNumber: undefined,
	uncheckedTerritory: undefined,
	uncheckedReason: undefined,
	"order": {
		"signedAt": new Date("2024-02-04T17:18:54.234Z"),
		"signedById": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
		"number": 1,
		"signedByActionId": "EMPLOYEE_ACTION-4a3a7d47-8bc3-4caf-9448-49e82cff760d",
		"id": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
		"createdAt": new Date("2024-02-04T17:18:55.811Z"),
		"updatedAt": new Date("2024-02-04T17:18:55.828Z"),
		"signedByAction": {
			"type": EMPLOYEE_TYPE.CHIEF,
			"firstName": "Андрій",
			"lastName": "Кочан",
			"surname": "Юрійович",
			"rankId": "COLONEL",
			"position": "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій",
			"createdAt": new Date("2024-02-04T17:18:55.826Z"),
			"updatedAt": new Date("2024-02-04T17:18:55.826Z"),
			"documentType": DOCUMENT_TYPE.ORDER,
			"documentId": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
			"employeeId": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
			"id": "EMPLOYEE_ACTION-4a3a7d47-8bc3-4caf-9448-49e82cff760d"
		}
	},
	"missionRequest": {
		"signedAt": new Date("2024-02-04T17:17:05.512Z"),
		"number": 5,
		"id": "MISSION_REQUEST-14e2e3fc-d8eb-4ee6-b7d4-4937a7ab8616",
		"createdAt": new Date("2024-02-04T17:18:11.940Z"),
		"updatedAt": new Date("2024-02-04T17:18:11.940Z"),
	},
	"mapView": {
		"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
		"documentType": DOCUMENT_TYPE.MISSION_REPORT,
		"markerLat": 50.4032592,
		"markerLng": 30.519838,
		"circleCenterLat": 50.40330119,
		"circleCenterLng": 30.519830598,
		"circleRadius": 33.424996681,
		"zoom": 18,
		"id": "MAP_VIEW_ACTION-359e894a-d903-4573-9954-3ab4e784c8df",
		"createdAt": new Date("2024-02-04T17:20:17.496Z"),
		"updatedAt": new Date("2024-02-11T14:03:15.344Z"),
	},
	"approvedByAction": {
		"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
		"documentType": DOCUMENT_TYPE.MISSION_REPORT,
		"type": EMPLOYEE_TYPE.CHIEF,
		"firstName": "Андрій",
		"lastName": "Кочан",
		"surname": "Юрійович",
		"rankId": "COLONEL",
		"position": "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій",
		"id": "EMPLOYEE_ACTION-e063662d-560d-4311-a90e-d64f8e4b3dcd",
		"createdAt":  new Date("2024-02-04T17:18:11.934Z"),
		"updatedAt":  new Date("2024-02-11T14:03:15.344Z"),
		"employeeId": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843"
	},
	"transportActions": [
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"name": "Toyota Land Cruiser",
			"number": "КА 645 Е",
			"type": "FOR_EXPLOSIVE_OBJECTS",
			"createdAt":  new Date("2024-02-11T14:02:48.762Z"),
			"updatedAt":  new Date("2024-02-11T14:02:48.762Z"),
			"transportId": "TRANSPORT-62b77733-2ef8-4dd7-90a1-6edf27b7746f",
			"id": "TRANSPORT_ACTION-90c9ec98-beac-49fe-872b-813b0899f840"
		},
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"name": "Toyota Hilux 2",
			"number": "КА 7062 Е",
			"type": "FOR_HUMANS",
			"id": "TRANSPORT_ACTION-dd2311e5-d00d-4cdf-ab86-f5bc5fef28e6",
			"createdAt":  new Date("2024-02-04T17:20:17.500Z"),
			"updatedAt":  new Date("2024-02-04T17:20:17.500Z"),
			"transportId": "TRANSPORT-5207e63d-cdfa-46ca-bd84-3235dc7986f9"
		}
	],
	"equipmentActions": [
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"name": "Minelab F3",
			"type": "MINE_DETECTOR",
			"id": "EQUIPMENT_ACTION-5f3a170e-83e9-4f0f-ad04-a08e27caca06",
			"createdAt":  new Date("2024-02-04T17:18:11.942Z"),
			"updatedAt":  new Date("2024-02-11T14:03:15.344Z"),
			"equipmentId": "EQUIPMENT-f4929004-6c13-40d7-9f05-2ba865860673"
		},
	],
	"explosiveObjectActions": [
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"name": "ТМ-62М",
			"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e7f0",
			"createdAt":  new Date("2024-02-04T17:20:17.502Z"),
			"updatedAt":  new Date("2024-02-11T14:03:15.343Z"),
			"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
			"category": "I",
			"quantity": 132,
			"isDiscovered": true,
			"isTransported": true,
			"isDestroyed": false,
			"type": {
				"name": "ІМ",
				"fullName": "Інженерні міни",
				"id": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
				"createdAt":  new Date("2024-02-04T17:16:22.004Z"),
				"updatedAt":  new Date("2024-02-04T17:16:22.004Z"),
			}
		}
	],
	"squadLeaderAction": {
		"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
		"documentType":DOCUMENT_TYPE.MISSION_REPORT,
		"type": EMPLOYEE_TYPE.SQUAD_LEAD,
		"firstName": "Максимa",
		"lastName": "Костін",
		"surname": "Костін",
		"rankId": "SENIOR_LIEUTENANT",
		"position": "Начальник відділення",
		"id": "EMPLOYEE_ACTION-b585cacc-2d96-4643-8071-4778dcc26a6b",
		"createdAt":  new Date("2024-02-04T17:18:11.935Z"),
		"updatedAt":  new Date("2024-02-11T14:03:15.344Z"),
		"employeeId": "EMPLOYEE-1cb833c1-72bb-42da-ad57-6d2631782b04"
	},
	"squadActions": [
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"type": EMPLOYEE_TYPE.WORKER,
			"firstName": "Ігор",
			"lastName": "Кондратюк",
			"surname": "Ігорович",
			"rankId": "SERGEANT",
			"position": "Водій",
			"id": "EMPLOYEE_ACTION-742131c9-3121-4a60-be80-e6e320a97a8f",
			"createdAt":  new Date("2024-02-04T17:20:17.498Z"),
			"updatedAt":  new Date("2024-02-04T17:20:17.498Z"),
			"employeeId": "EMPLOYEE-2d639faa-dfb0-4530-a7aa-f6fa96b8ca81"
		},
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"type": EMPLOYEE_TYPE.WORKER,
			"firstName": "Руслан",
			"lastName": "Данчук",
			"surname": "Іванович",
			"rankId": "MASTER_SERGEANT",
			"position": "Старший сапер",
			"id": "EMPLOYEE_ACTION-66f3cf77-9458-4983-bc3e-235ec982f44c",
			"createdAt":  new Date("2024-02-04T17:20:17.498Z"),
			"updatedAt":  new Date("2024-02-04T17:20:17.498Z"),
			"employeeId": "EMPLOYEE-6e67b207-6f47-4017-ae9c-4efc5ff389b6"
		},
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"type": EMPLOYEE_TYPE.WORKER,
			"firstName": "Віталій",
			"lastName": "Клименко",
			"surname": "Васильович",
			"rankId": "MASTER_SERGEANT",
			"position": "Cапер",
			"id": "EMPLOYEE_ACTION-4ae3fcec-a32c-479e-98a2-cb92f001deb5",
			"createdAt":  new Date("2024-02-04T17:20:17.499Z"),
			"updatedAt":  new Date("2024-02-04T17:20:17.499Z"),
			"employeeId": "EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f"
		},
		{
			"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
			"documentType": DOCUMENT_TYPE.MISSION_REPORT,
			"type": EMPLOYEE_TYPE.SQUAD_LEAD,
			"firstName": "Ян",
			"lastName": "Пушкар",
			"surname": "Іванович",
			"rankId": "SENIOR_LIEUTENANT",
			"position": "Начальник відділення",
			"id": "EMPLOYEE_ACTION-c0458873-718f-4379-9de0-8c49640689db",
			"createdAt":  new Date("2024-02-04T17:20:17.499Z"),
			"updatedAt":  new Date("2024-02-04T17:20:17.499Z"),
			"employeeId": "EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e"
		}
	]
}

const baseEmployee = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.WORKER,
	"firstName": "Ігор",
	"lastName": "Кондратюк",
	"surname": "Ігорович",
	"rankId": "SERGEANT",
	"position": "Водій",
	"id": "EMPLOYEE_ACTION-742131c9-3121-4a60-be80-e6e320a97a8f",
	"createdAt":  new Date("2024-02-04T17:20:17.498Z"),
	"updatedAt":  new Date("2024-02-04T17:20:17.498Z"),
	"employeeId": "EMPLOYEE-2d639faa-dfb0-4530-a7aa-f6fa96b8ca81"
}
const baseExplosiveObjectAсtion = {
	category: EXPLOSIVE_OBJECT_CATEGORY.I,
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "ТМ-62М",
	"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e7f0",
	"createdAt":  new Date("2024-02-04T17:20:17.502Z"),
	"updatedAt":  new Date("2024-02-11T14:03:15.343Z"),
	"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
	"quantity": 132,
	"isDiscovered": true,
	"isTransported": true,
	"isDestroyed": false,
	"type": {
		"name": "ІМ",
		"fullName": "Інженерні міни",
		"id": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
		"createdAt":  new Date("2024-02-04T17:16:22.004Z"),
		"updatedAt":  new Date("2024-02-04T17:16:22.004Z"),
	}
}

const baseTransport = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "Toyota Land Cruiser",
	"number": "КА 645 Е",
	"createdAt":  new Date("2024-02-11T14:02:48.762Z"),
	"updatedAt":  new Date("2024-02-11T14:02:48.762Z"),
	"id": "TRANSPORT_ACTION-90c9ec98-beac-49fe-872b-813b0899f840"
}

describe('getCreateList', () => {
	test('should return lists of items to be created when none exist', () => {
		const missionReportDTO:IMissionReportDTO = {
			...baseMissionReportDTO,
			transportActions: [],
			equipmentActions: [],
			squadActions: [],
			explosiveObjectActions: [],
		};

		const inputValue = {
			...baseValue,
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			workersIds: ['worker1', 'worker2'],
			explosiveObjectActions: [
				{ ...baseExplosiveObjectAсtion, explosiveObjectId: 'explosive1' },
				{ ...baseExplosiveObjectAсtion, explosiveObjectId: 'explosive2' }
			]
		};

		const result = getCreateList(inputValue, missionReportDTO);
        
		expect(result).toStrictEqual({
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			workersIds: ['worker1', 'worker2'],
			explosiveObjectIds: ['explosive1', 'explosive2']
		});
	});

	test('should not include items that already exist', () => {
		const missionReportDTO = {
			...baseMissionReportDTO,
			transportActions: [{ ...baseTransport, type: TRANSPORT_TYPE.FOR_HUMANS, transportId: 'human-transport-id' }],
			equipmentActions: [{ ...baseTransport, type: EQUIPMENT_TYPE.MINE_DETECTOR, equipmentId: 'mine-detector-id' }],
			squadActions: [{ ...baseEmployee, employeeId: 'worker1' }],
			explosiveObjectActions: [{ ...baseExplosiveObjectAсtion, explosiveObjectId: 'explosive1' }]
		};
		const inputValue = {
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			workersIds: ['worker1', 'worker2'],
			explosiveObjectActions: [
				{ ...baseExplosiveObjectAсtion, explosiveObjectId: 'explosive1' },
				{ ...baseExplosiveObjectAсtion, explosiveObjectId: 'explosive2' }
			]
		};

		const result = getCreateList(inputValue, missionReportDTO);

		expect(result).toStrictEqual({
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: undefined, // Already exists
			mineDetectorId: undefined, // Already exists
			workersIds: ['worker2'], // 'worker1' already exists
			explosiveObjectIds: ['explosive2'] // 'explosive1' already exists
		});
	});
});