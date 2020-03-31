/* eslint-disable max-len */

// data for what's new section of homepage - should have between 1 and 4 objects
export default [
  {
    id: 1,
    name: 'FHIR R4 Support',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-fhir-r4.png`,
    description: 'CDS Authors can now download and test their CDS artifacts using FHIR R4, the first normative edition of the FHIR specification. Support for FHIR R4 supplements existing support for FHIR DSTU2 and STU3.',
    linkText: 'FHIR R4 Specification',
    link: 'http://hl7.org/fhir/R4/index.html',
    linkExternal: true
  },
  {
    id: 2,
    name: 'Multi-Patient Testing',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-testing.png`,
    description: 'CDS Authors can now test their CDS artifacts against more than one synthetic patient at once. The selected CDS artifact will be executed against each patient the author selects, and individual results are displayed.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Testing_Artifacts`
  },
  {
    id: 3,
    name: 'External CQL',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-external-cql.png`,
    description: 'CDS Authors can now import externally authored CQL libraries and use their defined expressions in Inclusions, Exclusions, Subpopulations, and Base Elements. This allows authors to fill gaps in logic that cannot be produced by the CDS Authoring Tool and to leverage pre-existing CQL expressions.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#External_CQL`
  },
  {
    id: 4,
    name: 'Comments',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-comments.png`,
    description: 'CDS Authors now have the ability to add comments to individual CDS elements including single base elements. These comments are added to the generated CQL above the element’s definition.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Provide_Additional_Information`
  }
];
