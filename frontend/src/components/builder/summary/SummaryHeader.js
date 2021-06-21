import React from 'react';
import PropTypes from 'prop-types';
import { useSpacingStyles } from 'styles/hooks';
import { useSelector } from 'react-redux';
import { renderDate } from 'utils/dates';
import { Card, CardContent, IconButton } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import useStyles from './styles';

const SummaryHeader = ({ handleOpenArtifactModal }) => {
  const artifact = useSelector(state => state.artifacts.artifact);
  const spacingStyles = useSpacingStyles();
  const styles = useStyles();

  const artifactMetaData = [
    { label: 'Artifact', value: artifact.name },
    { label: 'Version', value: artifact.version },
    { label: 'Last Changed', value: renderDate(artifact.updatedAt) },
    { label: 'Date Created', value: renderDate(artifact.createdAt) }
  ];

  return (
    <Card className={spacingStyles.fullBleed}>
      <CardContent className={styles.summaryHeader}>
        <div className={styles.metaData}>
          {artifactMetaData.map((metaDataItem, index) => (
            <div key={index}>
              <span className={styles.metaDataLabel}>{metaDataItem.label}:</span>
              <span>{metaDataItem.value}</span>
            </div>
          ))}
        </div>

        <IconButton onClick={handleOpenArtifactModal}>
          <EditIcon fontSize="small" />
        </IconButton>
      </CardContent>
    </Card>
  );
};

SummaryHeader.propTypes = {
  handleOpenArtifactModal: PropTypes.func.isRequired
};

export default SummaryHeader;
