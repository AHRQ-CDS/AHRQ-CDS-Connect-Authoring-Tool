import React from 'react';
import {
  AuthenticateVSACField,
  AutocompleteField,
  CodeSelectField,
  DateField,
  DateRangeField,
  GroupedFields,
  SelectConditionalField,
  SelectField,
  TextAreaField,
  TextField
} from '../fields';

import { Link } from 'components/elements';
import nuccProviderTaxonomy from '../../data/nuccProviderTaxonomyV20.0'; // http://nucc.org/
import fhirWorkflowTaskCodes from '../../data/fhirWorkflowTaskCodesV3'; // https://terminology.hl7.org/1.0.0/ValueSet-v3-ActTaskCode.html
import fhirClinicalVenueCodes from '../../data/fhirClinicalVenueCodesV3'; // https://terminology.hl7.org/1.0.0/ValueSet-v3-ServiceDeliveryLocationRoleType.html

// helper text

const versionHelperText = (
  <>
    Version should follow the Apache APR versioning scheme (e.g., 1.0.0). See{' '}
    <Link
      external
      href="http://build.fhir.org/ig/HL7/cqf-recommendations/documentation-libraries.html"
      text="FHIR Clinical Guidelines"
    />{' '}
    for more information.
  </>
);

const cpgScoreHelperText = (
  <>
    The CPG score is the percentage of optional CPG-on-FHIR fields completed on this form.{' '}
    <Link
      external
      href="http://hl7.org/fhir/uv/cpg/2019Sep/"
      text="Clinical Practice Guidelines on FHIR (CPG-on-FHIR)"
    />{' '}
    is a standards-based standardized approach serving as a framework for shareable, interoperable, computable
    guidelines with the goal of connecting research and evidence swiftly and accurately to those who need it most,
    including clinicians and patients.
  </>
);

const urlHelperText = 'Canonical identifier for this library, represented as a URI (globally unique).';
const publisherHelperText = 'Name of the publisher (organization or individual).';
const purposeHelperText = 'Why this library is defined.';
const usageHelperText = 'Describes the clinical usage of the library.';
const copyrightHelperText = 'Use and/or publishing restrictions.';
const relatedArtifactDescriptionHelperText = 'Brief description of the citation.';
const relatedArtifactUrlHelperText = 'URL where the citation can be accessed.';
const relatedArtifactCitationHelperText = 'Bibliographic citation for the artifact.';

// options

const statusOptions = [
  { value: 'draft', label: 'draft' },
  { value: 'active', label: 'active' },
  { value: 'retired', label: 'retired' },
  { value: 'unknown', label: 'unknown' }
];

const experimentalOptions = [
  { value: 'true', label: 'true' },
  { value: 'false', label: 'false' }
];

const contextTypeOptions = [
  { value: 'gender', label: 'gender' },
  { value: 'ageRange', label: 'age range' },
  { value: 'clinicalFocus', label: 'clinical focus' },
  { value: 'userType', label: 'user type' },
  { value: 'workflowSetting', label: 'workflow setting' },
  { value: 'workflowTask', label: 'workflow task' },
  { value: 'clinicalVenue', label: 'clinical venue' },
  { value: 'species', label: 'species' },
  { value: 'program', label: 'program' }
];

const contextTypeGenderOptions = [
  { value: 'female', label: 'female' },
  { value: 'male', label: 'male' },
  { value: 'other', label: 'other' },
  { value: 'unknown', label: 'unknown' }
];

const contextTypeUserOptions = nuccProviderTaxonomy.map(taxonomy => {
  let display = taxonomy.Classification;
  if (taxonomy.Specialization !== '') display = `${display} - ${taxonomy.Specialization}`;
  return { value: `user-${taxonomy.Code}`, label: `${taxonomy.Code} - ${display}` };
});

const contextTypeWorkflowSettingOptions = [
  { value: 'ambulatory', label: 'ambulatory' },
  { value: 'emergency', label: 'emergency' },
  { value: 'field', label: 'field' },
  { value: 'homeHealth', label: 'home health' },
  { value: 'inpatientEncounter', label: 'inpatient encounter' },
  { value: 'inpatientAcute', label: 'inpatient acute' },
  { value: 'inpatientNonAcute', label: 'inpatient non-acute' },
  { value: 'observationEncounter', label: 'observation encounter' },
  { value: 'preAdmission', label: 'pre-admission' },
  { value: 'shortStay', label: 'short stay' },
  { value: 'virtual', label: 'virtual' }
];

const contextTypeWorkflowTaskOptions = fhirWorkflowTaskCodes.map(taskCode => ({
  value: taskCode.Code,
  label: `${taskCode.Code} - ${taskCode.Display}`
}));

const contextTypeClinicalVenueOptions = fhirClinicalVenueCodes.map(venueCode => ({
  value: venueCode.Code,
  label: `${venueCode.Code} - ${venueCode.Display}`
}));

const unitOfTimeOptions = [
  { value: 'seconds', label: 'seconds' },
  { value: 'minutes', label: 'minutes' },
  { value: 'hours', label: 'hours' },
  { value: 'days', label: 'days' },
  { value: 'weeks', label: 'weeks' },
  { value: 'months', label: 'months' },
  { value: 'years', label: 'years' }
];

const relatedArtifactOptions = [{ value: 'citation', label: 'Citation' }];

// conditions

