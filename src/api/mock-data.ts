import omit from "lodash/omit";

import { DOCUMENT_TYPE, EMPLOYEE_TYPE, EQUIPMENT_TYPE, EXPLOSIVE_OBJECT_CATEGORY, TRANSPORT_TYPE } from '~/constants';
import { dates } from "~/utils";

export const explosiveObjectActionsInput = {
	"type": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
	"name": "ТМ-62М",
	"caliber": 0,
	"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
	"quantity": 132,
	"category": EXPLOSIVE_OBJECT_CATEGORY.I,
	"isDiscovered": true,
	"isTransported": true,
	"isDestroyed": false
};

export const explosiveObjectActionsUpdateInput = {
	"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e7f0",
	"type": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
	"name": "ТМ-62М",
	"caliber": 0,
	"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
	"quantity": 132,
	"category": EXPLOSIVE_OBJECT_CATEGORY.I,
	"isDiscovered": true,
	"isTransported": true,
	"isDestroyed": false
};

export const squadInput = [
	"EMPLOYEE-2d639faa-dfb0-4530-a7aa-f6fa96b8ca81",
	"EMPLOYEE-6e67b207-6f47-4017-ae9c-4efc5ff389b6",
	"EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f",
	"EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e"
]

export const mapViewInput = {
	"markerLat": 50.4032592,
	"markerLng": 30.519838,
	"circleCenterLat": 50.40330119,
	"circleCenterLng": 30.519830598,
	"circleRadius": 33.424996681,
	"zoom": 18,
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
}

export const missionReportInput = {
	"approvedAt":  dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"approvedById": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
	"number": 1,
	"executedAt":  dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"orderId": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
	"missionRequestId": "MISSION_REQUEST-14e2e3fc-d8eb-4ee6-b7d4-4937a7ab8616",
	"checkedTerritory": 100,
	"depthExamination": 0.015,
	"mapView": mapViewInput,
	"workStart":  dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"exclusionStart":  dates.toDateServer(new Date("2024-02-04T00:25:03.668Z")),
	"transportingStart":  dates.toDateServer(new Date("2024-02-04T02:20:06.580Z")),
	"destroyedStart":  dates.toDateServer(new Date("2024-02-04T05:20:09.733Z")),
	"workEnd":  dates.toDateServer(new Date("2024-02-04T08:30:12.837Z")),
	"transportExplosiveObjectId": "TRANSPORT-2219e1f0-eb07-428b-a8ad-3a439740daf0",
	"transportHumansId": "TRANSPORT-5207e63d-cdfa-46ca-bd84-3235dc7986f9",
	"mineDetectorId": "EQUIPMENT-f4929004-6c13-40d7-9f05-2ba865860673",
	explosiveObjectActions: [explosiveObjectActionsInput],
	"squadLeaderId": "EMPLOYEE-1cb833c1-72bb-42da-ad57-6d2631782b04",
	"squadIds": squadInput,
	"address": "місто Київ, Київ, проспект 40-річчя Жовтня, 11",
	subNumber: null,
	uncheckedTerritory: null,
	uncheckedReason: null,
}

const orderSignedByActionDTO = {
	"type": EMPLOYEE_TYPE.CHIEF,
	"firstName": "Андрій",
	"lastName": "Кочан",
	"surname": "Юрійович",
	"rankId": "COLONEL",
	"typeInDocument": EMPLOYEE_TYPE.CHIEF,
	"position": "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:18:55.826Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-04T17:18:55.826Z")),
	"documentType": DOCUMENT_TYPE.ORDER,
	"documentId": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
	"employeeId": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
	"id": "EMPLOYEE_ACTION-4a3a7d47-8bc3-4caf-9448-49e82cff760d"
};

