import _ from 'lodash';
import Recommendations from '../components/builder/Recommendations';
import Recommendation from '../components/builder/Recommendation';
import { fullRenderComponent, createTemplateInstance } from '../helpers/test_helpers';
import { instanceTree, elementGroups } from '../helpers/test_fixtures';

let component;
let componentWithRecs;
let updateRecommendations;
let incrementUniqueIdCounter;
let newRec;
let existingRec;
let existingRecUid = 'rec-100';

beforeEach(() => {
  updateRecommendations = jest.fn();
  incrementUniqueIdCounter = jest.fn();
  existingRec = {
    uid: existingRecUid,
    grade: 'A',
    subpopulations: [],
    text: '',
    rationale: ''
  };
  newRec = {
    uid: 'rec-0',
    grade: 'A',
    subpopulations: [],
    text: '',
    rationale: ''
  };

  const baseProps = {
    updateRecommendations,
    subpopulations: [],
    setActiveTab: jest.fn(),
    uniqueIdCounter: 0,
    incrementUniqueIdCounter
  }

  component = fullRenderComponent(Recommendations, Object.assign({
    recommendations: []
  }, baseProps));

  componentWithRecs = fullRenderComponent(Recommendations, Object.assign({
    recommendations: [ existingRec ]
  }, baseProps));

});

test('has correct base class', () => {
  component.hasClass('recommendations');
});

test('renders a list of recommendations', () => {
  expect(componentWithRecs.find(Recommendation)).toHaveLength(1);
});

test('can change mode type', () => {
  const event = { target: { value: 'newMode' } };
  component.instance().handleModeChange(event);

  expect(component.state().mode).toEqual(event.target.value);
});

test('can add a new recommendation with button', () => {
  component.find('button').at(0).simulate('click');

  expect(incrementUniqueIdCounter).toHaveBeenCalled();
  expect(updateRecommendations).toHaveBeenCalledWith({ recommendations: [newRec] });
});

test('updates a recommendation', () => {
  const newText = 'this is a test';
  componentWithRecs.instance().updateRecommendation(existingRecUid, { text: newText });

  existingRec.text = newText;

  expect(updateRecommendations).toHaveBeenCalledWith({ recommendations: [ existingRec ]});
});

test('deletes a recommendation', () => {
  componentWithRecs.instance().removeRecommendation(existingRecUid);

  expect(updateRecommendations).toHaveBeenCalledWith({ recommendations: [] });
});
