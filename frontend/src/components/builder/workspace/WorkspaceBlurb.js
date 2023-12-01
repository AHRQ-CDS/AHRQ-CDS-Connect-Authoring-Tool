import React from 'react';
import { HelpLink } from 'components/elements';
import useStyles from './styles';

const WorkspaceBlurb = ({ blurb, link }) => {
  const styles = useStyles();
  return (
    <div className={styles.blurb}>
      {blurb}
      <HelpLink linkPath={link} />
    </div>
  );
};

export default WorkspaceBlurb;