const orderDTO = {
	"signedAt": dates.toDateServer(new Date("2024-02-04T17:18:54.234Z")),
	"signedById": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843",
	"number": 1,
	"signedByActionId": "EMPLOYEE_ACTION-4a3a7d47-8bc3-4caf-9448-49e82cff760d",
	"id": "ORDER-36a247ff-3105-47af-aaa6-f7e7e2985494",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:18:55.811Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-04T17:18:55.828Z")),
	"signedByAction": orderSignedByActionDTO
}

const missionRequestDTO = {
	"signedAt": dates.toDateServer(new Date("2024-02-04T17:17:05.512Z")),
	"number": 5,
	"id": "MISSION_REQUEST-14e2e3fc-d8eb-4ee6-b7d4-4937a7ab8616",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:18:11.940Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-04T17:18:11.940Z")),
}

const MRmapViewDTO = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"markerLat": 50.4032592,
	"markerLng": 30.519838,
	"circleCenterLat": 50.40330119,
	"circleCenterLng": 30.519830598,
	"circleRadius": 33.424996681,
	"zoom": 18,
	"id": "MAP_VIEW_ACTION-359e894a-d903-4573-9954-3ab4e784c8df",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:20:17.496Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-11T14:03:15.344Z")),
}

const MRApprovedByActionDTO = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.CHIEF,
	"firstName": "Андрій",
	"lastName": "Кочан",
	"surname": "Юрійович",
	"rankId": "COLONEL",
	"typeInDocument": EMPLOYEE_TYPE.CHIEF,
	"position": "Начальник Мобільного рятувального центру швидкого реагування Державної служби України з надзвичайних ситуацій",
	"id": "EMPLOYEE_ACTION-e063662d-560d-4311-a90e-d64f8e4b3dcd",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:18:11.934Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:03:15.344Z")),
	"employeeId": "EMPLOYEE-8938ca06-e54b-42f7-80cc-c252b64f0843"
}

export const MRTransportExplosiveDTO = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "Toyota Land Cruiser",
	"number": "КА 645 Е",
	"type": TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS,
	"createdAt":  dates.toDateServer(new Date("2024-02-11T14:02:48.762Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:02:48.762Z")),
	"transportId": "TRANSPORT-2219e1f0-eb07-428b-a8ad-3a439740daf0",
	"id": "TRANSPORT_ACTION-90c9ec98-beac-49fe-872b-813b0899f841"
}

export const MRTransportHumansDTO = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "Toyota Land Cruiser",
	"number": "КА 645 Е",
	"type": TRANSPORT_TYPE.FOR_HUMANS,
	"createdAt":  dates.toDateServer(new Date("2024-02-11T14:02:48.762Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:02:48.762Z")),
	"transportId": "TRANSPORT-5207e63d-cdfa-46ca-bd84-3235dc7986f9",
	"id": "TRANSPORT_ACTION-90c9ec98-beac-49fe-872b-813b0899f840"
}

export const MRMineDetectorActionDTO  = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "Minelab F3",
	"type": EQUIPMENT_TYPE.MINE_DETECTOR,
	"id": "EQUIPMENT_ACTION-5f3a170e-83e9-4f0f-ad04-a08e27caca06",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:18:11.942Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:03:15.344Z")),
	"equipmentId": "EQUIPMENT-f4929004-6c13-40d7-9f05-2ba865860673"
}

const MRsquadLeaderActionDTO = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType":DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.SQUAD_LEAD,
	"typeInDocument": EMPLOYEE_TYPE.SQUAD_LEAD,
	"firstName": "Максимa",
	"lastName": "Костін",
	"surname": "Костін",
	"rankId": "SENIOR_LIEUTENANT",
	"position": "Начальник відділення",
	"id": "EMPLOYEE_ACTION-b585cacc-2d96-4643-8071-4778dcc26a6b",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:18:11.935Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:03:15.344Z")),
	"employeeId": "EMPLOYEE-1cb833c1-72bb-42da-ad57-6d2631782b04"
};

