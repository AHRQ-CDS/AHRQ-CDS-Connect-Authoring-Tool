import React, { useState } from 'react';
import { Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import { Link } from 'components/elements';
import whatsNewData from './whatsNewData';
import { useSpacingStyles } from 'styles/hooks';
import useStyles from '../styles';

const WhatsNew = () => {
  const styles = useStyles();
  const spacingStyles = useSpacingStyles();
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [whatsNewIndex, setWhatsNewIndex] = useState(0);
  const whatsNewItem = whatsNewData[whatsNewIndex];
  const colors = ['green', 'yellow', 'red', 'gray'];

  function selectIndex(index) {
    setWhatsNewOpen(true);
    setWhatsNewIndex(index);
  }

  return (
    <div className={styles.whatsNew}>
      <div
        role="button"
        tabIndex="0"
        className={clsx(styles.header, styles.whatsNewHeader, spacingStyles.fullBleed)}
        onClick={() => setWhatsNewOpen(!whatsNewOpen)}
        onKeyDown={() => null}
      >
        What's New
        <FontAwesomeIcon icon={whatsNewOpen ? faChevronDown : faChevronRight} />
      </div>

      <div className={styles.whatsNewButtons}>
        {whatsNewData.map((feature, index) => (
          <div className={clsx(styles.whatsNewButtonGroup)} key={index}>
            <Button
              className={clsx(styles.whatsNewButton, styles[colors[index]])}
              onClick={() => selectIndex(index)}
              key={index}
              aria-label={feature.ariaLabel || feature.name}
            >
              <span>{feature.name}</span>
            </Button>
            <div
              className={clsx(styles.triangle, whatsNewIndex === index && whatsNewOpen && styles[colors[index]])}
            ></div>
          </div>
        ))}
      </div>

      {whatsNewOpen && (
        <div className={styles.whatsNewDisplay}>
          {whatsNewItem.image !== '' && (
            <div className={styles.whatsNewDisplayImage}>
              <img src={whatsNewItem.image} alt="" />
            </div>
          )}

          <div>
            <div className={styles.whatsNewName}>{whatsNewItem.name}</div>

            <div>
              <div>{whatsNewItem.description}</div>

              {whatsNewItem.link && whatsNewItem.link !== '' && !whatsNewItem.linkExternal && (
                <Button
                  className={clsx(styles.whatsNewLinkButton, styles[colors[whatsNewIndex]])}
                  href={whatsNewItem.link}
                >
                  {whatsNewItem.linkText}
                </Button>
              )}

              {whatsNewItem.link && whatsNewItem.link !== '' && whatsNewItem.linkExternal && (
                <Button className={clsx(styles.whatsNewLinkButton, styles[colors[whatsNewIndex]])}>
                  <Link external href={whatsNewItem.link} text={whatsNewItem.linkText} />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsNew;
