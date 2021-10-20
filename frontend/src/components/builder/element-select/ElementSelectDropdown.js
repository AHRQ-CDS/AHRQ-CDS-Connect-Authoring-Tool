import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@mui/material';
import { Lock as LockIcon, NotInterested as NotInterestedIcon, VpnKey as VpnKeyIcon } from '@mui/icons-material';
import _ from 'lodash';

import ElementOption from './ElementOption';
import { Dropdown } from 'components/elements';
import { useSpacingStyles } from 'styles/hooks';

const ElementSelectDropdown = ({ handleSelectOption, isDisabled, label, options, showFooter, value }) => {
  const spacingStyles = useSpacingStyles();
  const dropdownId = useMemo(() => _.uniqueId('element-select-'), []);

  return (
    <Dropdown
      id={dropdownId}
      Footer={
        showFooter && (
          <div>
            {options.some(option => option.hasEmptyList) && (
              <div>
                <NotInterestedIcon className={spacingStyles.marginRight} fontSize="small" />
                No named options to select
              </div>
            )}

            {options.some(option => option.isVersionLocked) && (
              <div>
                <LockIcon className={spacingStyles.marginRight} fontSize="small" />
                Version locked
              </div>
            )}

            <div>
              <VpnKeyIcon className={spacingStyles.marginRight} fontSize="small" />
              VSAC authentication required
            </div>
          </div>
        )
      }
      label={label}
      message={isDisabled && <Alert severity="error">Cannot add element when Base Element List in use.</Alert>}
      onChange={event => handleSelectOption(event.target.value)}
      options={isDisabled ? [] : options}
      renderItem={option => <ElementOption option={option} />}
      sx={{ width: '400px' }}
      value={value}
    />
  );
};

ElementSelectDropdown.propTypes = {
  handleSelectOption: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  showFooter: PropTypes.bool,
  value: PropTypes.string.isRequired
};

export default ElementSelectDropdown;