export const MREmployeeActionDTO1 = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.WORKER,
	"typeInDocument": EMPLOYEE_TYPE.WORKER,
	"firstName": "Ігор",
	"lastName": "Кондратюк",
	"surname": "Ігорович",
	"rankId": "SERGEANT",
	"position": "Водій",
	"id": "EMPLOYEE_ACTION-742131c9-3121-4a60-be80-e6e320a97a8f",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.498Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.498Z")),
	"employeeId": "EMPLOYEE-2d639faa-dfb0-4530-a7aa-f6fa96b8ca81"
}

export const MREmployeeActionDTO2 = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.WORKER,
	"typeInDocument": EMPLOYEE_TYPE.WORKER,
	"firstName": "Руслан",
	"lastName": "Данчук",
	"surname": "Іванович",
	"rankId": "MASTER_SERGEANT",
	"position": "Старший сапер",
	"id": "EMPLOYEE_ACTION-66f3cf77-9458-4983-bc3e-235ec982f44c",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.498Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.498Z")),
	"employeeId": "EMPLOYEE-6e67b207-6f47-4017-ae9c-4efc5ff389b6"
}
export const MREmployeeActionDTO3 = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.WORKER,
	"typeInDocument": EMPLOYEE_TYPE.WORKER,
	"firstName": "Віталій",
	"lastName": "Клименко",
	"surname": "Васильович",
	"rankId": "MASTER_SERGEANT",
	"position": "Cапер",
	"id": "EMPLOYEE_ACTION-4ae3fcec-a32c-479e-98a2-cb92f001deb5",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.499Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.499Z")),
	"employeeId": "EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f"
}
export const MREmployeeActionDTO4 = {
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"type": EMPLOYEE_TYPE.SQUAD_LEAD,
	"typeInDocument": EMPLOYEE_TYPE.WORKER,
	"firstName": "Ян",
	"lastName": "Пушкар",
	"surname": "Іванович",
	"rankId": "SENIOR_LIEUTENANT",
	"position": "Начальник відділення",
	"id": "EMPLOYEE_ACTION-c0458873-718f-4379-9de0-8c49640689db",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.499Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.499Z")),
	"employeeId": "EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e"
}

export const MRExplosiveObjectActionDTO = {
	category: EXPLOSIVE_OBJECT_CATEGORY.I,
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "ТМ-62М",
	"caliber": 0,
	"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e7f0",
	"createdAt":  dates.toDateServer(new Date("2024-02-04T17:20:17.502Z")),
	"updatedAt":  dates.toDateServer(new Date("2024-02-11T14:03:15.343Z")),
	"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
	"quantity": 132,
	"isDiscovered": true,
	"isTransported": true,
	"isDestroyed": false,
	"type": {
		"name": "ІМ",
		"fullName": "Інженерні міни",
		"id": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
		"createdAt":  dates.toDateServer(new Date("2024-02-04T17:16:22.004Z")),
		"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:16:22.004Z")),
	}
}

export const MRExplosiveObjectActionDTO2 = {
	category: EXPLOSIVE_OBJECT_CATEGORY.I,
	"documentId": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"documentType": DOCUMENT_TYPE.MISSION_REPORT,
	"name": "ТМ-62М",
	"caliber": 0,
	"id": "EXPLOSIVE_OBJECT_ACTION-dc098eb4-9d56-441e-9121-f4d4f744e444",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:20:17.502Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-11T14:03:15.343Z")),
	"explosiveObjectId": "EXPLOSIVE_OBJECT-80824494-bd3f-4303-9b4a-1286842deccf",
	"quantity": 132,
	"isDiscovered": false,
	"isTransported": false,
	"isDestroyed": false,
	"type": {
		"name": "ІМ",
		"fullName": "Інженерні міни",
		"id": "EXPLOSIVE_OBJECT_TYPE-6f899613-2221-4a91-9e05-c12fa698b1e9",
		"createdAt":  dates.toDateServer(new Date("2024-02-04T17:16:22.004Z")),
		"updatedAt":  dates.toDateServer(new Date("2024-02-04T17:16:22.004Z")),
	}
}

