import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import Autosuggest from 'react-autosuggest';
import { createTemplateInstance } from './TemplateInstance';

const renderSuggestion = suggestion => (
  <span>
    {suggestion.name}
  </span>
);

const sortTemplatesByRelevancy = searchValue => function (a, b) { // eslint-disable-line func-names
  const aLower = a.name.toLowerCase();
  const bLower = b.name.toLowerCase();
  const queryPosA = aLower.indexOf(searchValue);
  const queryPosB = bLower.indexOf(searchValue);

  if (queryPosA !== queryPosB) {
    return queryPosA - queryPosB;
  }

  return aLower < bLower ? -1 : 1;
};

const flatten = arr => arr.reduce(
  (acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []
);

class ElementTypeahead extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };

    this.inputId = '';
  }

  static propTypes = {
    groups: PropTypes.array.isRequired,
    templateInstances: PropTypes.array.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.inputId = _.uniqueId('element-typeahead-');
  }

  getAllTemplates = () => flatten(this.props.groups.filter(g => !g.suppress).map(
    g => g.entries.filter(element => !element.suppress)))

  getSuggestions = (value) => {
    const inputValue = value.trim().toLowerCase();

    if (!inputValue.length) return [];

    let templates = !this.props.selectedGroup
      ? this.getAllTemplates()
      : this.props.selectedGroup.entries;
    templates = templates.filter(template => template.name.toLowerCase().includes(inputValue));

    return templates.sort(sortTemplatesByRelevancy(inputValue));
  };

  getSuggestionValue = suggestion => suggestion.name;

  getPlaceholderValue = () => (this.props.selectedGroup ?
           `Search ${this.props.selectedGroup.name.toLowerCase().replace(/s\s*$/, '')} elements` :
           'Search all elements');

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    const instance = createTemplateInstance(suggestion);

    this.props.updateTemplateInstances(this.props.templateInstances.concat(instance));
    this.setState({ value: '' });
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      id: this.inputId,
      'aria-label': this.getPlaceholderValue(),
      placeholder: this.getPlaceholderValue(),
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default ElementTypeahead;
