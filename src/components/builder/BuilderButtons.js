import React from 'react';

export default (props) => {
  props.val.modifiers = [{template: 'C3F.ConceptValue'},
                         {template: 'C3F.MostRecent'},
                         {template: 'C3F.Verified'},
                         {template: 'C3F.LookBack', value: [7]}];
  return (
    <div>
      {"Buttons/Dropdowns will go here. For now, hard-coded values were just applied"}
    </div>
  );
};
