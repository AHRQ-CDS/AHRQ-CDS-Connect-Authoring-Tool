import React from 'react';
import PropTypes from 'prop-types';
import { Lock as LockIcon, NotInterested as NotInterestedIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';

import { useSpacingStyles } from 'styles/hooks';

const ElementOption = ({ option }) => {
  const spacingStyles = useSpacingStyles();

  return (
    <>
      {option.label}
      {option.vsacAuthRequired && (
        <VpnKeyIcon className={spacingStyles.marginLeft} data-testid="vsac-auth-required-icon" fontSize="small" />
      )}
      {option.statementType === 'function' && <span>{` | Function(${option.arguments.length})`}</span>}
      {option.displayReturnType && <span>{` | ${option.displayReturnType}`}</span>}
      {option.hasEmptyList && <NotInterestedIcon className={spacingStyles.marginLeft} fontSize="small" />}
      {option.isVersionLocked && <LockIcon className={spacingStyles.marginLeft} fontSize="small" />}
    </>
  );
};

ElementOption.propTypes = {
  option: PropTypes.object.isRequired
};

export default ElementOption;
