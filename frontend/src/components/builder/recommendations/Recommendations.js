import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';

import Recommendation from './Recommendation';

const deleteRecommendations = produce((recommendations, index) => {
  recommendations.splice(index, 1);
});

const moveRecommendation = produce((recommendations, fromIndex, toIndex) => {
  const recommendation = recommendations[fromIndex];
  recommendations.splice(fromIndex, 1);
  recommendations.splice(toIndex, 0, recommendation);
});

const updateRecommendation = produce((recommendations, index, recommendation) => {
  recommendations[index] = recommendation;
});

const Recommendations = ({ handleUpdateRecommendations }) => {
  const [scrollTo, setScrollTo] = useState(null);
  const artifact = useSelector(state => state.artifacts.artifact);
  const { recommendations, subpopulations } = artifact;

  useEffect(() => {
    if (scrollTo) {
      document.getElementById(scrollTo).scrollIntoView({ behavior: 'smooth' });
      setScrollTo(null);
    }
  }, [scrollTo]);

  const addRecommendation = () => {
    handleUpdateRecommendations(
      recommendations.concat([
        {
          uid: uuidv4(),
          grade: 'A',
          subpopulations: [],
          text: '',
          rationale: '',
          comment: '',
          links: []
        }
      ])
    );
  };

  return (
    <>
      {recommendations.map((recommendation, index) => (
        <div key={recommendation.uid} id={recommendation.uid}>
          <Recommendation
            artifactSubpopulations={subpopulations}
            canMoveDown={index !== recommendations.length - 1}
            canMoveUp={index > 0}
            handleDeleteRecommendation={() =>
              handleUpdateRecommendations(deleteRecommendations(recommendations, index))
            }
            handleMoveRecommendation={direction => {
              handleUpdateRecommendations(
                moveRecommendation(recommendations, index, direction === 'up' ? index - 1 : index + 1)
              );
              setScrollTo(recommendation.uid);
            }}
            handleUpdateRecommendation={updatedRecommendation => {
              handleUpdateRecommendations(updateRecommendation(recommendations, index, updatedRecommendation));
            }}
            recommendation={recommendation}
            setScrollTo={setScrollTo}
          />
        </div>
      ))}

      <Button color="primary" onClick={addRecommendation} variant="contained">
        New recommendation
      </Button>
    </>
  );
};

Recommendations.propTypes = {
  handleUpdateRecommendations: PropTypes.func.isRequired
};

export default Recommendations;
