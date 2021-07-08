import axios from 'axios';
import _ from 'lodash';

const fetchModifiers = async ({ artifactId }) => {
  const { data: modifiers } = await axios.get(`${process.env.REACT_APP_API_URL}/modifiers/${artifactId}`);
  const modifierMap = _.keyBy(modifiers, 'id');
  const modifiersByInputType = {};

  modifiers.forEach(modifier => {
    modifier.inputTypes.forEach(inputType => {
      modifiersByInputType[inputType] = (modifiersByInputType[inputType] || []).concat(modifier);
    });
  });

  return { modifierMap, modifiersByInputType };
};

export default fetchModifiers;
