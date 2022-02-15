import React from 'react';

// data for what's new section of homepage - should have between 1 and 4 objects
const whatsNewData = [
  {
    id: 1,
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
  },
  {
    id: 2,
    name: 'Build Modifiers',
    ariaLabel: 'Build Modifiers',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-build-modifiers.png`,
    description: (
      <>
        Authors can now build their own modifiers by defining sets of rules using resource properties and operators.
        This capability provides authors with more precise control over the criteria used to filter element data. Rules
        can be combined into groups to represent complex boolean criteria using 'and' and 'or'. As part of this feature,
        the user interface for selecting built-in modifiers has also been updated.
      </>
    ),
    linkText: 'Build Modifiers Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Modifier_Builder`
  },
  {
    id: 3,
    name: 'Recommendation Links',
    ariaLabel: 'Recommendation Links',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-rec-links.png`,
    description: (
      <>
        In addition to specifying recommendation text and rationale, authors can now add links to recommendations. These
        may be absolute links, such as links to educational materials, source documents, and online calculators, or they
        may be SMART links to local SMART on FHIR applications. Recommendation links follow the same basic format as the
        links returned in CDS Hooks cards, having a type (absolute or smart), label, and URL.
      </>
    ),
    linkText: 'Recommendation Links Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Adding_Links_to_Recommendations`
  },
  {
    id: 4,
    name: 'Summary Tab & More',
    ariaLabel: 'Summary Tab & More',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-summary.png`,
    description: (
      <>
        The new Summary tab provides an overview of the artifact, including its name, version, date last changed, date
        created, and the high-level structure of the CDS logic (inclusions, exclusions, and recommendations). All tabs
        now have indicator icons that show which tabs have user-provided content and which tabs contain errors. In
        addition, tabs never scroll out of view, allowing authors to more easily maintain the context of where they are.
      </>
    ),
    linkText: 'Summary Tab Documentation',
    link: `${process.env.PUBLIC_URL}/documentation#Summary`
  }
];

export default whatsNewData;
