const elementOptions = [
  {
    value: 'allergy_intolerance',
    label: 'Allergy Intolerance',
    vsacAuthRequired: true,
    templateId: 'GenericAllergyIntolerance_vsac'
  },
  { value: 'baseElement', label: 'Base Elements', vsacAuthRequired: false },
  { value: 'condition', label: 'Condition', vsacAuthRequired: true, templateId: 'GenericCondition_vsac' },
  { value: 'demographics', label: 'Demographics', vsacAuthRequired: false },
  { value: 'device', label: 'Device', vsacAuthRequired: true, templateId: 'GenericDevice_vsac' },
  { value: 'encounter', label: 'Encounter', vsacAuthRequired: true, templateId: 'GenericEncounter_vsac' },
  { value: 'externalCqlElement', label: 'External CQL', vsacAuthRequired: false },
  { value: 'immunization', label: 'Immunization', vsacAuthRequired: true, templateId: 'GenericImmunization_vsac' },
  { value: 'listOperations', label: 'List Operations', vsacAuthRequired: false },
  {
    value: 'medicationStatement',
    label: 'Medication Statement',
    vsacAuthRequired: true,
    templateId: 'GenericMedicationStatement_vsac'
  },
  {
    value: 'medicationRequest',
    label: 'Medication Request',
    vsacAuthRequired: true,
    templateId: 'GenericMedicationRequest_vsac'
  },
  { value: 'observation', label: 'Observation', vsacAuthRequired: true, templateId: 'GenericObservation_vsac' },
  { value: 'booleanParameter', label: 'Parameters', vsacAuthRequired: false },
  { value: 'procedure', label: 'Procedure', vsacAuthRequired: true, templateId: 'GenericProcedure_vsac' }
];

export default elementOptions;
