/* eslint-disable max-len */

// data for what's new section of homepage - should have between 1 and 4 objects
export default [
  {
    id: 1,
    name: 'Multi-Patient Testing',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-testing.png`,
    description: 'CDS Authors can now test their CDS artifacts against more than one synthetic patient at once. The selected CDS artifact will be executed against each patient the author selects, and individual results are displayed.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/userguide#Testing_Artifacts`
  },
  {
    id: 2,
    name: 'External CQL',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-external-cql.png`,
    description: 'CDS Authors can now import externally authored CQL libraries and use their defined expressions in Inclusions, Exclusions, Subpopulations, and Base Elements. This allows authors to fill gaps in logic that cannot be produced by the CDS Authoring Tool and to leverage pre-existing CQL expressions.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/userguide#External_CQL`
  },
  {
    id: 3,
    name: 'Comments',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-comments.png`,
    description: 'CDS Authors now have the ability to add comments to individual CDS elements including single base elements. These comments are added to the generated CQL above the element’s definition.',
    linkText: 'Documentation',
    link: `${process.env.PUBLIC_URL}/userguide#Comments`
  },
  {
    id: 4,
    name: 'Webinar',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-webinar.png`,
    description: 'AHRQ hosted a national web conference on the CDS Authoring Tool in February 2019.  During this conference, participants were shown how to build an example Statin Use artifact and how to integrate it with an EHR using CQL Services and the CDS Hooks API.',
    linkText: 'More Information',
    link: 'https://healthit.ahrq.gov/events/national-web-conference-clinical-decision-support-authoring-tool'
  }
];
