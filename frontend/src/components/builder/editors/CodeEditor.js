import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
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
    if (!this.props.vsacApiKey) {
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
        vsacApiKey={this.props.vsacApiKey}
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
      <div className="editor code-editor">
        <div className="form__group">
          <label
            className={classnames("editor-container", {
              condense: this.props.condenseUI,
            })}
            htmlFor={formId}
          >
            <div className="editor-label label">
              {this.props.isConcept ? "Concept:" : "Code:"}
            </div>

            <div className="editor-input-group">
              <div className="">
                {this.props.value != null ? (
                  <div className="code-editor__show">
                    <div className="code-editor-row">
                      <label className="label" htmlFor={formId}>Code:</label>
                      <div>{this.props.value.code}</div>
                    </div>

                    <div className="code-editor-row">
                      <label className="label" htmlFor={formId}>System:</label>
                      <div>{this.props.value.system}</div>
                    </div>

                    <div className="code-editor-row">
                      <label className="label" htmlFor={formId}>System URI:</label>
                      <div>{this.props.value.uri}</div>
                    </div>

                    <div className="code-editor-row">
                      <label className="label" htmlFor={formId}>Display:</label>
                      <div>{this.props.value.display}</div>
                    </div>

                    <div className="code-editor-footer">
                      {this.props.disableEditing ? (
                        <span>
                          Changing {this.props.isConcept ? "concept" : "code"}{" "}
                          value is currently not supported
                        </span>
                      ) : (
                        this.renderCodePicker("Change Code")
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="parameter__item">
                    {this.props.disableEditing ? (
                      <span>
                        Setting {this.props.isConcept ? "concept" : "code"}{" "}
                        value is currently not supported
                      </span>
                    ) : (
                      this.renderCodePicker("Add Code")
                    )}
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>
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
  vsacApiKey: PropTypes.string,
  loginVSACUser: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  codeData: PropTypes.object,
  validateCode: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  condenseUI: PropTypes.bool
};
