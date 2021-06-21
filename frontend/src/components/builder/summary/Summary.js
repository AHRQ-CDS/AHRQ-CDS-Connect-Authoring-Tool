import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SummaryDetails from './SummaryDetails';
import SummaryHeader from './SummaryHeader';

const Summary = ({ handleOpenArtifactModal }) => {
  const artifact = useSelector(state => state.artifacts.artifact);

  const getSummaryDetailsFromInstance = instance => {
    const isGroup = instance.name === 'And' || instance.name === 'Or';
    return {
      elementId: instance.uniqueId,
      elementName: instance.fields.find(field => field.id === 'element_name').value,
      elementType: isGroup ? 'Group' : instance.name,
      operand: isGroup ? instance.name : null
    };
  };

  const getSummaryDetailsFromTree = tree => {
    return (tree.childInstances || []).map(instance => {
      const details = getSummaryDetailsFromInstance(instance);
      details.childInstances = instance.childInstances ? getSummaryDetailsFromTree(instance) : [];
      return details;
    });
  };

  const getSummaryDetailsFromArtifact = treeName => {
    const tree = artifact[treeName];

    if (treeName === 'expTreeInclude' || treeName === 'expTreeExclude') {
      const details = getSummaryDetailsFromInstance(tree);
      details.childInstances = tree.childInstances ? getSummaryDetailsFromTree(tree) : [];
      return details;
    } else if (treeName === 'recommendations') {
      return {
        recommendations: tree.map(recommendation => ({
          rationale: recommendation.rationale,
          recommendationId: recommendation.uid,
          recommendationText: recommendation.text,
          subpopulations: recommendation.subpopulations.map(subpopulation => subpopulation.subpopulationName)
        }))
      };
    }
  };

  const inclusionsDetails = getSummaryDetailsFromArtifact('expTreeInclude');
  const exclusionsDetails = getSummaryDetailsFromArtifact('expTreeExclude');
  const recommendationsDetails = getSummaryDetailsFromArtifact('recommendations');

  return (
    <>
      <SummaryHeader handleOpenArtifactModal={handleOpenArtifactModal} />
      <SummaryDetails summaryType="expTreeInclude" summaryDetails={inclusionsDetails} />
      <SummaryDetails summaryType="expTreeExclude" summaryDetails={exclusionsDetails} />
      <SummaryDetails summaryType="recommendations" summaryDetails={recommendationsDetails} />
    </>
  );
};

Summary.propTypes = {
  handleOpenArtifactModal: PropTypes.func.isRequired
};

export default Summary;
