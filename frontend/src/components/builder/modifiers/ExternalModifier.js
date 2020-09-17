import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

/* eslint-disable jsx-a11y/label-has-for */
export default props => (
  <div className="external-modifier form__group">
    <label>
      {props.name} <FontAwesomeIcon icon={faBook} />
    </label>
  </div>
);
