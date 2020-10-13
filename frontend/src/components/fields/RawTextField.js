import React, { forwardRef, memo } from 'react';
import classnames from 'classnames';

export default memo(forwardRef(function RawTextField({
  name,
  label,
  type = 'text',
  placeholder,
  colSize = '1',
  helperText,
  required = false
}, ref) {
  return (
    <div className={classnames('form__group', `flex-col-${colSize}`)}>
      {label &&
        <label htmlFor={name} className={classnames(helperText && 'has-helper-text')}>
          {label}{required && <span className="required">*</span>}:
        </label>
      }

      <div className="input__group">
        <input type={type} name={name} placeholder={placeholder} required={required} ref={ref} />

        {helperText && <div className="helper-text">{helperText}</div>}
      </div>
    </div>
  );
}));
