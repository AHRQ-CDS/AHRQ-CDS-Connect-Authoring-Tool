import _ from 'lodash';
import { autoDetectFHIRVersion } from '../patients';
import {
  basePatient,
  dstu2Patient,
  dstu2MedicationOrderPatient,
  r4ServiceRequestPatient
} from 'mocks/patients/simple-bundles';

describe('patient utils', () => {
  describe('autoDetectFHIRVersion', () => {
    it('should detect DSTU2 if patient last name is an array', () => {
      const patient = _.cloneDeep(dstu2Patient);
      const version = autoDetectFHIRVersion({ patient });
      expect(version).toEqual(['DSTU2']);
    });

    it("should detect DSTU2 if a MedicationOrder resource is present (and last name can't be used to make a decision", () => {
      const patient = _.cloneDeep(dstu2MedicationOrderPatient); // no last name on this patient
      const version = autoDetectFHIRVersion({ patient });
      expect(version).toEqual(['DSTU2']);
    });

    it('should detect R4 if a ServiceRequest resource is present', () => {
      const patient = _.cloneDeep(r4ServiceRequestPatient);
      const version = autoDetectFHIRVersion({ patient });
      expect(version).toEqual(['R4']);
    });

    it('should detect R4 or STU3 or DSTU2 if no identifying feature present and no name present', () => {
      const patient = _.cloneDeep(basePatient);
      delete patient.entry[0].resource.name;
      const version = autoDetectFHIRVersion({ patient });
      expect(version).toEqual(['R4', 'STU3', 'DSTU2']);
    });

    describe('Conditions', () => {
      const baseCondition = {
        resourceType: 'Condition',
        id: 'example-condition',
        subject: {
          reference: 'Patient/example-patient'
        },
        code: {
          coding: [
            {
              system: 'http://example.org',
              code: 'example-condition',
              display: 'example condition'
            }
          ]
        }
      };

      it('should detect STU3 if Condition.assertedDate is present', () => {
        const patient = _.cloneDeep(basePatient);
        const condition = {
          ...baseCondition,
          assertedDate: '2024-04-01'
        };
        patient.entry.push({ resource: { ...baseCondition } }); // first condition isn't necessarily STU3
        patient.entry.push({ resource: condition }); // second condition indicates STU3
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Condition.assertedDate is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const condition = {
          ...baseCondition,
          assertedDate: '2024-04-01'
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Condition.context is present', () => {
        const patient = _.cloneDeep(basePatient);
        const condition = {
          ...baseCondition,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Condition.context is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const condition = {
          ...baseCondition,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect R4 if Condition.recordedDate is present', () => {
        const patient = _.cloneDeep(basePatient);
        const condition = {
          ...baseCondition,
          recordedDate: '2024-04-01'
        };
        patient.entry.push({ resource: { ...baseCondition } }); // first condition isn't necessarily R4
        patient.entry.push({ resource: condition }); // second condition indicates R4
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Condition.recordedDate is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const condition = {
          ...baseCondition,
          recordedDate: '2024-04-01'
        };
        patient.entry.push({ resource: { ...baseCondition } }); // first condition isn't necessarily R4
        patient.entry.push({ resource: condition }); // second condition indicates R4
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Condition.encounter is present', () => {
        const patient = _.cloneDeep(basePatient);
        const condition = {
          ...baseCondition,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or DSTU2 if Condition.encounter is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const condition = {
          ...baseCondition,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'DSTU2']);
      });

      it('should detect R4 if Condition.recorder is present', () => {
        const patient = _.cloneDeep(basePatient);
        const condition = {
          ...baseCondition,
          recorder: { reference: 'Practitioner/example-practitioner' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Condition.recorder is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const condition = {
          ...baseCondition,
          recorder: { reference: 'Practitioner/example-practitioner' }
        };
        patient.entry.push({ resource: condition });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if Condition does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        patient.entry.push({ resource: { ...baseCondition } });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });

    describe('Encounters', () => {
      const baseEncounter = {
        resourceType: 'Encounter',
        id: 'example-encounter',
        status: 'in-progress',
        subject: {
          reference: 'Patient/example-patient'
        },
        class: {
          system: 'http://hl7.org/fhir/v3/ActCode',
          code: 'IMP',
          display: 'inpatient encounter'
        }
      };

      it('should detect STU3 if Encounter.incomingReferral is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          incomingReferral: { reference: 'ReferralRequest/example-referral-request' }
        };
        patient.entry.push({ resource: { ...baseEncounter } }); // first encounter isn't necessarily STU3
        patient.entry.push({ resource: encounter }); // second encounter indicates STU3
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 or DSTU2 if Encounter.incomingReferral is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          incomingReferral: { reference: 'ReferralRequest/example-referral-request' }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3', 'DSTU2']);
      });

      it('should detect STU3 if Encounter.reason is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          reason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 or DSTU2 if Encounter.reason is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          reason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3', 'DSTU2']);
      });

      it('should detect R4 if Encounter.basedOn is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          basedOn: { reference: 'ServiceRequest/example-service-request' }
        };
        patient.entry.push({ resource: { ...baseEncounter } }); // first encounter isn't necessarily R4
        patient.entry.push({ resource: encounter }); // second encounter indicates R4
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.basedOn is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          basedOn: { reference: 'ServiceRequest/example-service-request' }
        };
        patient.entry.push({ resource: { ...baseEncounter } }); // first encounter isn't necessarily R4
        patient.entry.push({ resource: encounter }); // second encounter indicates R4
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.serviceType is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          serviceType: { coding: [{ code: 'example-service', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.serviceType is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          serviceType: { coding: [{ code: 'example-service', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.reasonCode is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          reasonCode: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.reasonCode is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          reasonCode: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.reasonReference is present', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter,
          reasonReference: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Encounter.reasonReference is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const encounter = {
          ...baseEncounter,
          reasonReference: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if Encounter does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        const encounter = {
          ...baseEncounter
        };
        patient.entry.push({ resource: encounter });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });

    describe('MedicationRequests', () => {
      const baseMedicationRequest = {
        resourceType: 'MedicationRequest',
        id: 'example-medication-request',
        status: 'active',
        intent: 'order',
        medicationReference: {
          reference: 'Medication/example-medication'
        },
        subject: {
          reference: 'Patient/example-patient'
        }
      };

      it('should detect STU3 when MedicationRequest.definition is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          definition: { reference: 'PlanDefinition/example-plan-definition' }
        };
        patient.entry.push({ resource: { ...baseMedicationRequest } });
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 when MedicationRequest.definition is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          definition: { reference: 'PlanDefinition/example-plan-definition' }
        };
        patient.entry.push({ resource: { ...baseMedicationRequest } });
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 when MedicationRequest.context is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 when MedicationRequest.context is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect R4 if MedicationRequest.statusReason is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          statusReason: { coding: [{ code: 'example-status-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: { ...baseMedicationRequest } });
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.statusReason is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          statusReason: { coding: [{ code: 'example-status-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: { ...baseMedicationRequest } });
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.encounter is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.encounter is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.performer is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          performer: { reference: 'Practitioner/example-practitioner' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.performer is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          performer: { reference: 'Practitioner/example-practitioner' }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.performerType is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest,
          performerType: { coding: [{ code: 'example-performer-type', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationRequest.performerType is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationRequest = {
          ...baseMedicationRequest,
          performerType: { coding: [{ code: 'example-performer-type', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if MedicationRequest does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationRequest = {
          ...baseMedicationRequest
        };
        patient.entry.push({ resource: medicationRequest });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });

      it('should detect R4 or STU3 when any MedicationRequest is present even if no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        patient.entry.push({ resource: { ...baseMedicationRequest } });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });

    describe('MedicationStatements', () => {
      const baseMedicationStatement = {
        resourceType: 'MedicationStatement',
        id: 'example-medication-statement',
        status: 'active',
        medicationReference: {
          reference: 'Medication/example-medication'
        },
        subject: {
          reference: 'Patient/example-patient'
        }
      };

      it('should detect STU3 if MedicationStatement.taken is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationStatement = {
          ...baseMedicationStatement,
          taken: 'y'
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if MedicationStatement.taken is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationStatement = {
          ...baseMedicationStatement,
          taken: 'y'
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if MedicationStatement.reasonNotTaken is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationStatement = {
          ...baseMedicationStatement,
          reasonNotTaken: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 or DSTU2 if MedicationStatement.reasonNotTaken is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationStatement = {
          ...baseMedicationStatement,
          reasonNotTaken: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3', 'DSTU2']);
      });

      it('should detect R4 if MedicationStatement.statusReason is present', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationStatement = {
          ...baseMedicationStatement,
          statusReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if MedicationStatement.statusReason is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const medicationStatement = {
          ...baseMedicationStatement,
          statusReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if MedicationStatement does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        const medicationStatement = {
          ...baseMedicationStatement
        };
        patient.entry.push({ resource: medicationStatement });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });

    describe('Observations', () => {
      const baseObservation = {
        resourceType: 'Observation',
        id: 'example-observation',
        status: 'final',
        code: {
          coding: [
            {
              code: 'example-observation',
              system: 'http://example.com',
              display: 'example observation'
            }
          ]
        },
        subject: {
          reference: 'Patient/example-patient'
        }
      };

      it('should detect STU3 if Observation.context is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Observation.context is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Observation.comment is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          comment: 'example comment'
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Observation.comment is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          comment: 'example comment'
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Observation.related is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          related: { target: { reference: 'Observation/example-observation' } }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 or DSTU2 if Observation.related is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          related: { target: { reference: 'Observation/example-observation' } }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3', 'DSTU2']);
      });

      it('should detect R4 if Observation.encounter is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or DSTU2 if Observation.encounter is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'DSTU2']);
      });

      it('should detect R4 if Observation.note is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          note: 'example note'
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.note is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          note: 'example note'
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.partOf is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          partOf: { reference: 'Procedure/example-procedure' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.partOf is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          partOf: { reference: 'Procedure/example-procedure' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.focus is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          focus: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.focus is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          focus: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.hasMember is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          hasMember: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.hasMember is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          hasMember: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.derivedFrom is present', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation,
          derivedFrom: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Observation.derivedFrom is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const observation = {
          ...baseObservation,
          derivedFrom: { reference: 'Observation/example-observation' }
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if Observation does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        const observation = {
          ...baseObservation
        };
        patient.entry.push({ resource: observation });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });

    describe('Procedures', () => {
      const baseProcedure = {
        resourceType: 'Procedure',
        id: 'example-procedure',
        status: 'in-progress',
        subject: {
          reference: 'Patient/example-patient'
        },
        code: {
          coding: [
            {
              code: 'example-procedure',
              system: 'http://example.com',
              display: 'example procedure'
            }
          ]
        }
      };

      it('should detect STU3 if Procedure.definition is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          definition: { reference: 'PlanDefinition/example-plan-definition' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.definition is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          definition: { reference: 'PlanDefinition/example-plan-definition' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.notDone is present (false)', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          notDone: false // note: this is a boolean so be sure the logic works with both values
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.notDone is present (true)', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          notDone: true // note: this is a boolean so be sure the logic works with both values
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.notDone is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          notDone: false // note: this is a boolean so be sure the logic works with both values
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.notDoneReason is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          notDoneReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.notDoneReason is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          notDoneReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.context is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect STU3 if Procedure.context is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          context: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['STU3']);
      });

      it('should detect R4 if Procedure.statusReason is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          statusReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Procedure.statusReason is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          statusReason: { coding: [{ code: 'example-reason', system: 'http://example.com' }] }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Procedure.encounter is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or DSTU2 if Procedure.encounter is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          encounter: { reference: 'Encounter/example-encounter' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'DSTU2']);
      });

      it('should detect R4 if Procedure.recorder is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          recorder: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Procedure.recorder is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          recorder: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Procedure.asserter is present', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure,
          asserter: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 if Procedure.asserter is present and no last name is present', () => {
        const patient = _.cloneDeep(basePatient);
        delete patient.entry[0].resource.name[0].family;
        const procedure = {
          ...baseProcedure,
          asserter: { reference: 'Patient/example-patient' }
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4']);
      });

      it('should detect R4 or STU3 if Procedure does not have an identifying element', () => {
        const patient = _.cloneDeep(basePatient);
        const procedure = {
          ...baseProcedure
        };
        patient.entry.push({ resource: procedure });
        const version = autoDetectFHIRVersion({ patient });
        expect(version).toEqual(['R4', 'STU3']);
      });
    });
  });
});
