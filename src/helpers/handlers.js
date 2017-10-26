const warning = 'You are leaving a U.S. Department of Health and Human Service\'s (HHS) Web site and entering a ' +
  'non-government Web site.\n\nHHS cannot attest to the accuracy of information provided by linked sites. Linking to ' +
  'an external Web site does not constitute an endorsement by HHS, or any of its employees, of the sponsors of the ' +
  'site or the products presented on the site. You will be subject to the destination site\'s privacy policy when you' +
  'leave the HHS site.\n\nPress "OK" to accept.\n\nNote: A new window is about to open. If you have trouble ' +
  'accessing this link, please disable your pop-up blocker.';

// Disabling prefer-default-export rule because we expect other functions to be exported in the future.
// eslint-disable-next-line import/prefer-default-export
export function onVisitExternalLink(e) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(warning)) {
    e.preventDefault();
  }
}
