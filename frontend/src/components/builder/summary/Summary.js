import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SummaryDetails from './SummaryDetails';
import SummaryHeader from './SummaryHeader';
import { CircularProgress } from '@mui/material';

const Summary = ({ handleSaveArtifact }) => {
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
          subpopulations: recommendation.subpopulations.map(subpopulation => subpopulation.subpopulationName),
          links: recommendation.links.map(link => {
            return { label: link.label, address: link.type + ':<' + link.url + '>' };
          }),
          suggestions: recommendation.suggestions.map(suggestion => ({ label: suggestion.label }))
        }))
      };
    }
  };

  if (artifact == null) {
    return <CircularProgress />;
  }

  const inclusionsDetails = getSummaryDetailsFromArtifact('expTreeInclude');
  const exclusionsDetails = getSummaryDetailsFromArtifact('expTreeExclude');
  const recommendationsDetails = getSummaryDetailsFromArtifact('recommendations');

  return (
    <>
      <SummaryHeader handleSaveArtifact={handleSaveArtifact} />
      <SummaryDetails summaryType="expTreeInclude" summaryDetails={inclusionsDetails} />
      <SummaryDetails summaryType="expTreeExclude" summaryDetails={exclusionsDetails} />
      <SummaryDetails summaryType="recommendations" summaryDetails={recommendationsDetails} />
    </>
  );
};

Summary.propTypes = {
  handleSaveArtifact: PropTypes.func.isRequired
};

export default Summary;
