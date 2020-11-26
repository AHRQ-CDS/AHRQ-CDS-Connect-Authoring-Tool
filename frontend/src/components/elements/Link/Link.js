import React from 'react';
import PropTypes from 'prop-types';
import { Link as MuiLink } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

function onVisitExternalLink(e) {
  const warning = 'You are leaving a U.S. Department of Health and Human Service\'s (HHS) Web site and entering a ' +
  'non-government Web site.\n\nHHS cannot attest to the accuracy of information provided by linked sites. Linking ' +
  'to an external Web site does not constitute an endorsement by HHS, or any of its employees, of the sponsors of ' +
  'the site or the products presented on the site. You will be subject to the destination site\'s privacy policy ' +
  'when you leave the HHS site.\n\nPress "OK" to accept.\n\nNote: A new window is about to open. If you have ' +
  'trouble accessing this link, please disable your pop-up blocker.';

  // eslint-disable-next-line no-alert
  if (!window.confirm(warning)) {
    e.preventDefault();
  }
}

const Link = ({ external = false, href, sameTab = false, text }) => {
  if (external) {
    return (
      <MuiLink
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={onVisitExternalLink}
        href={href}
      >
        <span>{text} </span>
        <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
      </MuiLink>
    );
  }

  if (!external && !sameTab) {
    return (
      <MuiLink
        target="_blank"
        rel="nofollow noopener noreferrer"
        href={href}
      >
        {text}
      </MuiLink>
    );
  }

  if (!external && sameTab) return <MuiLink href={href}>{text}</MuiLink>;
};

Link.propTypes = {
  external: PropTypes.bool,
  href: PropTypes.string.isRequired,
  sameTab: PropTypes.bool,
  text: PropTypes.string.isRequired
};

export default Link;