const contextTypeConditions = {
  gender: [
    {
      type: 'input',
      name: 'gender',
      label: 'Gender',
      component: SelectField,
      options: contextTypeGenderOptions,
      colSize: '2'
    }
  ],
  ageRange: [
    { name: 'ageRangeMin', label: 'Minimum Age', component: TextField, colSize: '2' },
    { name: 'ageRangeMax', label: 'Maximum Age', component: TextField, colSize: '2' },
    {
      type: 'input',
      name: 'ageRangeUnitOfTime',
      label: 'Unit of Time',
      component: SelectField,
      options: unitOfTimeOptions,
      colSize: '2'
    }
  ],
  clinicalFocus: [
    { type: 'button', component: AuthenticateVSACField },
    { type: 'button', component: CodeSelectField }
  ],
  userType: [
    {
      type: 'input',
      name: 'userType',
      label: 'User Type',
      component: AutocompleteField,
      options: contextTypeUserOptions
    }
  ],
  workflowSetting: [
    {
      type: 'input',
      name: 'workflowSetting',
      label: 'Workflow Setting',
      component: SelectField,
      options: contextTypeWorkflowSettingOptions
    }
  ],
  workflowTask: [
    {
      type: 'input',
      name: 'workflowTask',
      label: 'Workflow Task',
      component: AutocompleteField,
      options: contextTypeWorkflowTaskOptions
    }
  ],
  clinicalVenue: [
    {
      type: 'input',
      name: 'clinicalVenue',
      label: 'Clinical Venue',
      component: AutocompleteField,
      options: contextTypeClinicalVenueOptions
    }
  ],
  species: [
    { type: 'button', component: AuthenticateVSACField },
    { type: 'button', component: CodeSelectField }
  ],
  program: [{ name: 'program', label: 'Program', component: TextField }]
};

const relatedArtifactConditions = {
  citation: [
    {
      type: 'input',
      name: 'description',
      label: 'Description',
      component: TextAreaField,
      helperText: relatedArtifactDescriptionHelperText
    },
    {
      type: 'input',
      name: 'url',
      label: 'URL',
      component: TextAreaField,
      helperText: relatedArtifactUrlHelperText
    },
    {
      type: 'input',
      name: 'citation',
      label: 'Citation',
      component: TextAreaField,
      helperText: relatedArtifactCitationHelperText
    }
  ]
};

// fields

const contextFields = [
  {
    name: 'contextType',
    label: 'Context Type',
    component: SelectConditionalField,
    options: contextTypeOptions,
    conditions: contextTypeConditions
  }
];

const topicFields = [
  { type: 'button', name: 'topicVSAC', component: AuthenticateVSACField },
  { type: 'button', name: 'topicCode', component: CodeSelectField }
];

const authorFields = [{ name: 'author', component: TextField }];
const reviewerFields = [{ name: 'reviewer', component: TextField }];
const endorserFields = [{ name: 'endorser', component: TextField }];

const relatedArtifactFields = [
  {
    name: 'relatedArtifactType',
    label: 'Type',
    component: SelectConditionalField,
    options: relatedArtifactOptions,
    conditions: relatedArtifactConditions
  }
];

const cpgFields = [
  { name: 'description', label: 'Description', component: TextAreaField },
  { name: 'url', label: 'URL', component: TextField, helperText: urlHelperText },
  { name: 'status', label: 'Status', component: SelectField, colSize: '2', options: statusOptions },
  { name: 'experimental', label: 'Experimental', component: SelectField, colSize: '2', options: experimentalOptions },
  { name: 'publisher', label: 'Publisher', component: TextField, helperText: publisherHelperText },
  {
    name: 'context',
    label: 'Context',
    component: GroupedFields,
    buttonText: 'Add Context',
    fields: contextFields,
    defaultValue: {
      contextType: null,
      gender: null,
      ageRangeMin: '',
      ageRangeMax: '',
      ageRangeUnitOfTime: null,
      userType: null,
      workflowSetting: null,
      workflowTask: null,
      clinicalVenue: null,
      program: '',
      code: '',
      system: null
    }
  },
  { name: 'purpose', label: 'Purpose', component: TextAreaField, helperText: purposeHelperText },
  { name: 'usage', label: 'Usage', component: TextAreaField, helperText: usageHelperText },
  { name: 'copyright', label: 'Copyright', component: TextAreaField, helperText: copyrightHelperText },
  { name: 'approvalDate', label: 'Approval Date', component: DateField },
  { name: 'lastReviewDate', label: 'Last Review Date', component: DateField },
  { name: 'effectivePeriod', label: 'Effective Period', component: DateRangeField },
  {
    name: 'topic',
    label: 'Topic',
    component: GroupedFields,
    buttonText: 'Add Topic',
    fields: topicFields,
    defaultValue: {
      code: '',
      system: null
    }
  },
  {
    name: 'author',
    label: 'Author',
    component: GroupedFields,
    buttonText: 'Add Author',
    fields: authorFields,
    defaultValue: {
      author: ''
    }
  },
  {
    name: 'reviewer',
    label: 'Reviewer',
    component: GroupedFields,
    buttonText: 'Add Reviewer',
    fields: reviewerFields,
    defaultValue: {
      reviewer: ''
    }
  },
  {
    name: 'endorser',
    label: 'Endorser',
    component: GroupedFields,
    buttonText: 'Add Endorser',
    fields: endorserFields,
    defaultValue: {
      endorser: ''
    }
  },
  {
    name: 'relatedArtifact',
    label: 'Related Artifact',
    component: GroupedFields,
    buttonText: 'Add Related Artifact',
    fields: relatedArtifactFields,
    defaultValue: {
      relatedArtifactType: null,
      description: '',
      url: '',
      citation: ''
    }
  }
];

export default cpgFields;
export { versionHelperText, cpgScoreHelperText };
