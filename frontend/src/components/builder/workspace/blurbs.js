export const blurbs = {
  inclusions: {
    blurb:
      'Specify criteria to identify a target population that should receive a recommendation from this ' +
      'artifact. Examples might include an age range, gender, presence of a certain condition, or lab ' +
      'results within a specific range.',
    link: 'documentation/userguide#Inclusions'
  },
  exclusions: {
    blurb:
      'Specify criteria to identify patients that should be excluded from the target population and, ' +
      'therefore, from receiving a recommendation from this artifact. Examples might include pregnancy ' +
      'status, out of bound lab results, or evidence that the recommended therapy is already being used by ' +
      'the patient.',
    link: 'documentation/userguide#Exclusions'
  },
  subpopulations: {
    blurb:
      'Specify criteria that further segments the target population into subpopulations that should receive ' +
      'more specific recommendations. An example might be splitting the population by risk score so that ' +
      'higher risk patients receive a stronger recommendation than lower risk patients.',
    link: 'documentation/userguide#Subpopulations'
  },
  baseElements: {
    blurb:
      'Specify individual elements that can be re-used in the Inclusions, Exclusions, and Subpopulations, ' +
      'or should standalone as independent expressions in the resulting artifact. An example might be a lab ' +
      'result value that is referenced multiple times throughout the artifact.',
    link: 'documentation/userguide#Base_Elements'
  },
  recommendations: {
    blurb:
      'Specify the text-based recommendations that should be delivered to the clinician when a patient ' +
      'meets the eligible criteria as defined in the artifact. Examples might include recommendations to ' +
      'order a medication, perform a test, or provide the patient educational materials. Only the first ' +
      'eligible recommendation will be delivered.',
    link: 'documentation/userguide#Recommendations'
  },
  parameters: {
    blurb:
      'Specify named parameters that allow individual implementers to control pre-determined aspects of the ' +
      'artifact in their own environment. Examples might include the option to allow lower grade evidence, ' +
      'thresholds at which recommendations should be provided, or customized age ranges.',
    link: 'documentation/userguide#Parameters'
  },
  errors: {
    blurb:
      'Specify error messages that should be delivered under certain exceptional circumstances when the CDS ' +
      'artifact is executed. An example might be to deliver an error message if the patient would normally ' +
      'receive the recommendation but has been excluded.',
    link: 'documentation/userguide#Handle_Errors'
  },
  externalCQL: {
    blurb: 'Reference external CQL libraries that can be used in Inclusions, Exclusions, and Subpopulations.',
    link: 'documentation/userguide#External_CQL'
  }
};
