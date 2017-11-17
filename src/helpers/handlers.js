const warning = 'You are leaving a U.S. Department of Health and Human Service\'s (HHS) Web site and entering a ' +
  'non-government Web site.\n\nHHS cannot attest to the accuracy of information provided by linked sites. Linking to ' +
  'an external Web site does not constitute an endorsement by HHS, or any of its employees, of the sponsors of the ' +
  'site or the products presented on the site. You will be subject to the destination site\'s privacy policy when you' +
  'leave the HHS site.\n\nPress "OK" to accept.\n\nNote: A new window is about to open. If you have trouble ' +
  'accessing this link, please disable your pop-up blocker.';


/**
 * Prompts the user to confirm that they acknowledge they are navigating to a non-gov site
 * @param {Event} e - The event from the handler that invoked this function
 */
export function onVisitExternalLink(e) {
  // eslint-disable-next-line no-alert
  if (!window.confirm(warning)) {
    e.preventDefault();
  }
}

/**
 * Opens the external link (e.g., signup or feedback) in a new browser window
 * @param {Event} e - The event from the handler that invoked this function
 */
export function onVisitExternalForm(e) {
  const width = window.innerWidth * 0.9 || 800;
  const height = window.innerHeight * 0.9 || 800;
  window.open(findClosest(e.target, 'a').href, '', `width=${width}, height=${height} ,resizable=yes , scrollbars=yes`);
  e.preventDefault();
}

/**
 * Finds the closest element that matches the given tag, walking the parent tree until one is found
 * @param {Node} element - The element to start at
 * @param {String} tagName - The tag name of the element to find
 * @return {Node} - The matched element, or null if none is found
 */
function findClosest(element, tagName) {
  const expectedTagName = tagName.toUpperCase();
  let el = element;
  while (el) {
    if (el.tagName === expectedTagName) {
      return el;
    }

    el = el.parentNode;
  }
  return null;
}
