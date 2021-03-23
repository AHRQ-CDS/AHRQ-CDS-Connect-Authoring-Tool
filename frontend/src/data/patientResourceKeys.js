const patientResourceKeys = {
  DSTU2: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'dateRecorded',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:substance',
      Category: 'category',
      Criticality: 'criticality',
      Onset: 'onset',
      Status: 'status'
    },
    MedicationOrder: {
      Medication: 'medication[x]',
      'Date written': 'dateWritten',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'date',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category',
      Effective: 'effective[x]',
      'First Result': 'Coding:result.firstObject',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'type',
      'First item type': 'Coding:item.firstObject.type',
      'First item service': 'Coding:item.firstObject.service',
      Use: 'use'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  },
  STU3: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type.firstObject',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'assertedDate',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Criticality: 'criticality',
      Onset: 'onset[x]',
      Status: 'clinicalStatus'
    },
    MedicationRequest: {
      Medication: 'medication[x]',
      'Date written': 'authoredOn',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category.firstObject',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'date',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category',
      Effective: 'effective[x]',
      Conclusion: 'conclusion',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'CodeableConcept:type',
      'First item service': 'CodeableConcept:item.firstObject.service',
      Use: 'use',
      Status: 'status'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  },
  R4: {
    Organization: {
      Name: 'name',
      Type: 'CodeableConcept:type.firstObject',
      'Street address': 'address.firstObject.line.firstObject',
      City: 'address.firstObject.city',
      State: 'address.firstObject.state',
      'Zip code': 'address.firstObject.postalCode',
      Contact: 'telecom.firstObject.value'
    },
    Condition: {
      Condition: 'CodeableConcept:code',
      'Date recorded': 'recordedDate',
      Onset: 'onset[x]',
      Abatement: 'abatement[x]',
      Status: 'CodeableConcept:clinicalStatus'
    },
    AllergyIntolerance: {
      Substance: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Criticality: 'criticality',
      Onset: 'onset[x]',
      Status: 'CodeableConcept:clinicalStatus'
    },
    MedicationRequest: {
      Medication: 'medication[x]',
      'Date written': 'authoredOn',
      Status: 'status'
    },
    CarePlan: {
      'First category': 'CodeableConcept:category.firstObject',
      'First activity': 'CodeableConcept:activity.firstObject.detail.code',
      'First activity status': 'activity.firstObject.detail.status'
    },
    Encounter: {
      'First Type': 'CodeableConcept:type.firstObject',
      'Start date': 'period.start',
      'End date': 'period.end',
      Status: 'status'
    },
    Observation: {
      Category: 'CodeableConcept:category.firstObject',
      Type: 'CodeableConcept:code',
      Value: 'value[x]',
      Effective: 'effective[x]',
      Issued: 'issued'
    },
    Immunization: {
      Vaccine: 'CodeableConcept:vaccineCode',
      Date: 'occurrence[x]',
      Status: 'status'
    },
    Procedure: {
      Procedure: 'CodeableConcept:code',
      Performed: 'performed[x]',
      Status: 'status'
    },
    ImagingStudy: {
      'First item': 'series.firstObject.instance.firstObject.title',
      'First item modality': 'Coding:series.firstObject.modality',
      'First item date': 'series.firstObject.started'
    },
    DiagnosticReport: {
      Type: 'CodeableConcept:code',
      Category: 'CodeableConcept:category.firstObject',
      Effective: 'effective[x]',
      Conclusion: 'conclusion',
      Status: 'status'
    },
    Claim: {
      'Claim type': 'CodeableConcept:type',
      'First item service': 'CodeableConcept:item.firstObject.productOrService',
      Use: 'use',
      Status: 'status'
    },
    Device: {
      Type: 'CodeableConcept:type',
      Status: 'status'
    }
  }
};

export default patientResourceKeys;
