const statusOptions = [
  // Note: limited set of status values because only some make sense when creating a suggestion
  { value: 'draft', label: 'draft' },
  { value: 'active', label: 'active' },
  { value: 'unknown', label: 'unknown' }
];

const intentOptions = [
  { value: 'proposal', label: 'proposal' },
  { value: 'plan', label: 'plan' },
  { value: 'directive', label: 'directive' },
  { value: 'order', label: 'order' },
  { value: 'original-order', label: 'original-order' },
  { value: 'reflex-order', label: 'reflex-order' },
  { value: 'filler-order', label: 'filler-order' },
  { value: 'instance-order', label: 'instance-order' },
  { value: 'option', label: 'option' }
];

const priorityOptions = [
  { value: 'routine', label: 'routine' },
  { value: 'urgent', label: 'urgent' },
  { value: 'asap', label: 'asap' },
  { value: 'stat', label: 'stat' }
];

const medicationRequest = {
  name: 'MedicationRequest',
  elements: [
    {
      name: 'medicationCodeableConcept',
      label: 'Medication Codeable Concept',
      required: true, // 1..1
      type: 'codeableConcept'
    },
    {
      name: 'status',
      label: 'Status',
      options: statusOptions,
      required: true, // 1..1
      type: 'code'
    },
    {
      name: 'intent',
      label: 'Intent',
      options: intentOptions.filter(i => i.value !== 'directive'),
      required: true, // 1..1
      type: 'code'
    },
    {
      name: 'priority',
      label: 'Priority',
      options: priorityOptions,
      required: false, // 0..1
      type: 'code'
    },
    {
      name: 'reasonCode',
      label: 'Reason Code',
      required: false, // 0..*
      type: 'codeableConcept'
    },
    {
      name: 'category',
      label: 'Category',
      required: false, // 0..*
      type: 'codeableConcept'
    }
  ]
};

const serviceRequest = {
  name: 'ServiceRequest',
  elements: [
    {
      name: 'code',
      label: 'Code',
      required: true, // 1..1
      type: 'codeableConcept'
    },
    {
      name: 'status',
      label: 'Status',
      options: statusOptions,
      required: true, // 1..1
      type: 'code'
    },
    {
      name: 'intent',
      label: 'Intent',
      options: intentOptions,
      required: true, // 1..1
      type: 'code'
    },
    {
      name: 'priority',
      label: 'Priority',
      options: priorityOptions,
      required: false, // 0..1
      type: 'code'
    },
    {
      name: 'reasonCode',
      label: 'Reason Code',
      required: false, // 0..*
      type: 'codeableConcept'
    },
    {
      name: 'category',
      label: 'Category',
      required: false, // 0..*
      type: 'codeableConcept'
    }
  ]
};

const codeableConcept = {
  text: '', // CodeableConcept text
  code: '',
  display: '',
  system: '',
  uri: ''
};

const code = '';

const allRequests = { MedicationRequest: medicationRequest, ServiceRequest: serviceRequest };
const typesInitialValues = { codeableConcept, code };

export { allRequests, typesInitialValues };
