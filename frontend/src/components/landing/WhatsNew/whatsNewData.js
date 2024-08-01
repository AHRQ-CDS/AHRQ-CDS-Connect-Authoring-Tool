import React from 'react';

// data for what's new section of homepage - should have between 1 and 4 objects
const whatsNewData = [
  {
    id: 1,
    name: 'Recommendation Suggestions',
    ariaLabel: 'Recommendation Suggestions',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-structured-recommendations.png`,
    description: (
      <>
        Recommendations have been enhanced to allow authors to provided a structured suggestion as part of a
        recommendation. Suggestions allow authors to add actions to create MedicationRequests and ServiceRequests when a
        recommendation is provided.
      </>
    ),
    linkText: 'Recommendation Documentation',
    link: `${process.env.PUBLIC_URL}/documentation/userguide#Adding_Suggestions_to_Recommendations`
  },
  {
    id: 2,
    name: 'Authoring Tool Tutorial',
    ariaLabel: 'Authoring Tool Tutorial',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-tutorial.png`,
    description: (
      <>
        The new CDS Authoring Tool Tutorial provides a walkthrough of creating a simple, but realistic, artifact. The
        tutorial can be used to get an introduction to the Authoring Tool and allows authors to become familiar with the
        features of the tool they may use when creating their own artifacts.
      </>
    ),
    linkText: 'Tutorial',
    link: `${process.env.PUBLIC_URL}/documentation/tutorial`
  },
  {
    id: 3,
    name: 'ONC Tech Forum',
    ariaLabel: 'ONC Tech Forum: Clinical Decision Support Series',
    image: `${process.env.PUBLIC_URL}/assets/images/whats-new-onc-forum.png`,
    description: (
      <>
        CDS Connect was part of the Office of the National Coordinator (ONC) Tech Forum's Clinical Decision Support
        Series in September 2023. The CDS Connect portion of the forum presents an overview of the CDS Connect project,
        the CDS Connect Repository, and the CDS Authoring Tool.
      </>
    ),
    linkText: 'ONC Tech Forum Recording',
    linkExternal: true,
    link: `https://youtu.be/boZT7CHln5g?si=IIZjsqSUkL-p1gZr&t=1789`
  },
  {
    id: 4,
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
    link: `${process.env.PUBLIC_URL}/documentation/userguide#Add_Value_Set`
  }
];

export default whatsNewData;
