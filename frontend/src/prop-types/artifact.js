import { PropTypes } from 'prop-types';

const artifactProps = {
  uniqueId: PropTypes.string.isRequired, // remove
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  expTreeInclude: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    conjunction: PropTypes.boolean.isRequired,
    returnType: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string
    })),
    childInstances: PropTypes.array.isRequired
  }).isRequired,
  expTreeExclude: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    conjunction: PropTypes.boolean.isRequired,
    returnType: PropTypes.string.isRequired,
    parameters: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      value: PropTypes.string
    })),
    childInstances: PropTypes.array.isRequired
  }).isRequired,
  recommendations: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  subpopulations: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  booleanParameters: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  errorStatement: PropTypes.shape({

  }).isRequired,
  user: PropTypes.string.isRequired
};

export default PropTypes.shape(artifactProps);
