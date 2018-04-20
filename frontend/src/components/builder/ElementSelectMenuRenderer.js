import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FontAwesome from 'react-fontawesome';

const ElementSelectMenuRenderer = ({
  focusedOption,
  focusOption,
  inputValue,
  instancePrefix,
  onFocus,
  onOptionRef,
  onSelect,
  optionClassName,
  optionComponent,
  optionRenderer,
  options,
  removeValue,
  selectValue,
  valueArray,
  valueKey,
}) => {
  const Option = optionComponent;

  return (
    <div>
      {options.map((option, i) => {
        const isSelected = valueArray && valueArray.some(x => x[valueKey] === option[valueKey]);
        const isFocused = option === focusedOption;
        const optionClass = classNames(optionClassName, {
          'Select-option': true,
          'is-selected': isSelected,
          'is-focused': isFocused,
          'is-disabled': option.disabled,
        });

        return (
          <Option
            className={optionClass}
            focusOption={focusOption}
            inputValue={inputValue}
            instancePrefix={instancePrefix}
            isDisabled={option.disabled}
            isFocused={isFocused}
            isSelected={isSelected}
            key={`option-${i}-${option[valueKey]}`}
            onFocus={onFocus}
            onSelect={onSelect}
            option={option}
            optionIndex={i}
            ref={(ref) => { onOptionRef(ref, isFocused); }}
            removeValue={removeValue}
            selectValue={selectValue}
          >
            {optionRenderer(option, i, inputValue)}
          </Option>
        );
      })}

      <div className="Select-option select-notice is-disabled">
        <FontAwesome name="key" /> VSAC authentication required
      </div>
    </div>
  );
};

ElementSelectMenuRenderer.propTypes = {
  focusOption: PropTypes.func,
  focusedOption: PropTypes.object,
  inputValue: PropTypes.string,
  instancePrefix: PropTypes.string,
  onFocus: PropTypes.func,
  onOptionRef: PropTypes.func,
  onSelect: PropTypes.func,
  optionClassName: PropTypes.string,
  optionComponent: PropTypes.func,
  optionRenderer: PropTypes.func,
  options: PropTypes.array,
  removeValue: PropTypes.func,
  selectValue: PropTypes.func,
  valueArray: PropTypes.array,
  valueKey: PropTypes.string,
};

export default ElementSelectMenuRenderer;
