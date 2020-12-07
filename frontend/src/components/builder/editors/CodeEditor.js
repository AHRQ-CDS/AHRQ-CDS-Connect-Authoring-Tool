import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

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
            vsacIsAuthenticating={this.props.vsacIsAuthenticating}
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
    const { disableEditing, isConcept, updateInstance, value } = this.props;

    return (
      <div className="editor code-editor">
        <div className="editor-label">{isConcept ? "Concept:" : "Code:"}</div>

        <div className="editor-inputs">
          {value != null ? (
            <Paper className="code-editor-container">
              <div className="close-button">
                <IconButton aria-label="close" color="primary" onClick={() => updateInstance({ value: null })}>
                  <CloseIcon />
                </IconButton>
              </div>

              <div className="code-editor-element">
                <div className="code-editor-element-label">Code:</div>
                <div className="code-editor-element-value">{value.code}</div>
              </div>

              <div className="code-editor-element">
                <div className="code-editor-element-label">System:</div>
                <div className="code-editor-element-value">{value.system}</div>
              </div>

              <div className="code-editor-element">
                <div className="code-editor-element-label">System URI:</div>
                <div className="code-editor-element-value">{value.uri}</div>
              </div>

              {value.display &&
                <div className="code-editor-element">
                  <div className="code-editor-element-label">Display:</div>
                  <div className="code-editor-element-value">{value.display}</div>
                </div>
              }

              <div className="code-editor-footer">
                {disableEditing ? (
                  <div className="warning flex-1">
                    Changing {isConcept ? 'concept' : 'code'} value is currently not supported.
                  </div>
                ) : (
                  this.renderCodePicker('Change Code')
                )}
              </div>
            </Paper>
          ) : (
            <>
              {disableEditing ? (
                <div className="warning flex-1">
                  Setting {isConcept ? 'concept' : 'code'} value is currently not supported.
                </div>
              ) : (
                this.renderCodePicker('Add Code')
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

CodeEditor.propTypes = {
  codeData: PropTypes.object,
  disableEditing: PropTypes.bool,
  isConcept: PropTypes.bool,
  isValidatingCode: PropTypes.bool.isRequired,
  isValidCode: PropTypes.bool,
  loginVSACUser: PropTypes.func.isRequired,
  resetCodeValidation: PropTypes.func.isRequired,
  setVSACAuthStatus: PropTypes.func.isRequired,
  updateInstance: PropTypes.func.isRequired,
  validateCode: PropTypes.func.isRequired,
  value: PropTypes.object,
  vsacApiKey: PropTypes.string,
  vsacIsAuthenticating: PropTypes.bool,
  vsacStatus: PropTypes.string,
  vsacStatusText: PropTypes.string
};
