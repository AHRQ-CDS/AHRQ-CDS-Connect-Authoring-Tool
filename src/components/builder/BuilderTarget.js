import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import TemplateInstance from './TemplateInstance';
import ElementSelect from './ElementSelect';
import elementGroups from '../../data/templates';
import Config from '../../../config';

const API_BASE = Config.api.baseUrl;

function showPresets(mongoId) {
  return axios.get(`${API_BASE}/expressions/group/${mongoId}`);
}

class BuilderTarget extends Component {
  static propTypes = {
    templateInstances: PropTypes.array.isRequired,
    updateSingleElement: PropTypes.func.isRequired,
    updateTemplateInstances: PropTypes.func.isRequired
  }

  deleteInstance(uniqueId) {
    const newElements = this.props.templateInstances;
    const index = newElements.findIndex(element => element.uniqueId === uniqueId);

    if (index > -1) {
      newElements.splice(index, 1);
      this.props.updateTemplateInstances(newElements);
    }
  }

  saveInstance(uniqueId) {
    const elementList = this.props.templateInstances;
    const index = elementList.findIndex(element => element.uniqueId === uniqueId);
    if (index > -1) {
      const element = elementList[index];
      console.log(element);
      axios.post(`${API_BASE}/expressions`, element)
        .then((result) => {
          console.log('Done');
        })
        .catch((error) => {
          console.log('Fail');
        });
    }
  }

  render() {
    return (
      <section className="builder__canvas">
        {
          this.props.templateInstances.map(
            (element, index) =>
              <TemplateInstance
                key={element.uniqueId}
                templateInstance={element}
                otherInstances={this.props.templateInstances}
                deleteInstance={this.deleteInstance.bind(this)}
                saveInstance={this.saveInstance.bind(this)}
                showPresets={showPresets.bind(this)}
                updateSingleElement={this.props.updateSingleElement} />
            )
        }
        <ElementSelect
          categories={elementGroups}
          templateInstances={this.props.templateInstances}
          updateTemplateInstances={this.props.updateTemplateInstances}
          />
      </section>
    );
  }
}

export default BuilderTarget;
