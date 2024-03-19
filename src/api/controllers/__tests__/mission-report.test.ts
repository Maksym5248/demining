import omit from "lodash/omit";

import { IMissionReportDTO } from '~/api/types';
import { DB as DBMock } from '~/db';
import { EQUIPMENT_TYPE, TRANSPORT_TYPE } from '~/constants';

import { getCreateList, getRemoveList, generateActions, create, update, get, getUpdatedList } from '../mission-report';
import { 
	missionReportInput, 
	missionReportDTO, 
	MREmployeeActionDTO1,
	explosiveObjectActionsInput, 
	explosiveObjectActionsUpdateInput,
	MRExplosiveObjectActionDTO,
	MRExplosiveObjectActionDTO2,
	MRTransportExplosiveDTO,
	MRTransportHumansDTO, 
	MRMineDetectorActionDTO,
	missionReportDB,
	orderDB,
	missionRequestDB,
	mapViewDB,
	approvedByActionDB,
	squadLeaderActionDB,
	squadActionsDB,
	transportActionsDB,
	equipmentActionsDB ,
	explosiveObjectActionsDB,
	orderSignedByActionDB,
} from "../../mock-data"

jest.mock("~/db");

const omitted = (obj?: object) => omit(obj, ['id', "updatedAt", "createdAt"]);

