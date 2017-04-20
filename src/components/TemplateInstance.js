import React, { Component, PropTypes } from 'react';
import IntegerParameter from './parameters/IntegerParameter';

class TemplateInstance extends Component {
  static propTypes = {
    templateInstance: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  renderParams() {

    // todo: each parameter type should probably have its own component
    return (
      <div>
      {this.props.templateInstance.parameters.map((element, index) =>
        <div key={element.id}>
          <IntegerParameter parameter={element}/>
        </div>
      )}
      </div>
    )
  }

  render() {
    return (
      <div className="element">
        {this.props.templateInstance.name}
        {this.renderParams()}
      </div>
    );
  }
}

export default TemplateInstance;