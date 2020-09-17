/* eslint-disable max-len */
import React from 'react';
// data for what's new section of homepage - should have between 1 and 4 objects
export default [
  {
    id: 1,
    name: 'Common Functions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-common-functions.png`,
    description: 'Artifact downloads no longer package separate CDS Connect Commons and CDS Connect Conversions libraries. Instead, the primary CQL library will embed any required common functions in its own CQL.',
  },
  {
    id: 2,
    name: 'Collapsible Comments',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-collapsible-comments.png`,
    description: 'User-provided comments are now supported on most authoring elements.  Comments are collapsed by default to allow users to see the most relevant data without being overwhelmed by empty comment blocks.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Annotate_Element`
  },
  {
    id: 3,
    name: ['FHIR',<sup>®</sup>, ' R4 Support'],
    ariaLabel: 'FHIR R4 Support',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-fhir-r4.png`,
    description: ['CDS Authors can now download and test their CDS artifacts using HL7',<sup>®</sup>, ' FHIR', <sup>®</sup>, ' R4, the first normative edition of the FHIR specification. Support for FHIR R4 supplements existing support for FHIR DSTU2 and STU3.'],
    linkText: [" HL7",<sup>®</sup> , " FHIR",<sup>®</sup>, " R4"],
    //linkText: 'HL7® FHIR® R4',
    link: 'http://hl7.org/fhir/R4/index.html',
    linkExternal: true
  },
  {
    id: 4,
    name: 'Multi-Patient Testing',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-testing.png`,
    description: 'CDS Authors can now test their CDS artifacts against more than one synthetic patient at once. The selected CDS artifact will be executed against each patient the author selects, and individual results are displayed.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Testing_Artifacts`
  }
];
