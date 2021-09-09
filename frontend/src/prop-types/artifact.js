import PropTypes from 'prop-types';

const fieldsProps = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number, PropTypes.object])
};

const parametersProps = {
  comment: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  uniqueId: PropTypes.string,
  usedBy: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number, PropTypes.object])
};

const expTreeProps = {
  id: PropTypes.string,
  name: PropTypes.string,
  conjunction: PropTypes.bool,
  path: PropTypes.string,
  returnType: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.shape(fieldsProps)),
  childInstances: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      returnType: PropTypes.string,
      fields: PropTypes.arrayOf(PropTypes.shape(fieldsProps))
    })
  )
};

const subpopulationsProps = {
  uniqueId: PropTypes.string,
  subpopulationName: PropTypes.string,
  special: PropTypes.bool,
  special_subpopulationName: PropTypes.string,
  ...expTreeProps
};

const artifactProps = {
  id: PropTypes.string,
  user: PropTypes.string,
  name: PropTypes.string,
  version: PropTypes.string,
  path: PropTypes.string,
  expTreeInclude: PropTypes.shape(expTreeProps),
  expTreeExclude: PropTypes.shape(expTreeProps),
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
      grade: PropTypes.string,
      rationale: PropTypes.string,
      text: PropTypes.string,
      comment: PropTypes.string,
      subpopulations: PropTypes.arrayOf(PropTypes.shape(subpopulationsProps))
    })
  ),
  subpopulations: PropTypes.arrayOf(PropTypes.shape(subpopulationsProps)),
  parameters: PropTypes.arrayOf(PropTypes.shape(parametersProps)),
  errorStatement: PropTypes.shape({
    else: PropTypes.string,
    statements: PropTypes.arrayOf(
      PropTypes.shape({
        child: PropTypes.object,
        thenClause: PropTypes.string,
        useThenClause: PropTypes.bool,
        condition: PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      })
    )
  }),
  patients: PropTypes.arrayOf(PropTypes.object)
};

export default PropTypes.shape(artifactProps);
