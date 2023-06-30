import React from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import Prism from 'prism-react-renderer/prism';
import cqlStylingRules from './CqlStylingRules';
import cqlStylingTheme from './CqlStylingTheme';

Prism.languages.cql = cqlStylingRules;

// Component that shows syntax highlighted CQL code
const CqlViewer = ({ code }) => {
  return (
    <Highlight {...defaultProps} code={code} language="cql" theme={cqlStylingTheme}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '10px', marginBottom: '0px' }}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

CqlViewer.propTypes = {
  code: PropTypes.string.isRequired
};

export default CqlViewer;
