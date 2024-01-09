import React from 'react';
import PropTypes from 'prop-types';
import { themes } from 'prism-react-renderer';
import CodeViewer from 'components/elements/CqlViewer/CodeViewer';

// Overwrite types used in FHIR JSON to match the CqlStylingTheme
const theme = {
  ...themes.oneLight,
  plain: {
    color: '#32333a',
    backgroundColor: '#f9f9f9'
  },
  styles: [
    {
      types: ['property'],
      style: {
        color: '#407ab2'
      }
    },
    {
      types: ['string'],
      style: {
        color: '#65964b'
      }
    },
    {
      types: ['number'],
      style: {
        color: '#c04c40'
      }
    },
    {
      types: ['boolean'],
      style: {
        color: '#c04c40'
      }
    }
  ]
};

const PatientJSONDataViewer = ({ data }) => {
  return <CodeViewer code={JSON.stringify(data, null, 2)} language="jsx" theme={theme} />;
};

PatientJSONDataViewer.propTypes = {
  data: PropTypes.object.isRequired
};

export default PatientJSONDataViewer;
