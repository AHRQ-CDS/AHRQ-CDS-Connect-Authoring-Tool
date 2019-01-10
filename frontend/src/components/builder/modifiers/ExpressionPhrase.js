import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';

import convertToExpression from '../../../utils/artifacts/convertToExpression';
import Validators from '../../../utils/validators';
import { getOriginalBaseElement, getAllModifiersOnBaseElementUse } from '../../../utils/baseElements';

export default class ExpressionPhrase extends Component {
  validateModifier = (modifier) => {
    let validationWarning = null;

    if (modifier.validator) {
      const validator = Validators[modifier.validator.type];
      const values = modifier.validator.fields.map(v => modifier.values && modifier.values[v]);
      const args = modifier.validator.args ? modifier.validator.args.map(v => modifier.values[v]) : [];
      if (!validator.check(values, args)) {
        validationWarning = validator.warning(modifier.validator.fields, modifier.validator.args);
      }
    }
    return validationWarning;
  }

  // Gets the returnType of the last valid modifier
  getReturnType = (modifiers) => {
    let returnType = this.props.instance.returnType;
    if (modifiers.length === 0) return returnType;

    for (let index = modifiers.length - 1; index >= 0; index--) {
      const modifier = modifiers[index];
      if (this.validateModifier(modifier) === null) {
        returnType = modifier.returnType;
        break;
      }
    }

    return returnType;
  }

  getExpressionPhrase = (instance) => {
    const { baseElements } = this.props;
    let returnType = instance.returnType;
    if (!(_.isEmpty(instance.modifiers))) {
      returnType = this.getReturnType(instance.modifiers);
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
    let type = phraseTemplateInstance.type === 'parameter' ?
      phraseTemplateInstance.type : phraseTemplateInstance.name;
    if (phraseTemplateInstance.subpopulationName) {
      type = 'subpopulation';
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

    const expressions = convertToExpression(
      modifiers,
      type,
      valueSets,
      codes,
      returnType,
      otherParameters,
      elementNamesInPhrase,
      isBaseElementAndOr
    );

    return expressions;
  }

  render() {
    const { instance } = this.props;
    const expressions = this.getExpressionPhrase(instance);

    if (!expressions) { return null; }

    return (
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
    );
  }
}

ExpressionPhrase.propTypes = {
  baseElements: PropTypes.array.isRequired,
  instance: PropTypes.object.isRequired,
};
