import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon, LocalHospital as LocalHospitalIcon, Lock as LockIcon } from '@material-ui/icons';

import { CodeSelectModal, VSACAuthenticationModal } from 'components/modals';

export default class CodeEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCodeSelectModal: false,
      showVSACAuthenticationModal: false
    };
  }

  openVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: true });
  }

  closeVSACAuthenticationModal = () => {
    this.setState({ showVSACAuthenticationModal: false });
  }

  openCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: true });
  }

  closeCodeSelectModal = () => {
    this.setState({ showCodeSelectModal: false });
  }

  handleSelectCode = codeData => {
    const { isConcept, updateInstance } = this.props;
    const codeStr = `Code '${codeData.code.replace(/'/g, '\\\'')}' from "${codeData.system}"`;
    const displayStr = `display '${codeData.display}'`;
    const str = isConcept ? `Concept { ${codeStr} } ${displayStr}` : `${codeStr} ${displayStr}`;

    updateInstance({
      value: {
        system: codeData.codeSystem.name,
        uri: codeData.codeSystem.id,
        code: codeData.code,
        display: codeData.display,
        str
      }
    });
  }

  renderCodePicker(openButtonText) {
    const { vsacApiKey } = this.props;
    const { showCodeSelectModal, showVSACAuthenticationModal } = this.state;

    return (
      <>
        {!Boolean(vsacApiKey) ? (
          <Button
            color="primary"
            onClick={this.openVSACAuthenticationModal}
            variant="contained"
            startIcon={<LockIcon />}
          >
            Authenticate VSAC
          </Button>
        ) : (
          <Button
            color="primary"
            onClick={this.openCodeSelectModal}
            startIcon={<LocalHospitalIcon />}
            variant="contained"
          >
            {openButtonText}
          </Button>
        )}

        {showVSACAuthenticationModal && (
          <VSACAuthenticationModal handleCloseModal={this.closeVSACAuthenticationModal} />
        )}

        {showCodeSelectModal && (
          <CodeSelectModal
            handleCloseModal={this.closeCodeSelectModal}
            handleSelectCode={codeData => this.handleSelectCode(codeData)}
          />
        )}
      </>
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
  disableEditing: PropTypes.bool,
  isConcept: PropTypes.bool,
  updateInstance: PropTypes.func.isRequired,
  value: PropTypes.object,
  vsacApiKey: PropTypes.string
};
