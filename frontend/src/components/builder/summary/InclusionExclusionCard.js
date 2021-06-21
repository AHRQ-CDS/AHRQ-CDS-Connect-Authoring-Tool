import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Card, CardContent, IconButton } from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';
import clsx from 'clsx';

import { setActiveTab, setScrollToId } from 'actions/navigation';
import { getTabIndexFromName } from 'components/builder/utils';
import { useTextStyles } from 'styles/hooks';
import useStyles from './styles';

const InclusionExclusionCard = ({
  children,
  depth,
  label,
  linkId,
  operand,
  parentOperand,
  showOperand,
  summaryType,
  text
}) => {
  const tabIndex = getTabIndexFromName(summaryType);
  const dispatch = useDispatch();
  const textStyles = useTextStyles();
  const styles = useStyles();

  const handleLinkToElement = () => {
    dispatch(setScrollToId(linkId));
    dispatch(setActiveTab(tabIndex));
  };

  return (
    <>
      {showOperand && (
        <div className={styles.summaryCardOperand}>
          <div className={textStyles.bold}>{parentOperand}</div>
        </div>
      )}

      <Card className={clsx(depth % 2 === 1 && styles.summaryCardOdd)}>
        <CardContent className={styles.summaryCardContent}>
          <div className={styles.summaryCardContentGroup}>
            <div className={styles.summaryCardHeader}>
              <span className={textStyles.bold}>{label}</span>: {text}
            </div>

            {children.map((child, index) => (
              <InclusionExclusionCard
                key={index}
                children={child.childInstances}
                depth={depth + 1}
                label={child.elementType}
                linkId={child.elementId}
                operand={child.operand}
                parentOperand={operand}
                showOperand={index !== 0}
                summaryType={summaryType}
                text={child.elementName}
              />
            ))}
          </div>

          <IconButton onClick={handleLinkToElement}>
            <LinkIcon />
          </IconButton>
        </CardContent>
      </Card>
    </>
  );
};

InclusionExclusionCard.propTypes = {
  children: PropTypes.array.isRequired,
  depth: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  linkId: PropTypes.string,
  operand: PropTypes.string,
  parentOperand: PropTypes.string,
  showOperand: PropTypes.bool,
  summaryType: PropTypes.oneOf(['expTreeInclude', 'expTreeExclude', 'recommendations']).isRequired,
  text: PropTypes.string.isRequired
};

export default InclusionExclusionCard;
