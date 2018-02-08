import Recommendations from '../../components/builder/Recommendations';
import Recommendation from '../../components/builder/Recommendation';
import { fullRenderComponent } from '../../utils/test_helpers';

let component;
let componentWithRecs;
let updateRecommendations;
let existingRec;
const existingRecUid = 'rec-100';

beforeEach(() => {
  updateRecommendations = jest.fn();
  existingRec = {
    uid: existingRecUid,
    grade: 'A',
    subpopulations: [],
    text: '',
    rationale: ''
  };

  const baseProps = {
    updateRecommendations,
    setActiveTab: jest.fn()
  };

  component = fullRenderComponent(Recommendations, {
    artifact: {
      subpopulations: [],
      recommendations: []
    },
    ...baseProps
  });

  componentWithRecs = fullRenderComponent(Recommendations, {
    artifact: {
      subpopulations: [],
      recommendations: [existingRec]
    },
    ...baseProps
  });
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

  expect(updateRecommendations).toHaveBeenLastCalledWith([
    expect.objectContaining({ grade: 'A', subpopulations: [], text: '', rationale: '' })
  ]);
});

test('updates a recommendation', () => {
  const newText = 'this is a test';
  componentWithRecs.instance().updateRecommendation(existingRecUid, { text: newText });

  existingRec.text = newText;

  expect(updateRecommendations).toHaveBeenCalledWith([existingRec]);
});

test('deletes a recommendation', () => {
  componentWithRecs.instance().removeRecommendation(existingRecUid);

  expect(updateRecommendations).toHaveBeenCalledWith([]);
});
