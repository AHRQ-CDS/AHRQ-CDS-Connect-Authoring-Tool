import React from 'react';
import PropTypes from 'prop-types';
import { Prism } from 'prism-react-renderer';
import CodeViewer from './CodeViewer';
import cqlStylingRules from './CqlStylingRules';
import cqlStylingTheme from './CqlStylingTheme';

Prism.languages.cql = cqlStylingRules;

// Component that shows syntax highlighted CQL code
const CqlViewer = ({ code }) => {
  return <CodeViewer code={code} language={'cql'} theme={cqlStylingTheme} />;
};

CqlViewer.propTypes = {
  code: PropTypes.string.isRequired
};

export default CqlViewer;
