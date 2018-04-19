import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export default class CodeEditor extends Component {
  assignValue(evt) {
    let system = null;
    let uri = null;
    let code = null;
    let display = null;

    switch (evt.target.name) {
      case 'system':
        system = _.get(evt, 'target.value', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'uri':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(evt, 'target.value', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'code':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(evt, 'target.value', null);
        display = _.get(this, 'props.value.display', null);
        break;
      case 'display':
        system = _.get(this, 'props.value.system', null);
        uri = _.get(this, 'props.value.uri', null);
        code = _.get(this, 'props.value.code', null);
        display = _.get(evt, 'target.value', null);
        break;
      default:
        break;
    }

    if (system || uri || code || display) {
      let str;
      if (this.props.isConcept) {
        str = `Concept { Code '${code}' from "${system}" } display '${display}'`;
      } else {
        str = `Code '${code}' from "${system}" display '${display}'`;
      }

      return { system, uri, code, display, str };
    }

    return null;
  }

  render() {
    const { id, name, type, value, updateInstance } = this.props;
    const formId = _.uniqueId('parameter-');

    return (
      <div className="form__group">
        <label htmlFor={formId}>
          <form>
            <label htmlFor={formId}>System:</label>
            <input
              id={id}
              name="system"
              type="text"
              value={ _.get(value, 'system', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>System URI:</label>
            <input
              id={id}
              name="uri"
              type="text"
              value={ _.get(value, 'uri', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Code:</label>
            <input
              id={id}
              name="code"
              type="text"
              value={ _.get(value, 'code', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
            <br/>
            <label htmlFor={formId}>Display:</label>
            <input
              id={id}
              name="display"
              type="text"
              value={ _.get(value, 'display', null) || '' }
              onChange={ (e) => {
                updateInstance({ name, type, value: this.assignValue(e) });
              }}
            />
          </form>
        </label>
      </div>
    );
  }
}

CodeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.object,
  isConcept: PropTypes.bool,
  updateInstance: PropTypes.func.isRequired
};
