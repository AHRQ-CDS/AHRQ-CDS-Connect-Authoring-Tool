import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Card, CardContent, IconButton } from '@mui/material';
import { Link as LinkIcon } from '@mui/icons-material';
import clsx from 'clsx';

import { setActiveTab, setScrollToId } from 'actions/navigation';
import { getTabIndexFromName } from 'components/builder/utils';
import { useTextStyles } from 'styles/hooks';
import useStyles from './styles';

const RecommendationCard = ({ depth, label, linkId, recommendation, text }) => {
  const tabIndex = getTabIndexFromName('recommendations');
  const dispatch = useDispatch();
  const textStyles = useTextStyles();
  const styles = useStyles();

  const handleLinkToElement = () => {
    dispatch(setScrollToId(linkId));
    dispatch(setActiveTab(tabIndex));
  };

  return (
    <Card className={clsx(depth % 2 === 1 && styles.summaryCardOdd, depth === 0 && styles.summaryCardRoot)}>
      <CardContent className={styles.summaryCardContent}>
        <div className={styles.summaryCardContentGroup}>
          <div className={styles.summaryCardHeader}>
            <span className={textStyles.bold}>{label}</span>: {text}
          </div>

          {recommendation?.subpopulations.map((subpopulation, index) => (
            <RecommendationCard key={index} depth={1} label="Subpopulation" text={subpopulation} />
          ))}

          {recommendation?.rationale && (
            <RecommendationCard depth={1} label="Rationale" text={recommendation.rationale} />
          )}

          {recommendation?.links.map((link, index) => (
            <RecommendationCard
              key={index}
              depth={1}
              label="Link"
              text={"label: '" + link.label + "', url: '" + link.address + "'"}
            />
          ))}
        </div>

        {recommendation && (
          <IconButton aria-label="link" color="primary" onClick={handleLinkToElement} size="large">
            <LinkIcon />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

RecommendationCard.propTypes = {
  depth: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  linkId: PropTypes.string,
  recommendation: PropTypes.object,
  text: PropTypes.string.isRequired
};

export default RecommendationCard;
