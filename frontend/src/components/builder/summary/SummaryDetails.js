import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import InclusionExclusionCard from './InclusionExclusionCard';
import RecommendationCard from './RecommendationCard';
import { useSpacingStyles, useTextStyles } from 'styles/hooks';
import useStyles from './styles';

const SummaryDetails = ({ summaryType, summaryDetails }) => {
  const isInclusion = summaryType === 'expTreeInclude';
  const isRecommendation = summaryType === 'recommendations';
  const spacingStyles = useSpacingStyles();
  const textStyles = useTextStyles();
  const styles = useStyles();

  return (
    <div className={styles.summaryDetails}>
      <div className={styles.summaryDetailsHeader}>
        {isRecommendation ? (
          <>
            Perform the following <span className={textStyles.bold}>recommendations</span>:
          </>
        ) : (
          <>
            {isInclusion ? 'If' : 'And if'} the patient {isInclusion ? 'meets ' : "doesn't meet "}
            <span className={textStyles.bold}>{isInclusion ? 'inclusion' : 'exclusion'}</span> conditions:
          </>
        )}
      </div>

      {(summaryDetails.childInstances?.length === 0 || summaryDetails.recommendations?.length === 0) && (
        <div className={clsx(textStyles.subtext, textStyles.italic, spacingStyles.indent)}>
          No {isRecommendation ? summaryType : isInclusion ? 'inclusion conditions' : 'exclusion conditions'}
        </div>
      )}

      {isRecommendation
        ? summaryDetails.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={index}
              depth={0}
              label="Recommendation"
              linkId={recommendation.recommendationId}
              recommendation={recommendation}
              text={recommendation.recommendationText}
            />
          ))
        : summaryDetails.childInstances.map((child, index) => (
            <InclusionExclusionCard
              key={index}
              children={child.childInstances}
              depth={0}
              label={child.elementType}
              linkId={child.elementId}
              operand={child.operand}
              parentOperand={summaryDetails.operand}
              showOperand={index !== 0}
              summaryType={summaryType}
              text={child.elementName || ''}
            />
          ))}
    </div>
  );
};

SummaryDetails.propTypes = {
  summaryType: PropTypes.oneOf(['expTreeInclude', 'expTreeExclude', 'recommendations']).isRequired,
  summaryDetails: PropTypes.object.isRequired
};

export default SummaryDetails;
