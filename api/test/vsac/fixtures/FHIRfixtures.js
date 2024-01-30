const Search = {
  resourceType: 'Bundle',
  meta: {
    lastUpdated: '2018-02-09T12:08:58.704-05:00'
  },
  type: 'searchset',
  total: 3,
  link: [
    {
      relation: 'self',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=0&_count=50'
    },
    {
      relation: 'next',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=50&_count=50'
    },
    {
      relation: 'last',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=17&_count=50'
    }
  ],
  entry: [
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1195.277',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1195.277',
        meta: {
          versionId: '5',
          lastUpdated: '2023-12-21T17:43:03.000-05:00',
          profile: [
            'http://hl7.org/fhir/StructureDefinition/shareablevalueset',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm'
          ],
          tag: [
            {
              code: 'SUBSETTED',
              display: 'subsetted'
            }
          ]
        },
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-author',
            valueString: 'NJII Author'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate',
            valueDate: '2022-12-15'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate',
            valueDate: '2019-02-06'
          }
        ],
        url: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1195.277',
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1195.277'
          }
        ],
        version: '20190206',
        name: 'AETNADiabetesHemoglobinA1cTestingCPTCodes',
        title: 'AETNA Diabetes Hemoglobin A1c testing CPT codes', // Note: title is different from name
        status: 'active',
        experimental: true, // NOTE: changed to true for testing purposes
        date: '2019-02-06T01:00:02-05:00',
        publisher: 'NJII Steward',
        jurisdiction: [
          {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
                valueCode: 'unknown'
              }
            ]
          }
        ]
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.739',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.739',
        meta: {
          versionId: '6',
          lastUpdated: '2023-12-21T17:43:03.000-05:00',
          profile: [
            'http://hl7.org/fhir/StructureDefinition/shareablevalueset',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm'
          ],
          tag: [
            {
              code: 'SUBSETTED',
              display: 'subsetted'
            }
          ]
        },
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-author',
            valueString: 'Change Healthcare Author'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate',
            valueDate: '2022-12-15'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate',
            valueDate: '2018-04-26'
          }
        ],
        url: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.739',
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.739'
          }
        ],
        version: '20180426',
        title: '', // Note: title is empty so fall back to name
        name: 'Diabetes',
        status: 'active',
        experimental: false,
        date: '2018-04-26T01:00:04-04:00',
        publisher: 'Change Healthcare Steward',
        jurisdiction: [
          {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
                valueCode: 'unknown'
              }
            ]
          }
        ]
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.1329',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.3157.1329',
        meta: {
          versionId: '11',
          lastUpdated: '2023-12-21T17:43:03.000-05:00',
          profile: [
            'http://hl7.org/fhir/StructureDefinition/shareablevalueset',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/computable-valueset-cqfm',
            'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/publishable-valueset-cqfm'
          ],
          tag: [
            {
              code: 'SUBSETTED',
              display: 'subsetted'
            }
          ]
        },
        extension: [
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-author',
            valueString: 'Lewin EH Author'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/resource-lastReviewDate',
            valueDate: '2022-12-15'
          },
          {
            url: 'http://hl7.org/fhir/StructureDefinition/valueset-effectiveDate',
            valueDate: '2020-07-15'
          }
        ],
        url: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.1329',
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.3157.1329'
          }
        ],
        version: '20200715',
        name: 'DiabetesMellitus', // Note: no title so fall back to name
        status: 'active',
        experimental: false,
        date: '2020-07-15T01:00:42-04:00',
        publisher: 'Lewin EH Steward',
        description: 'OP-13 is the measure ID associated with the codes.',
        jurisdiction: [
          {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
                valueCode: 'unknown'
              }
            ]
          }
        ]
      }
    }
  ]
};

