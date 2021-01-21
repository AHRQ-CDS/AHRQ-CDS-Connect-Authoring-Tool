import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useLatest } from 'react-use';
import { Button, IconButton, TextField } from '@material-ui/core';
import { ArrowBackIos as ArrowBackIosIcon } from '@material-ui/icons';

import useStyles from '../styles';

const ValueSetSelectModalHeader = ({ goBack, onSearch, readOnly, selectedValueSet }) => {
  const [searchValue, setSearchValue] = useState('');
  const searchValueRef = useLatest(searchValue);
  const styles = useStyles();

  const handleChange = useCallback(event => {
    setSearchValue(event.target.value);
  }, []);

  const handleSearch = useCallback(
    event => {
      event.preventDefault();
      onSearch(searchValueRef.current);
    },
    [searchValueRef, onSearch]
  );

  return (
    <div className={styles.searchContainer}>
      {!readOnly && selectedValueSet && (
        <div>
          <IconButton aria-label="Back" className={styles.iconButton} color="primary" onClick={goBack}>
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      <form onSubmit={handleSearch} className={styles.form}>
        <TextField
          className={styles.formInput}
          fullWidth
          InputProps={{ readOnly: readOnly || Boolean(selectedValueSet) }}
          label={selectedValueSet ? 'Value set' : 'Value set keyword'}
          onChange={handleChange}
          value={selectedValueSet ? `${selectedValueSet.name} (${selectedValueSet.oid})` : searchValue}
          variant="outlined"
        />

        {!readOnly && !selectedValueSet && (
          <Button type="submit" color="primary" variant="contained">
            Search
          </Button>
        )}
      </form>
    </div>
  );
};

ValueSetSelectModalHeader.propTypes = {
  goBack: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  selectedValueSet: PropTypes.shape({ name: PropTypes.string.isRequired, oid: PropTypes.string.isRequired })
};

export default ValueSetSelectModalHeader;
