import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CodeSelectModal from '../CodeSelectModal';
import VSACAuthenticationModal from '../VSACAuthenticationModal';

export default class CodeEditor extends Component {
  handleCodeAdded = ({ system, uri, code, display }) => {
    let str;
    if (this.props.isConcept) {
      str = `Concept { Code '${code.replace(/'/g, '\\\'')}' from "${system}" } display '${display}'`;
    } else {
      str = `Code '${code.replace(/'/g, '\\\'')}' from "${system}" display '${display}'`;
    }

    this.props.updateInstance({ value: { system, uri, code, display, str } });
  }

  renderCodePicker(openButtonText) {
    if (this.props.vsacFHIRCredentials.username == null) {
      return (
        <div id="vsac-controls">
          <VSACAuthenticationModal
            loginVSACUser={this.props.loginVSACUser}
            setVSACAuthStatus={this.props.setVSACAuthStatus}
            vsacStatus={this.props.vsacStatus}
            vsacStatusText={this.props.vsacStatusText}
          />
        </div>
      );
    }

    return (
      <CodeSelectModal
        className="element-select__modal"
        template={this.props.templateInstance}
        vsacFHIRCredentials={this.props.vsacFHIRCredentials}
        isValidatingCode={this.props.isValidatingCode}
        isValidCode={this.props.isValidCode}
        codeData={this.props.codeData}
        validateCode={this.props.validateCode}
        resetCodeValidation={this.props.resetCodeValidation}
        addToParameter={this.handleCodeAdded}
        labels={{
          openButtonText,
          closeButtonText: 'Close'
        }}
      />
    );
  }

  render() {
    const formId = _.uniqueId('editor-');

    return (
      <div className="code-editor">
        {this.props.value != null ?
          <div className="code-editor__show">
            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={formId}>System:</label>
              </div>

              <div className="col-9">
                {this.props.value.system}
              </div>
            </div>

            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={formId}>System URI:</label>
              </div>

              <div className="col-9">
                {this.props.value.uri}
              </div>
            </div>

            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={formId}>Code:</label>
              </div>

              <div className="col-9">
                {this.props.value.code}
              </div>
            </div>

            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                <label htmlFor={formId}>Display:</label>
              </div>

              <div className="col-9">
                {this.props.value.display}
              </div>
            </div>

            <div className="parameter__item row">
              <div className="col-3 bold align-right">
                {/* intentionally blank */}
              </div>
              <div className="col-9">
                {this.props.disableEditing ?
                  <span>Changing {this.props.isConcept ? 'concept' : 'code'} value is currently not supported</span>
                  :
                  this.renderCodePicker('Change Code')
                }
              </div>
            </div>
          </div>
        :
          <div className="parameter__item row">
            <div className="col-3 bold align-right">
              {this.props.disableEditing ?
                ''
                :
                this.props.label
              }
            </div>

            <div className="col-9">
              {this.props.disableEditing ?
                <span>Setting {this.props.isConcept ? 'concept' : 'code'} value is currently not supported</span>
                :
                this.renderCodePicker('Add Code')
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

CodeEditor.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.object,
  isConcept: PropTypes.bool,
  disableEditing: PropTypes.bool,
  updateInstance: PropTypes.func.isRequired,
  vsacFHIRCredentials: PropTypes.object,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired
};
