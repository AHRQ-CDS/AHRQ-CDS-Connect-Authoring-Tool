import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { onVisitExternalLink } from '../../utils/handlers';

const ExternalLink = ({ href, text }) => (
  <a
    target="_blank"
    rel="nofollow noopener noreferrer"
    onClick={onVisitExternalLink}
    href={href}
  >
    <span>{text} </span>
    <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
  </a>
);

export default ExternalLink;
