import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import convertToExpression from 'utils/artifacts/convertToExpression';
import { getOriginalBaseElement, getAllModifiersOnBaseElementUse } from 'utils/baseElements';
import { getReturnType, getFieldWithId, getFieldWithType } from 'utils/instances';
import { ElementExpressionPhrase } from 'components/elements/ElementCard';

export default class ExpressionPhrase extends Component {
  getExpressionPhrase = instance => {
    const { baseElements } = this.props;
    let returnType = instance.returnType;
    if (!_.isEmpty(instance.modifiers)) {
      returnType = getReturnType(instance.returnType, instance.modifiers);
    }

    let phraseTemplateInstance = instance;
    let phraseTemplateInstanceIsConjunction = false;
    if (instance.type === 'baseElement') {
      const referenceField = getFieldWithType(instance.fields, 'reference');
      if (referenceField) {
        // Use the original base element as a base, but include all modifiers from derivative uses.
        const originalBaseElement = _.cloneDeep(getOriginalBaseElement(instance, baseElements));
        const modifiers = getAllModifiersOnBaseElementUse(instance, baseElements, []);
        originalBaseElement.modifiers = modifiers;
        phraseTemplateInstance = originalBaseElement;
      }
    }

    if (phraseTemplateInstance.conjunction) {
      phraseTemplateInstanceIsConjunction = true;
    }

    let modifiers = phraseTemplateInstance.modifiers || [];
    const elementNamesInPhrase = [];
    if (instance.type === 'baseElement') {
      const baseElementModifiers = instance.modifiers || [];
      modifiers = modifiers.concat(baseElementModifiers);
    }
    let type = phraseTemplateInstance.type === 'parameter' ? phraseTemplateInstance.type : phraseTemplateInstance.name;

    if (phraseTemplateInstance.type === 'externalCqlElement') {
      type = phraseTemplateInstance.template === 'GenericStatement' ? 'externalCqlStatement' : 'externalCqlFunction';
    }

    if (phraseTemplateInstance.subpopulationName && type === '') {
      // Subpopulation type not selected yet
      type = phraseTemplateInstance.id;
    }

    let valueSets = [];
    const phraseTemplateInstanceVsacField = getFieldWithType(phraseTemplateInstance.fields, '_vsac');
    if (phraseTemplateInstanceVsacField && phraseTemplateInstanceVsacField.valueSets) {
      valueSets = phraseTemplateInstanceVsacField.valueSets;
    }

    let codes = [];
    if (phraseTemplateInstanceVsacField && phraseTemplateInstanceVsacField.codes) {
      codes = phraseTemplateInstanceVsacField.codes;
    }

    const otherFields = phraseTemplateInstance.fields.filter(
      field => field.type === 'number' || field.type === 'valueset'
    );

    if (phraseTemplateInstanceIsConjunction) {
      phraseTemplateInstance.childInstances.forEach(child => {
        let secondPhraseExpressions = [];
        if (child.childInstances && phraseTemplateInstance.usedBy) {
          // Groups expression phrases list the names of the elements within the group. They only go one level deep.
          const childNames = child.childInstances.map(c => ({ name: getFieldWithId(c.fields, 'element_name').value }));
          secondPhraseExpressions = convertToExpression([], child.name, [], [], child.returnType, [], childNames);
        } else {
          // Individual elements give the full expression phrase in the tooltip
          secondPhraseExpressions = this.getExpressionPhrase(child);
        }
        const phraseArrayAsSentence = secondPhraseExpressions.reduce(
          (acc, currentValue) =>
            `${acc}${currentValue.label === ',' ? '' : ' '}
          ${currentValue.isName ? '"' : ''}${currentValue.label}${currentValue.isName ? '"' : ''}`,
          ''
        );
        const nameField = getFieldWithId(child.fields, 'element_name');
        elementNamesInPhrase.push({ name: nameField.value, tooltipText: phraseArrayAsSentence });
      });
    }

    const isBaseElementAndOr =
      phraseTemplateInstanceIsConjunction &&
      instance.type === 'baseElement' &&
      (phraseTemplateInstance.name === 'And' || phraseTemplateInstance.name === 'Or');

    let referenceElementName = null;
    if (type === 'parameter') {
      referenceElementName = phraseTemplateInstance.name;
    } else if (type === 'externalCqlStatement' || type === 'externalCqlFunction') {
      referenceElementName = getFieldWithId(phraseTemplateInstance.fields, 'externalCqlReference').value.element;
    }

    const expressions = convertToExpression(
      modifiers,
      type,
      valueSets,
      codes,
      returnType,
      otherFields,
      elementNamesInPhrase,
      isBaseElementAndOr,
      referenceElementName
    );

    return expressions;
  };

  render() {
    const { instance, closed, inModal } = this.props;
    const expressions = this.getExpressionPhrase(instance);
    const hasElements = expressions.some(expression => expression.isTag);

    if (!expressions || !hasElements) {
      return null;
    }

    return <ElementExpressionPhrase closed={closed} expressions={expressions} inModal={inModal} />;
  }
}

ExpressionPhrase.propTypes = {
  baseElements: PropTypes.array.isRequired,
  instance: PropTypes.object.isRequired
};
