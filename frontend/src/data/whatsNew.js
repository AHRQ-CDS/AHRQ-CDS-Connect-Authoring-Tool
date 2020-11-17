/* eslint-disable max-len */
import React from 'react';

// data for what's new section of homepage - should have between 1 and 4 objects
const whatsNew = [
  {
    id: 1,
    name: 'External CQL Functions',
    ariaLabel: 'External CQL Functions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-external-modifiers.png`,
    description: (
      <>
        External CQL functions can now be used as expression modifiers on the elements
        of an artifact. This allows CDS Authors to more easily and effectively extend
        the functionality of the CDS Authoring Tool to suit their specific needs.
      </>
    ),
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Using_External_CQL_Expression_Modifiers`,
  },
  {
    id: 2,
    name: (
      <>
        CPG on FHIR<sup>®</sup> Support
      </>
    ),
    ariaLabel: 'CPG Publishable Library Support',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-cpg-on-fhir.png`,
    description: (
      <>
        CDS Authors can now provide additional metadata about their artifact in
        a new form based on the FHIR<sup>®</sup> Clinical Practice Guidelines
        (a.k.a. CPG on FHIR) Publishable Library profile. The metadata will also
        be exported automatically as a CPG Publishable library in all CQL
        downloads.{' '}
      </>
    ),
    linkText: 'CPG Publishable Library',
    link:
      'http://build.fhir.org/ig/HL7/cqf-recommendations/StructureDefinition-cpg-publishablelibrary.html',
    linkExternal: true,
  },
  {
    id: 3,
    name: 'Common Functions',
    ariaLabel: 'Common Functions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-common-functions.png`,
    description: (
      <>
        Artifact downloads no longer package separate CDS Connect Commons and
        CDS Connect Conversions libraries. Instead, the primary CQL library will
        embed any required common functions in its own CQL.
      </>
    ),
  },
  {
    id: 4,
    name: 'Collapsible Comments',
    ariaLabel: 'Collapsible Comments',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-collapsible-comments.png`,
    description: (
      <>
        User-provided comments are now supported on most authoring elements.
        Comments are collapsed by default to allow users to see the most
        relevant data without being overwhelmed by empty comment blocks.
      </>
    ),
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Annotate_Element`,
  },
];

export default whatsNew;
