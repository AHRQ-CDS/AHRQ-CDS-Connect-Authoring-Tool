import {
  calculateNewReturnType,
  calculateReturnTypeAfterElementRemoved,
  calculateReturnTypeWithNewModifiers,
  checkReturnTypeCompatibilityBooleanList,
  checkReturnTypeCompatibilitySetList,
  promoteReturnTypeToList
} from 'utils/lists';
import { createTemplateInstance } from 'utils/test_helpers';
import {
  emptyInstanceTree,
  genericBaseElementListAndInstance,
  genericBaseElementListInstance,
  genericBaseElementUseInstance,
  genericElementGroups,
  genericInstance
} from 'utils/test_fixtures';

describe('list utils', () => {
  describe('#promoteReturnTypeToList', () => {
    it('should promote singular type to plural', () => {
      expect(promoteReturnTypeToList('observation')).toEqual('list_of_observations');
      expect(promoteReturnTypeToList('system_quantity')).toEqual('list_of_system_quantities');
      expect(promoteReturnTypeToList('boolean')).toEqual('list_of_booleans');
    });

    it('should not promote list types to plural', () => {
      expect(promoteReturnTypeToList('list_of_observations')).toEqual('list_of_observations');
      expect(promoteReturnTypeToList('list_of_system_quantities')).toEqual('list_of_system_quantities');
      expect(promoteReturnTypeToList('list_of_booleans')).toEqual('list_of_booleans');
      expect(promoteReturnTypeToList('list_of_datetimes')).toEqual('list_of_datetimes');
      expect(promoteReturnTypeToList('list_of_any')).toEqual('list_of_any');
    });
  });

  describe('#checkReturnTypeCompatibilitySetList', () => {
    it('should calculate return types of Union and Intersect lists', () => {
      const observations = checkReturnTypeCompatibilitySetList('list_of_observations', 'observation');
      expect(observations).toEqual('list_of_observations');

      const conditions = checkReturnTypeCompatibilitySetList('list_of_conditions', 'condition');
      expect(conditions).toEqual('list_of_conditions');

      const obsAndCond = checkReturnTypeCompatibilitySetList('list_of_observations', 'list_of_conditions');
      expect(obsAndCond).toEqual('list_of_any');

      const anyAndObs = checkReturnTypeCompatibilitySetList('list_of_any', 'list_of_observations');
      expect(anyAndObs).toEqual('list_of_any');

      const boolean = checkReturnTypeCompatibilitySetList('list_of_booleans', 'boolean');
      expect(boolean).toEqual('list_of_booleans');
    });
  });

  describe('#checkReturnTypeCompatibilityBooleanList', () => {
    it('should calculate return types of And and Or lists', () => {
      const boolAndBool = checkReturnTypeCompatibilityBooleanList('boolean', 'boolean');
      expect(boolAndBool).toEqual('boolean');

      const observations = checkReturnTypeCompatibilityBooleanList('list_of_observations', 'observation');
      expect(observations).toEqual('invalid');

      const conditions = checkReturnTypeCompatibilityBooleanList('list_of_conditions', 'list_of_conditions');
      expect(conditions).toEqual('invalid');

      const conditionsAndBool = checkReturnTypeCompatibilityBooleanList('list_of_conditions', 'boolean');
      expect(conditionsAndBool).toEqual('invalid');

      const boolAndNone = checkReturnTypeCompatibilityBooleanList('boolean', 'none');
      expect(boolAndNone).toEqual('boolean');

      const noneAndBool = checkReturnTypeCompatibilityBooleanList('none', 'boolean');
      expect(noneAndBool).toEqual('boolean');

      const boolAndInvalid = checkReturnTypeCompatibilityBooleanList('boolean', 'invalid');
      expect(boolAndInvalid).toEqual('invalid');
    });

    describe('#calculateNewReturnType', () => {
      describe('union and intersect', () => {
        it('should return the same return type if a list is added to an empty group', () => {
          const emptyUnion = createTemplateInstance(genericBaseElementListInstance);
          emptyUnion.childInstances = [];
          emptyUnion.returnType = 'list_of_any';
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const newReturnType = calculateNewReturnType(emptyUnion, listOfObsElement);
          expect(newReturnType).toEqual('list_of_observations');
        });

        it('should return a promoted list if a non-list is added to an empty group', () => {
          const emptyUnion = createTemplateInstance(genericBaseElementListInstance);
          emptyUnion.childInstances = [];
          emptyUnion.returnType = 'list_of_any';
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const newReturnType = calculateNewReturnType(emptyUnion, booleanElement);
          expect(newReturnType).toEqual('list_of_booleans');
        });

        it('should return a list of a specific type if all elements are the same list type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const listOfObsElement1 = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          unionWithObs.childInstances = [listOfObsElement1];
          unionWithObs.returnType = 'list_of_observations';
          const listOfObsElement2 = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const newReturnType = calculateNewReturnType(unionWithObs, listOfObsElement2);
          expect(newReturnType).toEqual('list_of_observations');
        });

        it('should return a list of a specific type if all elements are the same single type', () => {
          const unionWithBool = createTemplateInstance(genericBaseElementListInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement1 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          unionWithBool.returnType = 'list_of_booleans';
          unionWithBool.childInstances = [booleanElement1];
          const booleanElement2 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const newReturnType = calculateNewReturnType(unionWithBool, booleanElement2);
          expect(newReturnType).toEqual('list_of_booleans');
        });

        it('should return a list of a any if all elements are different list type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          unionWithObs.childInstances = [listOfObsElement];
          unionWithObs.returnType = 'list_of_observations';
          const listOfCondElement = createTemplateInstance(genericInstance);
          listOfCondElement.returnType = 'list_of_conditions'; // swap return type for test
          const newReturnType = calculateNewReturnType(unionWithObs, listOfCondElement);
          expect(newReturnType).toEqual('list_of_any');
        });

        it('should return a list of a any if all elements are different single type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const systemQuantityElement = createTemplateInstance(genericInstance); // returnType = 'system_quantity'
          systemQuantityElement.modifiers = [
            {
              id: 'FirstObservation',
              name: 'First',
              inputTypes: ['list_of_observations'],
              returnType: 'observation',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'C3F.FirstObservation'
            },
            {
              id: 'QuantityValue',
              name: 'Quantity Value',
              inputTypes: ['observation'],
              returnType: 'system_quantity',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'C3F.QuantityValue'
            }
          ];
          unionWithObs.childInstances = [systemQuantityElement];
          unionWithObs.returnType = 'list_of_system_quantities';
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const newReturnType = calculateNewReturnType(unionWithObs, listOfObsElement);
          expect(newReturnType).toEqual('list_of_any');
        });
      });

      describe('and and or', () => {
        it('should return the same return type if a list is added to an empty group', () => {
          const emptyAnd = createTemplateInstance(genericBaseElementListAndInstance);
          emptyAnd.childInstances = [];
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const listOfObs = calculateNewReturnType(emptyAnd, listOfObsElement);
          expect(listOfObs).toEqual('list_of_observations');
        });

        it('should return the same return type if a non-list is added to an empty group', () => {
          const emptyAnd = createTemplateInstance(genericBaseElementListAndInstance);
          emptyAnd.childInstances = [];
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const listOfBools = calculateNewReturnType(emptyAnd, booleanElement);
          expect(listOfBools).toEqual('boolean');
        });

        it('should return an invalid type if all elements are the same list type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const listOfObsElement1 = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          andWithObs.childInstances = [listOfObsElement1];
          andWithObs.returnType = 'list_of_observations';
          const listOfObsElement2 = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const newReturnType = calculateNewReturnType(andWithObs, listOfObsElement2);
          expect(newReturnType).toEqual('invalid');
        });

        it('should return an invalid type if all elements are the same single type (not boolean)', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const obsElement1 = createTemplateInstance(genericBaseElementUseInstance);
          obsElement1.returnType = 'observation';
          andWithObs.childInstances = [obsElement1];
          andWithObs.returnType = 'observation';
          const obsElement2 = createTemplateInstance(genericBaseElementUseInstance);
          obsElement2.returnType = 'observation';
          const newReturnType = calculateNewReturnType(andWithObs, obsElement2);
          expect(newReturnType).toEqual('invalid');
        });

        it('should return a boolean type if all elements are booleans', () => {
          const andWithBool = createTemplateInstance(genericBaseElementListAndInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement1 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithBool.returnType = 'boolean';
          andWithBool.childInstances = [booleanElement1];
          const booleanElement2 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const newReturnType = calculateNewReturnType(andWithBool, booleanElement2);
          expect(newReturnType).toEqual('boolean');
        });

        it('should return an invalid type if all elements are different list type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          andWithObs.childInstances = [listOfObsElement];
          andWithObs.returnType = 'list_of_observations';
          const listOfCondElement = createTemplateInstance(genericInstance);
          listOfCondElement.returnType = 'list_of_conditions'; // swap return type for test
          const newReturnType = calculateNewReturnType(andWithObs, listOfCondElement);
          expect(newReturnType).toEqual('invalid');
        });

        it('should return an invalid type if all elements are different single type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const obsElement = createTemplateInstance(genericBaseElementUseInstance);
          obsElement.returnType = 'observation';
          andWithObs.childInstances = [obsElement];
          andWithObs.returnType = 'observation';
          const condElement = createTemplateInstance(genericBaseElementUseInstance);
          condElement.returnType = 'condition'; // change return type for test
          const newReturnType = calculateNewReturnType(andWithObs, condElement);
          expect(newReturnType).toEqual('invalid');
        });

        it('should return boolean return type when a boolean is added to a nested list', () => {
          const andWithNested = createTemplateInstance(genericBaseElementListAndInstance);
          const nestedAnd = createTemplateInstance(emptyInstanceTree);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement1 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          nestedAnd.childInstances = [booleanElement1];
          andWithNested.childInstances = [nestedAnd];
          andWithNested.returnType = 'boolean';
          const booleanElement2 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const newReturnType = calculateNewReturnType(andWithNested, booleanElement2);
          expect(newReturnType).toEqual('boolean');
        });

        it('should return invalid return type when a boolean is added to a nested list', () => {
          const andWithNested = createTemplateInstance(genericBaseElementListAndInstance);
          const nestedAnd = createTemplateInstance(emptyInstanceTree);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          nestedAnd.childInstances = [booleanElement];
          andWithNested.childInstances = [nestedAnd];
          andWithNested.returnType = 'boolean';
          const listOfObsElement = createTemplateInstance(genericInstance); // returnType = 'list_of_observations'
          const newReturnType = calculateNewReturnType(andWithNested, listOfObsElement);
          expect(newReturnType).toEqual('invalid');
        });
      });
    });

    describe('#calculateReturnTypeAfterElementRemoved', () => {
      describe('union and intersect', () => {
        it('should calculate return type when removing an element that does not change the return type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation1 = createTemplateInstance(genericInstance);
          const observation2 = createTemplateInstance(genericInstance);
          unionWithObs.childInstances = [observation1, observation2];
          unionWithObs.returnType = 'list_of_observations';
          const newReturnType = calculateReturnTypeAfterElementRemoved(unionWithObs, '.childInstances.0');
          expect(newReturnType).toEqual('list_of_observations');
        });

        it('should calculate return type when removing an element that does change the return type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation = createTemplateInstance(genericInstance);
          const condition = createTemplateInstance(genericInstance);
          condition.returnType = 'list_of_conditions'; // swap return type for test
          unionWithObs.childInstances = [observation, condition];
          unionWithObs.returnType = 'list_of_observations';
          const newReturnTypeRemove0 = calculateReturnTypeAfterElementRemoved(unionWithObs, '.childInstances.0');
          expect(newReturnTypeRemove0).toEqual('list_of_conditions');
          const newReturnTypeRemove1 = calculateReturnTypeAfterElementRemoved(unionWithObs, '.childInstances.1');
          expect(newReturnTypeRemove1).toEqual('list_of_observations');
        });
      });

      describe('and and or', () => {
        it('should calculate return type when removing an element that does not change the return type', () => {
          const andWithBooleans = createTemplateInstance(genericBaseElementListAndInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement1 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const booleanElement2 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithBooleans.childInstances = [booleanElement1, booleanElement2];
          const newReturnType = calculateReturnTypeAfterElementRemoved(andWithBooleans, '.childInstances.0');
          expect(newReturnType).toEqual('boolean');
        });

        it('should calculate return type when removing an element that does change the return type', () => {
          const andWithBooleans = createTemplateInstance(genericBaseElementListAndInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement1 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const booleanElement2 = createTemplateInstance(genderEntry); // returnType = 'boolean'
          const observation = createTemplateInstance(genericInstance); // returnType = 'list_of_observations
          andWithBooleans.childInstances = [booleanElement1, booleanElement2, observation];
          const newReturnTypeRemove0 = calculateReturnTypeAfterElementRemoved(andWithBooleans, '.childInstances.0');
          expect(newReturnTypeRemove0).toEqual('invalid');
          const newReturnTypeRemove2 = calculateReturnTypeAfterElementRemoved(andWithBooleans, '.childInstances.2');
          expect(newReturnTypeRemove2).toEqual('boolean');
        });

        it('should return boolean return type when removing an element from a boolean list with new boolean elements to add (indent)', () => {
          const andWithBooleans = createTemplateInstance(genericBaseElementListAndInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithBooleans.childInstances = [booleanElement];
          const nestedAnd = createTemplateInstance(emptyInstanceTree);
          nestedAnd.childInstances = [booleanElement];
          const newReturnType = calculateReturnTypeAfterElementRemoved(andWithBooleans, '.childInstances.0', [
            { instance: nestedAnd, path: '', index: 0 }
          ]);
          expect(newReturnType).toEqual('boolean');
        });
      });
    });

    describe('#calculateReturnTypeWithNewModifiers', () => {
      describe('union and intersect', () => {
        it('should calculate return type when adding a modifier that does not change the type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation = createTemplateInstance(genericInstance);
          unionWithObs.childInstances = [observation];
          unionWithObs.returnType = 'list_of_observations';
          const listObsModifier = [
            {
              id: 'VerifiedObservation',
              name: 'Verified',
              inputTypes: ['list_of_observations'],
              returnType: 'list_of_observations',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'C3F.Verified'
            }
          ];
          const newReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, listObsModifier, '.childInstances.0');
          expect(newReturnType).toEqual('list_of_observations');
        });

        it('should calculate updated return type when adding a modifier does change the type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation = createTemplateInstance(genericInstance);
          unionWithObs.childInstances = [observation];
          unionWithObs.returnType = 'list_of_observations';
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          const newReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, booleanModifier, '.childInstances.0');
          expect(newReturnType).toEqual('list_of_booleans');
        });

        it('should calculate updated return type when adding a modifier creates an any type', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation1 = createTemplateInstance(genericInstance);
          const observation2 = createTemplateInstance(genericInstance);
          unionWithObs.childInstances = [observation1, observation2];
          unionWithObs.returnType = 'list_of_observations';
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          const oldReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, [], '.childInstances.0');
          expect(oldReturnType).toEqual('list_of_observations');
          const newReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, booleanModifier, '.childInstances.0');
          expect(newReturnType).toEqual('list_of_any');
        });

        it('should calculate return type when removing a modifier', () => {
          const unionWithObs = createTemplateInstance(genericBaseElementListInstance);
          const observation = createTemplateInstance(genericInstance);
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          observation.modifiers = booleanModifier;
          unionWithObs.childInstances = [observation];
          unionWithObs.returnType = 'list_of_observations';
          const oldReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, booleanModifier, '.childInstances.0');
          expect(oldReturnType).toEqual('list_of_booleans');
          const newReturnType = calculateReturnTypeWithNewModifiers(unionWithObs, [], '.childInstances.0'); // empty array removes modifier
          expect(newReturnType).toEqual('list_of_observations');
        });
      });

      describe('and and or', () => {
        it('should calculate return type when adding a modifier that does not change the type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const observation = createTemplateInstance(genericInstance);
          andWithObs.childInstances = [observation];
          andWithObs.returnType = 'list_of_observations';
          const listObsModifier = [
            {
              id: 'VerifiedObservation',
              name: 'Verified',
              inputTypes: ['list_of_observations'],
              returnType: 'list_of_observations',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'C3F.Verified'
            }
          ];
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithObs, listObsModifier, '.childInstances.0');
          expect(newReturnType).toEqual('list_of_observations');
        });

        it('should calculate updated return type when adding a modifier does change the type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const observation = createTemplateInstance(genericInstance);
          andWithObs.childInstances = [observation];
          andWithObs.returnType = 'list_of_observations';
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithObs, booleanModifier, '.childInstances.0');
          expect(newReturnType).toEqual('boolean');
        });

        it('should calculate updated return type when adding a modifier resolves an invalid type', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const observation = createTemplateInstance(genericInstance);
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithObs.childInstances = [observation, booleanElement];
          andWithObs.returnType = 'invalid';
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          const oldReturnType = calculateReturnTypeWithNewModifiers(andWithObs, [], '.childInstances.0');
          expect(oldReturnType).toEqual('invalid');
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithObs, booleanModifier, '.childInstances.0');
          expect(newReturnType).toEqual('boolean');
        });

        it('should calculate return type when removing a modifier', () => {
          const andWithObs = createTemplateInstance(genericBaseElementListAndInstance);
          const observation = createTemplateInstance(genericInstance);
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          observation.modifiers = booleanModifier;
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithObs.childInstances = [observation, booleanElement];
          andWithObs.returnType = 'boolean';
          const oldReturnType = calculateReturnTypeWithNewModifiers(andWithObs, booleanModifier, '.childInstances.0');
          expect(oldReturnType).toEqual('boolean');
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithObs, [], '.childInstances.0'); // empty array removes modifier
          expect(newReturnType).toEqual('invalid');
        });

        it('should calculate updated return type when adding a modifier to a nested child', () => {
          const andWithNested = createTemplateInstance(genericBaseElementListAndInstance);
          const nestedAnd = createTemplateInstance(emptyInstanceTree);
          const observation = createTemplateInstance(genericInstance);
          nestedAnd.childInstances = [observation];
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithNested.childInstances = [nestedAnd, booleanElement];
          andWithNested.returnType = 'boolean';
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          const path = '.childInstances.0.childInstances.0';
          const oldReturnType = calculateReturnTypeWithNewModifiers(andWithNested, [], path);
          expect(oldReturnType).toEqual('invalid');
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithNested, booleanModifier, path);
          expect(newReturnType).toEqual('boolean');
        });

        it('should calculate updated return type when removing a modifier to a nested child', () => {
          const andWithNested = createTemplateInstance(genericBaseElementListAndInstance);
          const nestedAnd = createTemplateInstance(emptyInstanceTree);
          const observation = createTemplateInstance(genericInstance);
          const booleanModifier = [
            {
              id: 'BooleanExists',
              name: 'Exists',
              inputTypes: ['list_of_observations'], // shortened for simplicity in test
              returnType: 'boolean',
              cqlTemplate: 'BaseModifier',
              cqlLibraryFunction: 'exists'
            }
          ];
          observation.modifiers = booleanModifier;
          nestedAnd.childInstances = [observation];
          const genderEntry = genericElementGroups[0].entries[1];
          const booleanElement = createTemplateInstance(genderEntry); // returnType = 'boolean'
          andWithNested.childInstances = [nestedAnd, booleanElement];
          andWithNested.returnType = 'boolean';
          const path = '.childInstances.0.childInstances.0';
          const oldReturnType = calculateReturnTypeWithNewModifiers(andWithNested, booleanModifier, path);
          expect(oldReturnType).toEqual('boolean');
          const newReturnType = calculateReturnTypeWithNewModifiers(andWithNested, [], path); // empty array removes modifier
          expect(newReturnType).toEqual('invalid');
        });
      });
    });
  });
});
