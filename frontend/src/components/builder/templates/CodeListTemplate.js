import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { useFieldStyles } from 'styles/hooks';

const CodeListTemplate = ({ codes, handleDeleteCode }) => {
  const fieldStyles = useFieldStyles();

  return (
    <div id="code-list-template">
      {codes.map((code, index) => (
        <div key={`code-${index}`} className={fieldStyles.field}>
          <div className={clsx(fieldStyles.fieldLabel, fieldStyles.fieldLabelTall)} id="code-label">
            Code{codes.length > 1 && ` ${index + 1}`}:
          </div>

          <div className={fieldStyles.fieldDetails}>
            <div className={fieldStyles.fieldDisplay}>
              {`${code.codeSystem.name} (${code.code}) ${code.display === '' ? '' : ` - ${code.display}`}`}
            </div>

            <div className={clsx(fieldStyles.fieldButtons, fieldStyles.fieldButtonsAlignCenter)}>
              <IconButton
                aria-label={`delete code ${code.codeSystem.name} (${code.code})`}
                color="primary"
                onClick={() => handleDeleteCode(code)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

CodeListTemplate.propTypes = {
  codes: PropTypes.array.isRequired,
  handleDeleteCode: PropTypes.func.isRequired
};

export default CodeListTemplate;
