import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Stack, TextField } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

import { Dropdown } from 'components/elements';

const linkOptions = [
  { label: 'absolute', value: 'absolute' },
  { label: 'smart', value: 'smart' }
];

const RecommendationLink = ({ handleChangeLink, handleDeleteLink, label, link }) => (
  <Stack my={2}>
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      {label}
      <IconButton aria-label="remove link" color="primary" onClick={handleDeleteLink}>
        <ClearIcon fontSize="small" />
      </IconButton>
    </Stack>

    <Stack direction="row">
      <Dropdown
        label="Link Type"
        onChange={event => handleChangeLink('type', event.target.value)}
        options={linkOptions}
        sx={{ marginRight: '10px', width: '200px' }}
        value={link.type}
      />

      <TextField
        fullWidth
        hiddenLabel
        multiline
        onChange={event => handleChangeLink('label', event.target.value)}
        placeholder="Link Text"
        value={link.label}
      />
    </Stack>

    <Stack direction="row">
      <TextField
        fullWidth
        hiddenLabel
        multiline
        onChange={event => handleChangeLink('url', event.target.value)}
        placeholder="Link Address"
        value={link.url}
      />
    </Stack>
  </Stack>
);

RecommendationLink.propTypes = {
  handleChangeLink: PropTypes.func.isRequired,
  handleDeleteLink: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.object.isRequired
};

export default RecommendationLink;
