import omit from "lodash/omit";

import { IMissionReportDTO } from '~/api/types';
import { DB as DBMock } from '~/db';
import { EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { getCreateList, getRemoveList, generateActions, add } from '../mission-report';
import { 
	missionReportInput, 
	missionReportDTO, 
	MREmployeeActionDTO1,
	explosiveObjectActionsInput, 
	MRExplosiveObjectAсtionDTO,
	MRTransportExplosiveDTO,
	MRTransportHumansDTO, 
	workersInput,
	MRMineDetectorActionDTO,
	MREmployeeActionDTO3,
	MREmployeeActionDTO4
} from "../../mock-data"

jest.mock("~/db");

const omitted = (obj?: object) => omit(obj, ['id', "updatedAt", "createdAt"]);

describe('getCreateList', () => {
	test('should return lists of items to be created when none exist', () => {
		const missionReport:IMissionReportDTO = {
			...missionReportDTO,
			transportActions: [],
			equipmentActions: [],
			squadActions: [],
			explosiveObjectActions: [],
		};

		const inputValue = {
			...missionReportInput,
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			squadIds: ['worker1', 'worker2'],
			explosiveObjectActions: [
				{ ...explosiveObjectActionsInput, explosiveObjectId: 'explosive1' },
				{ ...explosiveObjectActionsInput, explosiveObjectId: 'explosive2' }
			]
		};

		const result = getCreateList(inputValue, missionReport);
        
		expect(result).toStrictEqual({
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			squadIds: ['worker1', 'worker2'],
			explosiveObjectIds: ['explosive1', 'explosive2']
		});
	});

	test('should not include items that already exist', () => {
		const missionReport = {
			...missionReportDTO,
			transportActions: [{ ...MRTransportHumansDTO, transportId: 'human-transport-id' }],
			equipmentActions: [{ ...MRMineDetectorActionDTO, equipmentId: 'mine-detector-id' }],
			squadActions: [{ ...MREmployeeActionDTO1, employeeId: 'worker1' }],
			explosiveObjectActions: [{ ...MRExplosiveObjectAсtionDTO, explosiveObjectId: 'explosive1' }]
		};
		const inputValue = {
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: 'human-transport-id',
			mineDetectorId: 'mine-detector-id',
			squadIds: ['worker1', 'worker2'],
			explosiveObjectActions: [
				{ ...explosiveObjectActionsInput, explosiveObjectId: 'explosive1' },
				{ ...explosiveObjectActionsInput, explosiveObjectId: 'explosive2' }
			]
		};

		const result = getCreateList(inputValue, missionReport);

		expect(result).toStrictEqual({
			transportExplosiveObjectId: 'explosive-transport-id',
			transportHumansId: undefined, // Already exists
			mineDetectorId: undefined, // Already exists
			squadIds: ['worker2'], // 'worker1' already exists
			explosiveObjectIds: ['explosive2'] // 'explosive1' already exists
		});
	});
});

describe('getRemoveList', () => {
	test('should return empty lists when there are no items to remove', () => {
	  const result = getRemoveList(missionReportInput, missionReportDTO);
  
	  expect(result).toStrictEqual({
			transportExplosiveObjectActionId: undefined,
			transportHumansActionId: undefined,
			mineDetectorActionId: undefined,
			workersActionIds: [],
			explosiveObjectActionIds: [],
	  });
	});
  
	test('should return ids of items to be removed when items are excluded', () => {
	  // Scenario setup: Remove one transport, one equipment, one worker, and one explosive object from the mission report
	  const modifiedMissionReportInput = {
			...missionReportInput,
			"transportExplosiveObjectId":undefined,
			"transportHumansId": undefined,
			"mineDetectorId": undefined,
			"explosiveObjectActions": [],
			"squadIds": workersInput.filter(employeeId => (employeeId !== "EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f" && employeeId !== "EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e")),
	  };
  
	  const result = getRemoveList(modifiedMissionReportInput, missionReportDTO);
  
	  expect(result).toStrictEqual({
			transportExplosiveObjectActionId: MRTransportExplosiveDTO.id,
			transportHumansActionId: MRTransportHumansDTO.id,
			mineDetectorActionId: MRMineDetectorActionDTO.id,
			workersActionIds: [
				MREmployeeActionDTO3.id,
				MREmployeeActionDTO4.id,
			],
			explosiveObjectActionIds: [missionReportDTO.explosiveObjectActions[0].id],
	  });
	});
});

describe('generateActions', () => {
	const DB = jest.mocked<any>(DBMock);

	beforeEach(() => {
	  jest.clearAllMocks();
  
	  DB.employee.select.mockResolvedValueOnce([
			missionReportDTO.approvedByAction,
			missionReportDTO.squadLeaderAction,
			...missionReportDTO.squadActions,
	  ].map(el => ({ ...el, id: el.employeeId })));
	  DB.transport.select.mockResolvedValueOnce(missionReportDTO.transportActions.map(el => ({ ...el, id: el.transportId })));
	  DB.explosiveObject.select.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions.map(el => ({ ...el, id: el.explosiveObjectId })));
	  DB.equipment.select.mockResolvedValueOnce(missionReportDTO.equipmentActions.map(el => ({ ...el, id: el.equipmentId })));
	});
  
	test('successfully generates all actions', async () => {
	  const result = await generateActions('missionReportId', missionReportInput);
  

	  expect(result).toStrictEqual({
			mapViewValue: omitted(missionReportInput.mapView),
			approvedByAction: omitted(missionReportDTO.approvedByAction),
			squadLeaderAction: omitted(missionReportDTO.squadLeaderAction),
			squadActions: missionReportDTO.squadActions.map(el => omitted(el)),
			transportHumansAction: omitted(missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_HUMANS)),
			transportExplosiveObjectAction: omitted(missionReportDTO.transportActions.find(el => el.type === TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS)),
			mineDetectorAction: omitted(missionReportDTO.equipmentActions.find(el => el.type === EQUIPMENT_TYPE.MINE_DETECTOR)),
			explosiveObjectsActions: missionReportDTO.explosiveObjectActions.map(el => (omitted({...el, type: el.type.id}))),
	  });
	});

	test('handles missing inputs gracefully', async () => {
		const partialInput = { ...missionReportInput, transportExplosiveObjectId: undefined, mineDetectorId: undefined };
		DB.transport.select.mockResolvedValueOnce([]);
		DB.equipment.select.mockResolvedValueOnce([]);
	  
		const result = await generateActions('missionReportId', partialInput);
	  
		expect(result.transportExplosiveObjectAction).toBeUndefined();
		expect(result.mineDetectorAction).toBeUndefined();
	});


	test('verifies correct database queries for employees and equipment', async () => {
		await generateActions('missionReportId', missionReportInput);

		expect(DB.employee.select).toHaveBeenCalledWith({
			where: {
				id: { in: [missionReportInput.approvedById, missionReportInput.squadLeaderId, ...missionReportInput.squadIds] }
			}
		});

		expect(DB.equipment.select).toHaveBeenCalledWith({
			where: {
				id: { in: [missionReportInput.mineDetectorId].filter(Boolean) }
			}
		});
	});
});

