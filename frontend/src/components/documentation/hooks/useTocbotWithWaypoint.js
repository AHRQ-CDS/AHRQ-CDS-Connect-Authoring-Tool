import { useEffect } from 'react';
import tocbot from 'tocbot';

const onWaypointEnter = ({ previousPosition }) => {
  if (previousPosition !== 'below') return;

  const documentation = document.querySelector('.documentation');
  const toc = document.querySelector('.toc');

  toc.classList.add('at-bottom');
  toc.classList.add('is-position-absolute');
  documentation.classList.add('is-position-relative');
};

const onWaypointLeave = ({ currentPosition }) => {
  if (currentPosition === 'above') return;

  const documentation = document.querySelector('.documentation');
  const toc = document.querySelector('.toc');

  toc.classList.remove('at-bottom');
  toc.classList.remove('is-position-absolute');
  documentation.classList.remove('is-position-relative');
};

const useTocbotWithWaypoint = () => {
  useEffect(() => {
    tocbot.init({
      tocSelector: '.toc',
      contentSelector: '.toc-wrapper',
      headingSelector: 'h1, h2, h3, h4',
      positionFixedSelector: '.toc',
      collapseDepth: 0 // 0 collapses, 6 expands all
    });

    return () => {
      tocbot.destroy();
    };
  }, []);

  return {
    onWaypointEnter,
    onWaypointLeave
  };
};

export default useTocbotWithWaypoint;
