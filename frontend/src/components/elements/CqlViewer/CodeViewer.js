import React from 'react';
import PropTypes from 'prop-types';
import { Highlight } from 'prism-react-renderer';

const CodeViewer = ({ code, language, theme }) => {
  return (
    <Highlight code={code} language={language} theme={theme}>
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

CodeViewer.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired
};

export default CodeViewer;
