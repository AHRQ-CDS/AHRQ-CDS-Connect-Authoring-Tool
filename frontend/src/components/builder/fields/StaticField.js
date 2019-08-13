import React from 'react';

/**
 * props are from a templateInstance field object,
 * and a function called UpdateInstance that takes an object with
 * key-value pairs that represents that state of the templateInstance,
 * and a function called Validation that validates what is entered
 */
export default props => (
  <div className="static-field">
    <input
      type="hidden"
      aria-hidden="true"
    />
  </div>
);