let SearchWithPurpose = {
  resourceType: 'Bundle',
  meta: {
    lastUpdated: '2018-02-09T12:08:58.704-05:00'
  },
  type: 'searchset',
  total: 4,
  link: [
    {
      relation: 'self',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=0&_count=50'
    },
    {
      relation: 'next',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=50&_count=50'
    },
    {
      relation: 'last',
      url: 'http://cts.nlm.nih.gov/fhir/ValueSet?name:contains=Diabetes&_offset=17&_count=50'
    }
  ],
  entry: [
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1046.94',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1046.94',
        meta: {
          versionId: '1',
          lastUpdated: '2015-07-24T16:47:54.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        url: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1195.277',
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1046.94'
          }
        ],
        version: '20190206',
        name: 'AETNA Diabetes Hemoglobin A1c testing CPT codes',
        title: 'AETNA Diabetes Hemoglobin A1c testing CPT codes',
        status: 'active',
        experimental: true, // NOTE: changed to true for testing purposes
        date: '2019-02-06T01:00:02-05:00',
        publisher: 'NJII Steward',
        purpose:
          '(Clinical Focus: CPT codes for AETNA Diabetes: Hemoglobin A1c testing measure numerator),(Data Element Scope: Codes defined in measure.     ),(Inclusion Criteria: Codes \rdefined in \nmeasure.),(Exclusion Criteria: None specified (TBD).)'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1001',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1001',
        meta: {
          versionId: '18',
          lastUpdated: '2017-05-04T01:00:13.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1001'
          }
        ],
        version: '20170504',
        name: 'Diabetes',
        title: 'Diabetes',
        status: 'active',
        experimental: false,
        date: '2020-02-20T01:00:01-05:00',
        publisher: 'NCQA PHEMUR',
        purpose: 'A different format purpose definition'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1002',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1002',
        meta: {
          versionId: '28',
          lastUpdated: '2017-08-26T01:00:05.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1002'
          }
        ],
        version: '20170826',
        name: 'Diabetes',
        title: 'Diabetes',
        status: 'active',
        experimental: false,
        date: '2023-09-29T01:11:11-04:00',
        publisher: 'NCQA PHEMUR'
        // no purpose
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1003',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1003',
        meta: {
          versionId: '34',
          lastUpdated: '2018-01-30T10:35:11.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1003'
          }
        ],
        version: 'Draft',
        name: 'Diabetes',
        title: 'Diabetes',
        status: 'draft',
        experimental: false,
        date: '2023-09-29T01:11:11-04:00',
        publisher: 'NCQA PHEMUR',
        purpose: '(Clinical Focus: ),(Data Element Scope: ),(Inclusion Criteria: ),(Exclusion Criteria: )' // nothing meaningful
      }
    }
  ]
};

const ValueSet = {
  id: '1234',
  meta: { versionId: '1' },
  name: 'foo',
  expansion: {
    contains: [
      {
        system: 'http://hl7.org/fhir/sid/icd-9-cm',
        version: '2013',
        code: '250.00',
        display:
          'Diabetes mellitus without mention of complication, type II or unspecified type, not stated as uncontrolled'
      }
    ]
  }
};

const valueSetWithTitle = {
  resourceType: 'ValueSet',
  id: '123.45',
  meta: {
    versionId: '10'
  },
  url: 'http://cts.nlm.nih.gov/fhir/ValueSet/123.45',
  version: '20210416',
  name: 'DiabetesMellitusScreening',
  title: 'Diabetes Mellitus Screening',
  status: 'active',
  experimental: false,
  date: '2021-04-16T01:00:20-04:00',
  publisher: 'NACHC Steward',
  expansion: {
    identifier: 'urn:uuid:19601582-9a5b-4a40-bfd8-28630248c500',
    timestamp: '2024-01-25T17:04:52-05:00',
    total: 1,
    offset: 0,
    contains: [
      {
        system: 'http://hl7.org/fhir/sid/icd-10-cm',
        version: '2024',
        code: 'Z13.1',
        display: 'Encounter for screening for diabetes mellitus'
      }
    ]
  }
};

const ValueSetWithCounts = {
  expansion: {
    total: 33
  }
};

const Code = {
  resourceType: 'Parameters',
  parameter: [
    {
      name: 'name',
      valueString: 'LOINC'
    },
    {
      name: 'version',
      valueString: '2.63'
    },
    {
      name: 'display',
      valueString: 'Bicarbonate [Moles/volume] in Serum'
    },
    {
      name: 'Oid',
      valueString: '2.16.840.1.113883.6.1'
    }
  ]
};

module.exports = {
  Search,
  SearchWithPurpose,
  ValueSet,
  valueSetWithTitle,
  ValueSetWithCounts,
  Code
};
