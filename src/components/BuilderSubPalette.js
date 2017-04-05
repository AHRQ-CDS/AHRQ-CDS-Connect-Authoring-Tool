import React from 'react';
import Element from './Element';

export default props => (
  <div aria-labelledby="palette-active-group" className="builder__subpalette">
    {props.selectedGroup.entries.map((element, index) =>
      <Element key={index + element} name={element} />
    )}
  </div>
);