describe('add function', () => {
	const DB = jest.mocked<any>(DBMock);

	const ms = {
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
			"createdAt",
			"updatedAt",
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
	};

	const msParam = omitted(ms)

	beforeEach(() => {
	  jest.clearAllMocks();
		
	  DB.missionReport.get.mockResolvedValueOnce(ms);
	  DB.missionReport.add.mockResolvedValueOnce(ms);

	  DB.mapViewAction.add.mockResolvedValueOnce(missionReportDTO.mapView);
	  DB.employeeAction.add.mockResolvedValueOnce(missionReportDTO.approvedByAction);
	  DB.employeeAction.add.mockResolvedValueOnce(missionReportDTO.squadLeaderAction);
	  
	  missionReportDTO.squadActions.map(el  => DB.employeeAction.add.mockResolvedValueOnce(el))
	  missionReportDTO.transportActions.map(el  => DB.transportAction.add.mockResolvedValueOnce(el))
	  missionReportDTO.equipmentActions.map(el  => DB.equipmentAction.add.mockResolvedValueOnce(el))
	  missionReportDTO.explosiveObjectActions.map(el  => DB.explosiveObjectAction.add.mockResolvedValueOnce(el))

	  DB.employee.select.mockResolvedValueOnce([
			missionReportDTO.approvedByAction,
			missionReportDTO.squadLeaderAction,
			...missionReportDTO.squadActions,
	  ].map(el => ({ ...el, id: el.employeeId })));
	  DB.transport.select.mockResolvedValueOnce(missionReportDTO.transportActions.map(el => ({ ...el, id: el.transportId })));
	  DB.explosiveObject.select.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions.map(el => ({ ...el, id: el.explosiveObjectId })));
	  DB.equipment.select.mockResolvedValueOnce(missionReportDTO.equipmentActions.map(el => ({ ...el, id: el.equipmentId })));
	});

	test('successfully adds a new mission report with all related actions', async () => {
		await add(missionReportInput);
	
		expect(DBMock.missionReport.add).toHaveBeenCalledTimes(1);
		expect(DBMock.missionReport.update).toHaveBeenCalledTimes(1);
		expect(DBMock.missionReport.update).toHaveBeenCalledWith(missionReportDTO.id, msParam);
	});
});