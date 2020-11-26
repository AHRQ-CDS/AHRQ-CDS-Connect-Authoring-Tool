import { findClosest } from './find';

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