describe('mission-report', () => {
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
				explosiveObjectActions: [MRExplosiveObjectActionDTO]
			};
			const inputValue = {
				transportExplosiveObjectId: 'explosive-transport-id',
				transportHumansId: 'human-transport-id',
				mineDetectorId: 'mine-detector-id',
				squadIds: ['worker1', 'worker2'],
				explosiveObjectActions: [
					explosiveObjectActionsUpdateInput,
					{ ...explosiveObjectActionsInput, explosiveObjectId: "explosiveObjectId" }
				]
			};

			const result = getCreateList(inputValue, missionReport);

			expect(result).toStrictEqual({
				transportExplosiveObjectId: 'explosive-transport-id',
				transportHumansId: undefined,
				mineDetectorId: undefined,
				squadIds: ['worker2'],
				explosiveObjectIds: ['explosiveObjectId']
			});
		});

		test('should return cuurent lists of items if 2 explosiveObjectsActions has the same  explosiveObjectId', () => {
			const missionReport:IMissionReportDTO = {
				...missionReportDTO,
				transportActions: [],
				equipmentActions: [],
				squadActions: [],
			};

			const inputValue = {
				...missionReportInput,
				transportExplosiveObjectId: 'explosive-transport-id',
				transportHumansId: 'human-transport-id',
				mineDetectorId: 'mine-detector-id',
				squadIds: ['worker1', 'worker2'],
				explosiveObjectActions: [
					{ ...explosiveObjectActionsUpdateInput},
					{ ...explosiveObjectActionsInput }
				]
			};

			const result = getCreateList(inputValue, missionReport);
        
			expect(result).toStrictEqual({
				transportExplosiveObjectId: 'explosive-transport-id',
				transportHumansId: 'human-transport-id',
				mineDetectorId: 'mine-detector-id',
				squadIds: ['worker1', 'worker2'],
				explosiveObjectIds: [explosiveObjectActionsInput.explosiveObjectId]
			});
		});
	});

	describe('getRemoveList', () => {
		test('should return empty lists when there are no items to remove', () => {
	  const result = getRemoveList({
				...missionReportInput,
				explosiveObjectActions: [explosiveObjectActionsUpdateInput]
	  }, missionReportDTO);
  
	  expect(result).toStrictEqual({
				transportExplosiveObjectActionId: undefined,
				transportHumansActionId: undefined,
				mineDetectorActionId: undefined,
				squadActionIds: [],
				explosiveObjectActionIds: [],
	  });
		});
  
		test('should return ids of items to be removed when items are empty', () => {
	  const modifiedMissionReportInput = {
				...missionReportInput,
				"transportExplosiveObjectId":undefined,
				"transportHumansId": undefined,
				"mineDetectorId": undefined,
				"explosiveObjectActions": [],
				"squadIds": [],
				"explosiveObjectActionIds": []
	  };
  
	  const result = getRemoveList(modifiedMissionReportInput, missionReportDTO);
  
	  expect(result).toStrictEqual({
				transportExplosiveObjectActionId: MRTransportExplosiveDTO.id,
				transportHumansActionId: MRTransportHumansDTO.id,
				mineDetectorActionId: MRMineDetectorActionDTO.id,
				squadActionIds: missionReportDTO.squadActions.map(el => el.id),
				explosiveObjectActionIds: missionReportDTO.explosiveObjectActions.map(el => el.id),
	  });
		});

		test('should return ids of items to be removed when items are changed', () => {
			const modifiedMissionReportInput = {
			  ...missionReportInput,
			  "transportExplosiveObjectId": "test",
			  "transportHumansId": "test",
			  "mineDetectorId": "test",
			  "explosiveObjectActions": missionReportInput.explosiveObjectActions.map(el => ({...el, explosiveObjectId: "test"})),
			  "squadIds": ["1", "2", "3", "4"]
			};
	
			const result = getRemoveList(modifiedMissionReportInput, missionReportDTO);
	
	    expect(result).toStrictEqual({
				transportExplosiveObjectActionId: MRTransportExplosiveDTO.id,
				transportHumansActionId: MRTransportHumansDTO.id,
				mineDetectorActionId: MRMineDetectorActionDTO.id,
				squadActionIds: missionReportDTO.squadActions.map(el => el.id),
				explosiveObjectActionIds: missionReportDTO.explosiveObjectActions.map(el => el.id),
			});
	  });
	});

	describe('getUpdatedList', () => {
		const mockMissionReportDTO = {
			transportActions: [
				{ id: 'transportHumans1', type: TRANSPORT_TYPE.FOR_HUMANS },
				{ id: 'transportExplosiveObjects1', type: TRANSPORT_TYPE.FOR_EXPLOSIVE_OBJECTS }
			],
			equipmentActions: [
				{ id: 'mineDetector1', type: EQUIPMENT_TYPE.MINE_DETECTOR }
			],
			squadActions: [
				{ id: 'squadAction1' },
				{ id: 'squadAction2' }
			],
			explosiveObjectActions: [
				{ id: 'explosiveObjectAction1' },
				{ id: 'explosiveObjectAction2' }
			],
		} as IMissionReportDTO;

		test('should includes if removed is empty', () => {
			const removeList = {
				transportExplosiveObjectActionId: undefined,
				transportHumansActionId: undefined,
				mineDetectorActionId: undefined,
				squadActionIds: [],
				explosiveObjectActionIds: []
			};

			const result = getUpdatedList(removeList, mockMissionReportDTO);

			expect(result).toStrictEqual({
				transportHumansActionId: "transportHumans1",
				transportExplosiveObjectActionId: "transportExplosiveObjects1",
				mineDetectorActionId: "mineDetector1",
				squadActionIds: ["squadAction1", "squadAction2"],
				explosiveObjectActionsIds: ["explosiveObjectAction1", "explosiveObjectAction2"],
			});
		});

		test('should not includes if removed not empty', () => {
			const removeList = {
				transportExplosiveObjectActionId: "transportExplosiveObjects1",
				transportHumansActionId: "transportHumans1",
				mineDetectorActionId: "mineDetector1",
				squadActionIds: ["squadAction1", "squadAction2"],
				explosiveObjectActionIds: ["explosiveObjectAction1", "explosiveObjectAction2"],
			};

			const result = getUpdatedList(removeList, mockMissionReportDTO);

			expect(result).toStrictEqual({
				transportHumansActionId: undefined,
				transportExplosiveObjectActionId: undefined,
				mineDetectorActionId: undefined,
				squadActionIds: [],
				explosiveObjectActionsIds: [],
			});
		});

		test('should not includes  if removed includes anoter values', () => {
			const removeList = {
				transportExplosiveObjectActionId: "1",
				transportHumansActionId: "2",
				mineDetectorActionId: "3",
				squadActionIds: ["4", "5"],
				explosiveObjectActionIds: ["6", "7"],
			};

			const result = getUpdatedList(removeList, mockMissionReportDTO);

			expect(result).toStrictEqual({
				transportHumansActionId: "transportHumans1",
				transportExplosiveObjectActionId: "transportExplosiveObjects1",
				mineDetectorActionId: "mineDetector1",
				squadActionIds: ["squadAction1", "squadAction2"],
				explosiveObjectActionsIds: ["explosiveObjectAction1", "explosiveObjectAction2"],
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
				explosiveObjectsActions: missionReportDTO.explosiveObjectActions.map(el => (omitted({...el, type: el.typeId}))),
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

	describe('create function', () => {
		const DB = jest.mocked<any>(DBMock);

		const msParam = omitted(missionReportDB)

		beforeEach(() => {
	  jest.clearAllMocks();
		
	  DB.missionReport.get.mockResolvedValueOnce(missionReportDB);
	  DB.missionReport.create.mockResolvedValueOnce(missionReportDB);

	  DB.mapViewAction.create.mockResolvedValueOnce(missionReportDTO.mapView);
	  DB.employeeAction.create.mockResolvedValueOnce(missionReportDTO.approvedByAction);
	  DB.employeeAction.create.mockResolvedValueOnce(missionReportDTO.squadLeaderAction);
	  
	  missionReportDTO.squadActions.map(el  => DB.employeeAction.create.mockResolvedValueOnce(el))
	  missionReportDTO.transportActions.map(el  => DB.transportAction.create.mockResolvedValueOnce(el))
	  missionReportDTO.equipmentActions.map(el  => DB.equipmentAction.create.mockResolvedValueOnce(el))

	  DB.employee.select.mockResolvedValueOnce([
				missionReportDTO.approvedByAction,
				missionReportDTO.squadLeaderAction,
				...missionReportDTO.squadActions,
	  ].map(el => ({ ...el, id: el.employeeId })));
	  DB.transport.select.mockResolvedValueOnce(missionReportDTO.transportActions.map(el => ({ ...el, id: el.transportId })));
	  DB.equipment.select.mockResolvedValueOnce(missionReportDTO.equipmentActions.map(el => ({ ...el, id: el.equipmentId })));
		});

		test('successfully adds a new mission report with all related actions', async () => {
			DB.explosiveObject.select.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions.map(el => ({ ...el, id: el.explosiveObjectId })));
			missionReportDTO.explosiveObjectActions.map(el  => DB.explosiveObjectAction.create.mockResolvedValueOnce(el))

			await create(missionReportInput);
	
			expect(DBMock.missionReport.create).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledWith(missionReportDTO.id, msParam);
		});

		test('successfully adds a new mission report if two explosiveObjectActions with the same exposive objects', async () => {
			const explosiveObjectActions = [
				...missionReportDTO.explosiveObjectActions,
				MRExplosiveObjectActionDTO2
			];

			const input = {
				...missionReportInput,
				explosiveObjectActions: [
					...missionReportInput.explosiveObjectActions,
					{
						...missionReportInput.explosiveObjectActions[0],
						isDestroyed: false
					}
				]
			}

			DB.explosiveObject.select.mockResolvedValueOnce(explosiveObjectActions.map(el => ({ ...el, id: el.explosiveObjectId })));
			explosiveObjectActions.map(el  => DB.explosiveObjectAction.create.mockResolvedValueOnce(el))

			await create(input);
	
			expect(DBMock.explosiveObjectAction.create).toHaveBeenCalledTimes(2);
			expect(DBMock.missionReport.create).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledWith(missionReportDTO.id, {
				...msParam,
				explosiveObjectActionIds: explosiveObjectActions.map(el => el.id)
			});
		});
	});

	describe('get function', () => {
		const DB = jest.mocked<any>(DBMock);

		beforeEach(() => {
	  jest.clearAllMocks();
		
	  DB.missionReport.get.mockResolvedValueOnce(missionReportDB);
	  DB.order.get.mockResolvedValueOnce(orderDB);
	  DB.missionRequest.get.mockResolvedValueOnce(missionRequestDB);
	  DB.mapViewAction.get.mockResolvedValueOnce(mapViewDB);
	  DB.employeeAction.select.mockResolvedValueOnce([approvedByActionDB, squadLeaderActionDB, ...squadActionsDB]);
	  DB.transportAction.select.mockResolvedValueOnce(transportActionsDB);
	  DB.equipmentAction.select.mockResolvedValueOnce(equipmentActionsDB);
	  DB.order.select.mockResolvedValueOnce(missionReportDB);
	  DB.explosiveObjectAction.select.mockResolvedValueOnce(explosiveObjectActionsDB);
	  DB.employeeAction.get.mockResolvedValueOnce(orderSignedByActionDB);
		});

		test('successfully get report with all related actions', async () => {
			const res = await get(missionReportDB.id);
			expect(res).toStrictEqual(missionReportDTO);
		});
	});

	describe('update function', () => {
		const DB = jest.mocked<any>(DBMock);
		const msParam = omitted(missionReportDB)

		beforeEach(() => {
			jest.clearAllMocks();
				
			DB.employee.select.mockResolvedValueOnce([
				missionReportDTO.approvedByAction,
				missionReportDTO.squadLeaderAction,
				...missionReportDTO.squadActions,
			].map(el => ({ ...el, id: el.employeeId })));
			DB.transport.select.mockResolvedValueOnce(missionReportDTO.transportActions.map(el => ({ ...el, id: el.transportId })));
			DB.equipment.select.mockResolvedValueOnce(missionReportDTO.equipmentActions.map(el => ({ ...el, id: el.equipmentId })));
			DB.explosiveObject.select.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions.map(el => ({ ...el, id: el.explosiveObjectId })));
			DB.explosiveObjectAction.update.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions[0]);
			DB.explosiveObjectAction.create.mockResolvedValueOnce(missionReportDTO.explosiveObjectActions[0]);
		});

		test('successfully update a mission report with all related actions', async () => {
			await update(missionReportInput, missionReportDTO);
	
			expect(DBMock.missionReport.update).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledWith(missionReportDTO.id, msParam);
		});

		test('successfully updates a new mission report if two explosiveObjectActions with the same exposive objects', async () => {
			const explosiveObjectActions =  [
				explosiveObjectActionsUpdateInput,
				explosiveObjectActionsInput
			]

			const input = {
				...missionReportInput,
				explosiveObjectActions
			}

			await update(input, missionReportDTO);
	
			expect(DBMock.explosiveObjectAction.create).toHaveBeenCalledTimes(1);
			expect(DBMock.explosiveObjectAction.update).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledTimes(1);
			expect(DBMock.missionReport.update).toHaveBeenCalledWith(missionReportDTO.id, {
				...msParam,
				explosiveObjectActionIds: [
					explosiveObjectActionsUpdateInput.id,
					missionReportDTO.explosiveObjectActions[0].id
				]
			});
		});
	});
})
