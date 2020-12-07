import React from 'react';
import PropTypes from 'prop-types';

import UcumField from 'components/builder/fields/UcumField';

const WithUnit = ({ index, unit, updateAppliedModifier }) => {
  const handleChangeUnit = (event, option) => {
    updateAppliedModifier(index, { unit: option?.value || '' });
  };

  return (
    <div className="modifier">
      <div className="modifier-text">With unit...</div>

      <div className="field-input field-input-md">
        <UcumField handleChangeUnit={handleChangeUnit} unit={unit} />
      </div>
    </div>
  );
};

WithUnit.propTypes = {
  index: PropTypes.number.isRequired,
  unit: PropTypes.string,
  updateAppliedModifier: PropTypes.func.isRequired
};

export default WithUnit;
