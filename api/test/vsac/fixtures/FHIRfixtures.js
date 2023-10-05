let Search = {
  resourceType: 'Bundle',
  meta: {
    lastUpdated: '2018-02-09T12:08:58.704-05:00'
  },
  type: 'searchset',
  total: 67,
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
        jurisdiction: [
          {
            extension: [
              {
                url: 'http://hl7.org/fhir/StructureDefinition/data-absent-reason',
                valueString: 'UNKNOWN'
              }
            ]
          }
        ]
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
        status: 'active',
        publisher: 'NCQA PHEMUR'
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
        status: 'active',
        publisher: 'NCQA PHEMUR'
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
        status: 'draft',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1001',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.12.1001',
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
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1001'
          }
        ],
        version: '20170504',
        name: 'Diabetes',
        status: 'active',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.67.1.101.1.4',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.67.1.101.1.4',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:53.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes</h2><div><p>Diabetes GROUPING</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.67.1.101.1.4'
          }
        ],
        version: 'Draft',
        name: 'Diabetes',
        status: 'draft',
        publisher: 'Telligen',
        description: 'Diabetes GROUPING'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.1678.2382',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.1678.2382',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Codes</h2><div><p>Value set to identify diabetes</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.1678.2382'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Codes',
        status: 'draft',
        publisher: 'NQF',
        description: 'Value set to identify diabetes'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.638',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.638',
        meta: {
          versionId: '3',
          lastUpdated: '2017-11-30T09:53:28.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Diagnoses</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.638'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Diagnoses',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.60',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.60',
        meta: {
          versionId: '1',
          lastUpdated: '2016-02-08T14:04:27.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Diagnosis</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.60'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Diagnosis',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.56',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.56',
        meta: {
          versionId: '2',
          lastUpdated: '2016-02-08T13:34:13.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Dx</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.56'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Dx',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.394',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.394',
        meta: {
          versionId: '4',
          lastUpdated: '2017-06-08T17:10:23.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Dx for Q measure 001 Registry</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.394'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Dx for Q measure 001 Registry',
        status: 'active',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1152.22',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1152.22',
        meta: {
          versionId: '1',
          lastUpdated: '2016-08-24T16:48:18.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Grouped</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1152.22'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Grouped',
        status: 'draft',
        publisher: 'Practice Fusion Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.344',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.666.5.344',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes ICD10</h2><div><p>Developed by OFMQ for immunization measures</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.666.5.344'
          }
        ],
        version: 'Draft',
        name: 'Diabetes ICD10',
        status: 'draft',
        publisher: 'Lantana',
        description: 'Developed by OFMQ for immunization measures'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.55',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.55',
        meta: {
          versionId: '2',
          lastUpdated: '2016-02-08T13:16:24.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes ICD10 ACO</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.55'
          }
        ],
        version: 'Draft',
        name: 'Diabetes ICD10 ACO',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.716',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.716',
        meta: {
          versionId: '3',
          lastUpdated: '2017-12-27T18:05:37.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes ICD10CM ICD9CM</h2><div><p>The purpose of this value set is to create a harmonized group value set of ICD9CM and ICD10CM codes to inform measures in multiple quality program such as MIPS and MSSP ACO.</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.716'
          }
        ],
        version: 'Draft',
        name: 'Diabetes ICD10CM ICD9CM',
        status: 'draft',
        publisher: 'McKesson Steward',
        description:
          'The purpose of this value set is to create a harmonized group value set of ICD9CM and ICD10CM codes to inform measures in multiple quality program such as MIPS and MSSP ACO.'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.320',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.666.5.320',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes ICD9</h2><div><p>Developed by OFMQ for Immunization measures</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.666.5.320'
          }
        ],
        version: 'Draft',
        name: 'Diabetes ICD9',
        status: 'draft',
        publisher: 'Lantana',
        description: 'Developed by OFMQ for Immunization measures'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.57',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.57',
        meta: {
          versionId: '2',
          lastUpdated: '2016-02-08T13:33:33.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes ICD9CM ACO</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.57'
          }
        ],
        version: 'Draft',
        name: 'Diabetes ICD9CM ACO',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1141.7',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1141.7',
        meta: {
          versionId: '3',
          lastUpdated: '2017-09-13T13:32:36.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Long Term Complications</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1141.7'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Long Term Complications',
        status: 'draft',
        publisher: 'Lewin EH Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.619',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.619',
        meta: {
          versionId: '3',
          lastUpdated: '2017-11-28T09:10:43.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Management Training</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.619'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Management Training',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1053.8',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1053.8',
        meta: {
          versionId: '7',
          lastUpdated: '2015-10-22T01:00:01.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Medical Supplies (insulin syringes only)</h2><div><p>Blood-glucose meters and sensors\n126958, 412956, 412959,\n637321, 668291, 668370,\n686655, 692383, 748611,\n880998, 881056\n751128\ncannot be found</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1053.8'
          }
        ],
        version: '20151022',
        name: 'Diabetes Medical Supplies (insulin syringes only)',
        status: 'active',
        publisher: 'Vanderbilt University Steward',
        description:
          'Blood-glucose meters and sensors\n126958, 412956, 412959,\n637321, 668291, 668370,\n686655, 692383, 748611,\n880998, 881056\n751128\ncannot be found'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1107.16',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1107.16',
        meta: {
          versionId: '16',
          lastUpdated: '2015-02-19T22:28:38.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitius</h2><div><p>Patient advisory</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1107.16'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitius',
        status: 'draft',
        publisher: 'Intermountain Steward',
        description: 'Patient advisory'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.501',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.501',
        meta: {
          versionId: '4',
          lastUpdated: '2017-08-08T08:39:27.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.501'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.1260.1.2255',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.1260.1.2255',
        meta: {
          versionId: '2',
          lastUpdated: '2014-06-25T19:29:53.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.1260.1.2255'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus',
        status: 'draft',
        publisher: 'Mathematica'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2.1.102',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.2.1.102',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus</h2><div><p>dfgdfgfgfgfg</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.2.1.102'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus',
        status: 'draft',
        publisher: 'Joint Commission',
        description: 'dfgdfgfgfgfg'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.1003.120',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.3157.1003.120',
        meta: {
          versionId: '5',
          lastUpdated: '2016-09-28T12:55:26.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus</h2><div><p>OP-13 is the measure ID associated with the codes.</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.3157.1003.120'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus',
        status: 'draft',
        publisher: 'Lewin EH Steward',
        description: 'OP-13 is the measure ID associated with the codes.'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.1260.1.1981',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.1260.1.1981',
        meta: {
          versionId: '4',
          lastUpdated: '2016-02-18T15:08:26.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus (ICD 10)</h2><div><p>Need to identify diabetes mellitus patients in the hospital.</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.1260.1.1981'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus (ICD 10)',
        status: 'draft',
        publisher: 'Mathematica',
        description: 'Need to identify diabetes mellitus patients in the hospital.'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.1260.1.1980',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.1260.1.1980',
        meta: {
          versionId: '3',
          lastUpdated: '2014-06-13T14:35:22.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus (ICD 9)</h2><div><p>Need to identify patient that are diagnosed with diabetes mellitus.</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.1260.1.1980'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus (ICD 9)',
        status: 'draft',
        publisher: 'Mathematica',
        description: 'Need to identify patient that are diagnosed with diabetes mellitus.'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.1260.1.1993',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.1260.1.1993',
        meta: {
          versionId: '7',
          lastUpdated: '2016-02-18T15:11:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus (SNOMED)</h2><div><p>Identification of patients with diabetes mellitus</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.1260.1.1993'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Mellitus (SNOMED)',
        status: 'draft',
        publisher: 'Mathematica',
        description: 'Identification of patients with diabetes mellitus'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1164.41',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1164.41',
        meta: {
          versionId: '6',
          lastUpdated: '2017-06-22T01:00:03.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus, poorly controlled</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1164.41'
          }
        ],
        version: '20170622',
        name: 'Diabetes Mellitus, poorly controlled',
        status: 'active',
        publisher: 'LUGPA Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1164.46',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1164.46',
        meta: {
          versionId: '7',
          lastUpdated: '2017-06-23T01:00:03.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Mellitus, poorly controlled</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1164.46'
          }
        ],
        version: '20170623',
        name: 'Diabetes Mellitus, poorly controlled',
        status: 'active',
        publisher: 'LUGPA Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.342',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.666.5.342',
        meta: {
          versionId: '3',
          lastUpdated: '2015-10-01T16:27:12.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes SNOMED</h2><div><p>Developed by OFMQ for immunization measures</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.666.5.342'
          }
        ],
        version: 'Draft',
        name: 'Diabetes SNOMED',
        status: 'draft',
        publisher: 'RTI Steward',
        description: 'Developed by OFMQ for immunization measures'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.414',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.414',
        meta: {
          versionId: '3',
          lastUpdated: '2017-06-15T11:15:51.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Self Management Training Services</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.414'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Self Management Training Services',
        status: 'draft',
        publisher: 'McKesson Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1141.8',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1141.8',
        meta: {
          versionId: '3',
          lastUpdated: '2017-09-13T13:39:00.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Short Term Complications</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1141.8'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Short Term Complications',
        status: 'draft',
        publisher: 'Lewin EH Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1012',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.12.1012',
        meta: {
          versionId: '12',
          lastUpdated: '2016-01-27T15:24:46.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes Visit</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1012'
          }
        ],
        version: 'Draft',
        name: 'Diabetes Visit',
        status: 'active',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.666.5.345',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.666.5.345',
        meta: {
          versionId: '3',
          lastUpdated: '2015-09-21T16:32:12.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes group</h2><div><p>Developed by OFMQ for immunization measures</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.666.5.345'
          }
        ],
        version: 'Draft',
        name: 'Diabetes group',
        status: 'draft',
        publisher: 'RTI Steward',
        description: 'Developed by OFMQ for immunization measures'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1047.61',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1047.61',
        meta: {
          versionId: '1',
          lastUpdated: '2015-07-02T13:00:31.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes management encounter</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1047.61'
          }
        ],
        version: 'Draft',
        name: 'Diabetes management encounter',
        status: 'draft',
        publisher: 'QIP'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.1324',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.3157.1324',
        meta: {
          versionId: '3',
          lastUpdated: '2017-05-13T01:00:05.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes mellitus</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.3157.1324'
          }
        ],
        version: '20170513',
        name: 'Diabetes mellitus',
        status: 'active',
        publisher: 'Lewin EH Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.3157.1329',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.3157.1329',
        meta: {
          versionId: '3',
          lastUpdated: '2017-05-13T01:00:05.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes mellitus</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.3157.1329'
          }
        ],
        version: '20170513',
        name: 'Diabetes mellitus',
        status: 'active',
        publisher: 'Lewin EH Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1136.45',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1136.45',
        meta: {
          versionId: '3',
          lastUpdated: '2017-09-18T03:41:57.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes with Long Term Complications</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1136.45'
          }
        ],
        version: 'Draft',
        name: 'Diabetes with Long Term Complications',
        status: 'draft',
        publisher: 'Lewin EH Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1152.21',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1152.21',
        meta: {
          versionId: '2',
          lastUpdated: '2016-08-24T16:47:05.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes_ICD10</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1152.21'
          }
        ],
        version: 'Draft',
        name: 'Diabetes_ICD10',
        status: 'draft',
        publisher: 'Practice Fusion Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1152.19',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1152.19',
        meta: {
          versionId: '1',
          lastUpdated: '2016-08-24T16:28:23.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes_ICD9</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1152.19'
          }
        ],
        version: 'Draft',
        name: 'Diabetes_ICD9',
        status: 'draft',
        publisher: 'Practice Fusion Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1152.20',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1152.20',
        meta: {
          versionId: '1',
          lastUpdated: '2016-08-24T16:41:31.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Diabetes_SNOMED</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1152.20'
          }
        ],
        version: 'Draft',
        name: 'Diabetes_SNOMED',
        status: 'draft',
        publisher: 'Practice Fusion Steward'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1012',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1012',
        meta: {
          versionId: '4',
          lastUpdated: '2013-06-12T19:16:23.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Gestational Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1012'
          }
        ],
        version: '20130614',
        name: 'Gestational Diabetes',
        status: 'active',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1014',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1014',
        meta: {
          versionId: '4',
          lastUpdated: '2013-06-12T19:19:00.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Gestational Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1014'
          }
        ],
        version: '20130614',
        name: 'Gestational Diabetes',
        status: 'active',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.12.1010',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.12.1010',
        meta: {
          versionId: '4',
          lastUpdated: '2013-06-12T19:21:38.000-04:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Gestational Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.12.1010'
          }
        ],
        version: '20130614',
        name: 'Gestational Diabetes',
        status: 'active',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2.1.567',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.2.1.567',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:40.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>NQF-064 Diabetes SNOMED-CT</h2><div><p>SNOMED-CT</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.2.1.567'
          }
        ],
        version: 'Draft',
        name: 'NQF-064 Diabetes SNOMED-CT',
        status: 'draft',
        publisher: 'NCQA',
        description: 'SNOMED-CT'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.2.1.565',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.2.1.565',
        meta: {
          versionId: '1',
          lastUpdated: '2013-11-24T15:57:53.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>NQF064- Diabetes GRP ICD-10</h2><div><p>&quot;diabetes&quot; ICD-10-CM code list</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.2.1.565'
          }
        ],
        version: 'Draft',
        name: 'NQF064- Diabetes GRP ICD-10',
        status: 'draft',
        publisher: 'NCQA',
        description: '"diabetes" ICD-10-CM code list'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1032',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1032',
        meta: {
          versionId: '3',
          lastUpdated: '2017-12-29T09:22:35.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Other Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1032'
          }
        ],
        version: 'Draft',
        name: 'Other Diabetes',
        status: 'draft',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113883.3.464.1003.103.11.1033',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113883.3.464.1003.103.11.1033',
        meta: {
          versionId: '3',
          lastUpdated: '2017-12-29T09:29:54.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Other Diabetes</h2><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113883.3.464.1003.103.11.1033'
          }
        ],
        version: 'Draft',
        name: 'Other Diabetes',
        status: 'draft',
        publisher: 'NCQA PHEMUR'
      }
    },
    {
      fullUrl: 'http://cts.nlm.nih.gov/fhir/ValueSet/2.16.840.1.113762.1.4.1138.718',
      resource: {
        resourceType: 'ValueSet',
        id: '2.16.840.1.113762.1.4.1138.718',
        meta: {
          versionId: '3',
          lastUpdated: '2017-12-27T18:50:03.000-05:00'
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml"><h2>Patient with Diabetes and Most Recent LDL Cholesterol Lab Result &lt; 70 mg/dL and Not Taking Statin Therapy</h2><div><p>This value set created to define equivalent codes for administrative billing / quality data codes representing the fasting or direct LDL-C laboratory test where the most recent result for a patient with diabetes is &lt; 70 mg/dL and the patient is not taking a statin.</p>\n</div><p>This value set includes codes from the following code systems:</p><ul/></div>'
        },
        identifier: [
          {
            system: 'urn:ietf:rfc:3986',
            value: 'urn:oid:2.16.840.1.113762.1.4.1138.718'
          }
        ],
        version: 'Draft',
        name: 'Patient with Diabetes and Most Recent LDL Cholesterol Lab Result < 70 mg/dL and Not Taking Statin Therapy',
        status: 'draft',
        publisher: 'McKesson Steward',
        description:
          'This value set created to define equivalent codes for administrative billing / quality data codes representing the fasting or direct LDL-C laboratory test where the most recent result for a patient with diabetes is < 70 mg/dL and the patient is not taking a statin.'
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

let ValueSet = {
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
  ValueSetWithCounts,
  Code
};
