import { IMissionReportDTO } from '~/api/types';
// import { DB as DBMock } from '~/db';

import { getCreateList, getRemoveList } from '../mission-report';
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
			workersIds: ['worker1', 'worker2'],
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
			workersIds: ['worker1', 'worker2'],
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
			workersIds: ['worker1', 'worker2'],
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
			workersIds: ['worker2'], // 'worker1' already exists
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
			"workersIds": workersInput.filter(employeeId => (employeeId !== "EMPLOYEE-ca8f193d-670b-4b61-b870-502b6e0d2d6f" && employeeId !== "EMPLOYEE-ebacbcc0-6eba-4915-8d3d-22f096e9842e")),
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

// describe('update function', () => {
// 	const DB = jest.mocked<any>(DBMock);

// 	it('successfully updates a mission report and its related entities', async () => {
// 	  // Setup mock return values for DB calls
// 	  DB.missionReport.get.mockResolvedValue(/* Mock existing mission report data */);
// 	  // Mock other necessary DB methods...
  
// 	  const id = 'missionReportId'; // Example mission report ID
// 	  const updateData = {/* Update values */};
  
// 	  await expect(update(id, updateData)).resolves.toMatchObject({
// 		// Expected updated mission report object
// 	  });
  
// 	  // Verify DB methods were called as expected
// 	  expect(DB.missionReport.update).toHaveBeenCalledWith(id, expect.anything());
// 	  // Add more expectations for other DB interactions
// 	});
// 	it('handles non-existent mission reports gracefully', async () => {
// 		DB.missionReport.get.mockResolvedValue(null); // Simulate non-existent report
	  
// 		const id = 'nonExistentId';
// 		const updateData = {/* Update values */};
	  
// 		await expect(update(id, updateData)).rejects.toThrow('Mission report not found');
	  
// 		// Verify no update attempt was made
// 		expect(DB.missionReport.update).not.toHaveBeenCalled();
// 	  });
// 	  it('rejects update with validation errors', async () => {
// 		const id = 'missionReportId';
// 		const invalidUpdateData = {/* Invalid update values, e.g., missing required fields */};
	  
// 		await expect(update(id, invalidUpdateData)).rejects.toThrow('Validation error');
	  
// 		// Ensure the update was not attempted due to validation failure
// 		expect(DB.missionReport.update).not.toHaveBeenCalled();
// 	  });

// 	  it('handles unexpected errors during the update process', async () => {
// 		// Simulate a DB error
// 		DB.missionReport.get.mockRejectedValue(new Error('Database error'));
	  
// 		const id = 'missionReportId';
// 		const updateData = {/* Update values */};
	  
// 		await expect(update(id, updateData)).rejects.toThrow('Database error');
	  
// 		// Depending on implementation, check if any cleanup or rollback is necessary
// 	  });
// });