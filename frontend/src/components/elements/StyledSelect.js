/* eslint-disable no-nested-ternary */

import React from 'react';
import Select from 'react-select';

export default function StyledSelect({ styles = {}, ...props }) {
  return (
    <Select
      {...props}
      styles={{
        ...styles,
        control: (provided, { isFocused }) => ({
          ...provided,
          boxShadow: 'inset 0 1px 2px 0 rgba(21, 21, 21, 0.1)',
          minHeight: '50px',
          border: '0.1em solid lightgray',

          '&:hover': {
            borderColor: isFocused ? '#6b8eb6' : '#b3b3b3',
          },

          '@media (max-width: 1439px) and (min-width: 600px)': {
            minHeight: '36px'
          }
        }),
        input: provided => ({
          ...provided,
          input: {
            height: 'auto',
            boxShadow: 'none',
            border: 0,
            marginLeft: 0
          }
        }),
        menu: provided => ({
          ...provided,
          marginTop: '4px',
          marginBottom: '4px'
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? '#6b8eb6'
            : state.isFocused
            ? '#f8f8f8'
            : 'transparent'
        }),
        dropdownIndicator: provided => ({
          ...provided,
          padding: '7px 8px'
        })
      }}
    />
  );
}
