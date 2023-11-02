import React from 'react';

// data for what's new section of homepage - should have between 1 and 4 objects
const whatsNewData = [
  {
    id: 1,
    name: 'Enhanced Value Set Search',
    ariaLabel: 'Enhanced Value Set Search',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-value-set-search.png`,
    description: (
      <>
        Value set search results have been enhanced with additional information about each value set. Search results now
        display last reviewed and last updated dates. Each row can be expanded to view additional details about the
        value set. The contents of the value set can still be viewed by clicking the "eye" icon.
      </>
    ),
    linkText: 'Add Value Set Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Add_Value_Set`
  },
  {
    id: 2,
    name: 'View CQL',
    ariaLabel: 'View CQL',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-view-cql.png`,
    description: (
      <>
        Authors can now quickly see the CQL for their artifacts directly within the CDS Authoring Tool. This new feature
        adds a "View CQL" button to the artifact "Workspace" view. This button allows an author to select their desired
        version of FHIR (DSTU2, STU3, or R4) and then instantly view the CQL for their artifact. The CQL is displayed
        with syntax highlighting to increase readability.
      </>
    ),
    linkText: 'View CQL Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Building_Artifacts`
  },
  {
    id: 3,
    name: 'Detailed CQL Results',
    ariaLabel: 'Detailed CQL Results',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-detailed-cql.png`,
    description: (
      <>
        In addition to seeing high level CQL execution results when testing artifacts, authors can now see the detailed
        results of executing each CQL statement within an artifact. This new feature extends the existing testing
        functionality to allow the CQL for an artifact to be viewed directly in the CDS Authoring Tool. The CQL is
        displayed with syntax highlighting to increase readability. In addition to the CQL itself, the result of each
        CQL expression is displayed for the selected patient record. Results can include boolean values, numerical
        values, strings, quantities, codes, and FHIR object type and ID references.
      </>
    ),
    linkText: 'Detailed CQL Results Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Detailed_Test_Execution_Results`
  },
  {
    id: 4,
    name: 'FHIR 4.0.1',
    ariaLabel: 'FHIR 4.0.1',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-fhir-401.png`,
    description: (
      <>
        Authors can now download their artifacts using CQL that leverages the FHIR 4.0.1 data model. In addition,
        authors can upload FHIR 4.0.1 CQL libraries to External CQL and test their FHIR 4.0.1 artifacts using the built
        in testing capability. The Authoring Tool continues to also support these capabilities for the FHIR 1.0.2, FHIR
        3.0.0, and FHIR 4.0.0 data models.
      </>
    ),
    linkText: 'Building Artifacts Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Building_Artifacts`
  }
];

export default whatsNewData;