export const missionReportDTO = {
	"approvedAt":  dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"number": 1,
	"executedAt":  dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"checkedTerritory": 100,
	"depthExamination": 0.015,
	"workStart": dates.toDateServer(new Date("2024-02-04T17:18:19.202Z")),
	"exclusionStart":  dates.toDateServer(new Date("2024-02-04T00:25:03.668Z")),
	"transportingStart":  dates.toDateServer(new Date("2024-02-04T02:20:06.580Z")),
	"destroyedStart":  dates.toDateServer(new Date("2024-02-04T05:20:09.733Z")),
	"workEnd":  dates.toDateServer(new Date("2024-02-04T08:30:12.837Z")),
	"address": "місто Київ, Київ, проспект 40-річчя Жовтня, 11",
	"id": "MISSION_REPORT-ad4a59db-951a-458f-b4aa-e2c056c3225f",
	"createdAt": dates.toDateServer(new Date("2024-02-04T17:20:17.477Z")),
	"updatedAt": dates.toDateServer(new Date("2024-02-11T14:02:48.819Z")),
	subNumber: null,
	uncheckedTerritory: null,
	uncheckedReason: null,
	"order": orderDTO,
	"missionRequest": missionRequestDTO,
	"mapView": MRmapViewDTO,
	"approvedByAction": MRApprovedByActionDTO,
	"transportActions": [
		MRTransportExplosiveDTO,
		MRTransportHumansDTO
	],
	"equipmentActions": [
		MRMineDetectorActionDTO
	],
	"explosiveObjectActions": [
		MRExplosiveObjectActionDTO
	],
	"squadLeaderAction": MRsquadLeaderActionDTO,
	"squadActions": [
		MREmployeeActionDTO1,
		MREmployeeActionDTO2,
		MREmployeeActionDTO3,
		MREmployeeActionDTO4,
	]
}


export const missionReportDB = {
	...omit(missionReportDTO, [
		"missionRequest",
		"order",
		"mapView",
		"approvedByAction",
		"squadLeaderAction",
		"squadActions",
		"transportActions",
		"equipmentActions",
		"explosiveObjectActions",
	]),
	missionRequestId: missionReportDTO.missionRequest.id,
	orderId: missionReportDTO.order.id,
	mapViewId: missionReportDTO.mapView.id,
	approvedByActionId: missionReportDTO.approvedByAction.id,
	squadLeaderActionId: missionReportDTO.squadLeaderAction.id,
	squadActionIds: missionReportDTO.squadActions.map(el => el.id),
	transportActionIds: missionReportDTO.transportActions.map(el => el.id),
	equipmentActionIds: missionReportDTO.equipmentActions.map(el => el.id),
	explosiveObjectActionIds: missionReportDTO.explosiveObjectActions.map(el => el.id),
}



export const orderDB = {
	...omit(missionReportDTO.order, "signedByAction"),
	signedByActionId: missionReportDTO.order.signedByAction.id
}

export const missionRequestDB = {
	...missionReportDTO.missionRequest,
}

export const mapViewDB = {
	...missionReportDTO.mapView,
}

export const approvedByActionDB = {
	...missionReportDTO.approvedByAction,
};

export const squadLeaderActionDB = {
	...missionReportDTO.squadLeaderAction,
};

export const squadActionsDB = [...missionReportDTO.squadActions];

export const transportActionsDB = [...missionReportDTO.transportActions];

export const equipmentActionsDB = [...missionReportDTO.equipmentActions];

export const explosiveObjectActionsDB = missionReportDTO.explosiveObjectActions.map(el => ({...el, typeId: el.type.id}));

export const explosiveObjectTypeDB =  missionReportDTO.explosiveObjectActions.map(el => el.type);

export const orderSignedByActionDB =  orderDTO.signedByAction;