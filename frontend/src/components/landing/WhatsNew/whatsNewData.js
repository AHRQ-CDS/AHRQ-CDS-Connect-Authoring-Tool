import React from 'react';

// data for what's new section of homepage - should have between 1 and 4 objects
const whatsNewData = [
  {
    id: 1,
    name: 'Sort & Duplicate Artifacts',
    ariaLabel: 'Sort & Duplicate Artifacts',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-artifacts.png`,
    description: (
      <>
        The Artifacts page now allows users to sort their artifact list by name, version, last changed, or date created.
        In addition, users can duplicate an existing artifact to create a brand new copy that they can develop
        independent of the original artifact.
      </>
    ),
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Managing_Artifacts`
  },
  {
    id: 2,
    name: 'External CQL Functions',
    ariaLabel: 'External CQL Functions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-external-modifiers.png`,
    description: (
      <>
        External CQL functions can now be used as expression modifiers on the elements of an artifact. This allows CDS
        Authors to more easily and effectively extend the functionality of the CDS Authoring Tool to suit their specific
        needs.
      </>
    ),
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Using_External_CQL_Expression_Modifiers`
  },
  {
    id: 3,
    name: (
      <>
        CPG on FHIR<sup>®</sup> Support
      </>
    ),
    ariaLabel: 'CPG Publishable Library Support',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-cpg-on-fhir.png`,
    description: (
      <>
        CDS Authors can now provide additional metadata about their artifact in a new form based on the FHIR<sup>®</sup>{' '}
        Clinical Practice Guidelines (a.k.a. CPG on FHIR) Publishable Library profile. The metadata will also be
        exported automatically as a CPG Publishable library in all CQL downloads.{' '}
      </>
    ),
    linkText: 'CPG Publishable Library',
    link: 'http://build.fhir.org/ig/HL7/cqf-recommendations/StructureDefinition-cpg-publishablelibrary.html',
    linkExternal: true
  },
  {
    id: 4,
    name: 'Common Functions',
    ariaLabel: 'Common Functions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-common-functions.png`,
    description: (
      <>
        Artifact downloads no longer package separate CDS Connect Commons and CDS Connect Conversions libraries.
        Instead, the primary CQL library will embed any required common functions in its own CQL.
      </>
    )
  }
];

export default whatsNewData;
