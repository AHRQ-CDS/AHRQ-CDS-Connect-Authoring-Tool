import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

import convertToExpression from '../../../utils/artifacts/convertToExpression';
import { getOriginalBaseElement, getAllModifiersOnBaseElementUse } from '../../../utils/baseElements';
import { getReturnType } from '../../../utils/instances';

export default class ExpressionPhrase extends Component {
  getExpressionPhrase = (instance) => {
    const { baseElements } = this.props;
    let returnType = instance.returnType;
    if (!(_.isEmpty(instance.modifiers))) {
      returnType = getReturnType(instance.returnType, instance.modifiers);
    }

    let phraseTemplateInstance = instance;
    let phraseTemplateInstanceIsConjunction = false;
    if (instance.type === 'baseElement') {
      const referenceParameter = instance.parameters.find(param => param.type === 'reference');
      if (referenceParameter) {
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
    let type = (phraseTemplateInstance.type === 'parameter' || phraseTemplateInstance.type === 'externalCqlElement') ?
      phraseTemplateInstance.type : phraseTemplateInstance.name;
    if (phraseTemplateInstance.subpopulationName && type === '') { // Subpopulation type not selected yet
      type = phraseTemplateInstance.id;
    }

    let valueSets = [];
    if (phraseTemplateInstance.parameters[1] && phraseTemplateInstance.parameters[1].valueSets) {
      valueSets = phraseTemplateInstance.parameters[1].valueSets;
    }

    let codes = [];
    if (phraseTemplateInstance.parameters[1] && phraseTemplateInstance.parameters[1].codes) {
      codes = phraseTemplateInstance.parameters[1].codes;
    }

    const otherParameters = phraseTemplateInstance.parameters.filter(param =>
      param.type === 'number' || param.type === 'valueset');

    if (phraseTemplateInstanceIsConjunction) {
      phraseTemplateInstance.childInstances.forEach((child) => {
        let secondPhraseExpressions = [];
        if (child.childInstances && phraseTemplateInstance.usedBy) {
          // Groups expression phrases list the names of the elements within the group. They only go one level deep.
          const childNames = child.childInstances.map(c => ({ name: c.parameters[0].value }));
          secondPhraseExpressions = convertToExpression([], child.name, [], [], child.returnType, [], childNames);
        } else {
          // Individual elements give the full expression phrase in the tooltip
          secondPhraseExpressions = this.getExpressionPhrase(child);
        }
        const phraseArrayAsSentence = secondPhraseExpressions.reduce((acc, currentValue) =>
          `${acc}${currentValue.expressionText === ',' ? '' : ' '}
          ${currentValue.isName ? '"' : ''}${currentValue.expressionText}${currentValue.isName ? '"' : ''}`, '');
        elementNamesInPhrase.push({ name: child.parameters[0].value, tooltipText: phraseArrayAsSentence });
      });
    }

    const isBaseElementAndOr = phraseTemplateInstanceIsConjunction && instance.type === 'baseElement' &&
      (phraseTemplateInstance.name === 'And' || phraseTemplateInstance.name === 'Or');

    let parameterName = null;
    if (type === 'parameter') {
      parameterName = phraseTemplateInstance.name;
    } else if (type === 'externalCqlElement') {
      parameterName = phraseTemplateInstance.parameters.find(param => param.id === 'element_name').value;
    }

    const expressions = convertToExpression(
      modifiers,
      type,
      valueSets,
      codes,
      returnType,
      otherParameters,
      elementNamesInPhrase,
      isBaseElementAndOr,
      parameterName
    );

    return expressions;
  }

  render() {
    const { instance } = this.props;
    const expressions = this.getExpressionPhrase(instance);
    const hasElements = expressions.some(expression => expression.isExpression);

    if (!expressions || !hasElements) { return null; }

    return (
      <div className={this.props.class}>
        <div className="expression-logic">
          {expressions.map((expression, i) => {
            const expressionTextClass = classNames(
              'expression-item expression-text',
              { 'expression-type': expression.isType }
            );

            if (expression.isExpression) {
              return (
                <span key={i}>
                  <span id={`expression-${instance.uniqueId}-${i}`} className="expression-item expression-tag">
                    {expression.expressionText}
                  </span>

                  {expression.tooltipText &&
                    <UncontrolledTooltip target={`expression-${instance.uniqueId}-${i}`} placement='top'>
                      {expression.tooltipText}
                    </UncontrolledTooltip>}
                </span>
              );
            }

            return <span className={expressionTextClass} key={i}>{expression.expressionText}</span>;
          })}
        </div>
      </div>
    );
  }
}

ExpressionPhrase.propTypes = {
  baseElements: PropTypes.array.isRequired,
  class: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
};
