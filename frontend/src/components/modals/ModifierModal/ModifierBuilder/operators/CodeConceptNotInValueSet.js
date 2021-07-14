import React, { useState } from 'react';
import propTypes from 'prop-types';
import ValuesetEditor from 'components/builder/editors/ValuesetEditor';

const CodeConceptNotInValueset = ({ rule, updateRule }) => {
  const [nameValue, setNameValue] = useState('');
  const [oidValue, setOidValue] = useState('');

  return (
    <ValuesetEditor
      nameValue={nameValue}
      oidValue={oidValue}
      onChange={({ name, oid }) => {
        setNameValue(name);
        setOidValue(oid);
        updateRule({ ...rule, name: name, oid: oid });
      }}
      label="label"
    />
  );
};

CodeConceptNotInValueset.propTypes = {
  rule: propTypes.object.isRequired,
  updateRule: propTypes.func.isRequired
};
export default CodeConceptNotInValueset;
