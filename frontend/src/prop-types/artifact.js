import { PropTypes } from 'prop-types';

const parametersProps = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};

const expTreeProps = {
  id: PropTypes.string,
  name: PropTypes.string,
  conjunction: PropTypes.boolean,
  path: PropTypes.string,
  returnType: PropTypes.string,
  parameters: PropTypes.arrayOf(parametersProps),
  childInstances: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    returnType: PropTypes.boolean,
    parameters: PropTypes.arrayOf(parametersProps)
  }))
};

const subpopulationsProps = {
  uniqueId: PropTypes.string,
  subpopulationName: PropTypes.string,
  special: PropTypes.boolean,
  special_subpopulationName: PropTypes.string,
  ...expTreeProps
};

const artifactProps = {
  id: PropTypes.string,
  user: PropTypes.string,
  name: PropTypes.string,
  version: PropTypes.string,
  path: PropTypes.string,
  expTreeInclude: expTreeProps,
  expTreeExclude: expTreeProps,
  recommendations: PropTypes.arrayOf(PropTypes.shape({
    uid: PropTypes.string,
    grade: PropTypes.string,
    rationale: PropTypes.string,
    text: PropTypes.string,
    subpopulations: PropTypes.arrayOf(subpopulationsProps)
  })),
  subpopulations: PropTypes.arrayOf(subpopulationsProps),
  booleanParameters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.string
  })),
  errorStatement: PropTypes.shape({
    else: PropTypes.string,
    statements: PropTypes.arrayOf(PropTypes.shape({
      child: PropTypes.object,
      thenClause: PropTypes.string,
      useThenClause: PropTypes.boolean,
      condition: PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.string
      })
    }))
  })
};

export default PropTypes.shape(artifactProps);
