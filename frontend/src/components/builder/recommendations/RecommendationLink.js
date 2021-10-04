import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { Dropdown } from 'components/elements';
import { useFieldStyles, useFlexStyles } from 'styles/hooks';
import useStyles from './styles';

const linkOptions = [
  { label: 'absolute', value: 'absolute' },
  { label: 'smart', value: 'smart' }
];

const RecommendationLink = ({ handleChangeLink, handleDeleteLink, label, link }) => {
  const fieldStyles = useFieldStyles();
  const flexStyles = useFlexStyles();
  const styles = useStyles();

  return (
    <div className={styles.recommendationInput}>
      <div className={clsx(flexStyles.flex, flexStyles.alignCenter, flexStyles.spaceBetween)}>
        {label}
        <IconButton aria-label="remove link" color="primary" onClick={handleDeleteLink}>
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>

      <div className={clsx(fieldStyles.field, styles.linkInput)}>
        <Dropdown
          className={clsx(fieldStyles.fieldInput, fieldStyles.fieldInputSm)}
          InputProps={{ className: styles.linkDropdown }}
          label="Link Type"
          onChange={event => handleChangeLink('type', event.target.value)}
          options={linkOptions}
          value={link.type}
        />

        <TextField
          className={clsx(fieldStyles.fieldInput, styles.linkText)}
          fullWidth
          label={null}
          multiline
          onChange={event => handleChangeLink('label', event.target.value)}
          placeholder="Link Text"
          value={link.label}
          variant="outlined"
        />
      </div>

      <div className={fieldStyles.field}>
        <TextField
          className={clsx(fieldStyles.fieldInput, styles.linkText)}
          fullWidth
          label={null}
          multiline
          onChange={event => handleChangeLink('url', event.target.value)}
          placeholder="Link Address"
          value={link.url}
          variant="outlined"
        />
      </div>
    </div>
  );
};

RecommendationLink.propTypes = {
  handleChangeLink: PropTypes.func.isRequired,
  handleDeleteLink: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.object.isRequired
};

export default RecommendationLink;
