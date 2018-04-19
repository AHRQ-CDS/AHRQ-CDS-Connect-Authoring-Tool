import _ from 'lodash';
import Recommendation from '../../../components/builder/Recommendation';
import { fullRenderComponent } from '../../../utils/test_helpers';
import { elementGroups } from '../../../utils/test_fixtures';

let component;
let componentFilledIn;
let rec;
const recUid = 'rec-100';
let completedRec;
const recText = 'This is a recommendation.';
const rationaleText = 'This is the rationale.';
let subpop;
const subpopUid = 'sp-100';
let onUpdate;
let updateRecommendations;
let onRemove;
let updateSubpopulations;
let setActiveTab;
let baseProps;

beforeEach(() => {
  onUpdate = jest.fn();
  updateRecommendations = jest.fn();
  onRemove = jest.fn();
  updateSubpopulations = jest.fn();
  setActiveTab = jest.fn();
  rec = {
    uid: recUid,
    grade: 'A',
    subpopulations: [],
    text: '',
    rationale: ''
  };
  subpop = {
    uniqueId: subpopUid,
    subpopulationName: 'Test Subpopulation 1'
  };
  completedRec = _.cloneDeep(rec);
  completedRec.text = recText;
  completedRec.rationale = rationaleText;
  completedRec.subpopulations = [subpop];

  baseProps = {
    onUpdate,
    onRemove,
    updateRecommendations,
    updateSubpopulations,
    setActiveTab,
    templates: elementGroups
  };

  component = fullRenderComponent(Recommendation, {
    rec,
    artifact: {
      subpopulations: [subpop],
      recommendations: [rec]
    },
    ...baseProps
  });

  componentFilledIn = fullRenderComponent(Recommendation, {
    rec: completedRec,
    artifact: {
      subpopulations: [subpop],
      recommendations: [completedRec]
    },
    ...baseProps
  });
});

test('has correct base class', () => {
  component.hasClass('recommendation');
});

test('deletes recommendation', () => {
  component.find('.recommendation__remove').simulate('click');

  expect(onRemove).toHaveBeenCalledWith(recUid);
});

test('displays recommendation text when passed in as prop', () => {
  expect(componentFilledIn.find('.card-element__textarea').at(0).node.value).toEqual(recText);
});

test('adds rationale', () => {
  component.find('.recommendation__add-rationale').simulate('click');

  expect(component.find('.recommendation__rationale')).toHaveLength(1);
});

test('displays rationale when passed in as prop', () => {
  expect(componentFilledIn.find('.recommendation__rationale')).toHaveLength(1);
  expect(componentFilledIn.find('.recommendation__rationale .card-element__textarea').node.value)
    .toEqual(rationaleText);
});

test('can edit recommendation text', () => {
  const newText = 'This is a test.';
  const recTextarea = componentFilledIn.find('.card-element__textarea[name="text"]');

  recTextarea.simulate('change', { target: { name: 'text', value: newText } });

  expect(onUpdate).toHaveBeenCalledWith(recUid, { text: newText });
  expect(componentFilledIn.state('text')).toEqual(newText);
});

test('can edit rationale text', () => {
  const newText = 'This is a test.';
  const rationaleTextarea = componentFilledIn.find('.recommendation__rationale .card-element__textarea');

  rationaleTextarea.simulate('change', { target: { name: 'rationale', value: newText } });

  expect(onUpdate).toHaveBeenCalledWith(recUid, { rationale: newText });
  expect(componentFilledIn.state('rationale')).toEqual(newText);
});

test('subpopulations don\'t display when none passed in as prop', () => {
  expect(component.find('.recommendation__subpopulations')).toHaveLength(0);
});

test('subpopulations display when passed in as prop', () => {
  expect(componentFilledIn.find('.recommendation__subpopulations')).toHaveLength(1);
  expect(componentFilledIn.find('.recommendation__subpopulation-pill')).toHaveLength(1);
});

test('subpopulations display after clicking "Add subpopulation" button', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');

  expect(component.find('.recommendation__subpopulations')).toHaveLength(1);
});

test('properly filters subpopulation options', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');
  component.find('.recommendation__subpopulation-select input').simulate('change');
  expect(component.find('.Select-option')).toHaveLength(1);

  componentFilledIn.find('.recommendation__subpopulation-select input').simulate('change');
  expect(componentFilledIn.find('.Select-option')).toHaveLength(0);
});

test('applies subpopulations', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');
  component.find('.recommendation__subpopulation-select input').simulate('change');
  component.find('.Select-option').at(0).simulate('mouseDown', { button: 0 });

  const updatedRec = _.cloneDeep(rec);
  updatedRec.subpopulations = [subpop];

  expect(updateRecommendations).toHaveBeenCalledWith([updatedRec]);
});

test('deletes subpopulations', () => {
  componentFilledIn.find('.recommendation__subpopulation-pill button').simulate('click');

  const updatedRec = _.cloneDeep(completedRec);
  updatedRec.subpopulations = [];

  expect(updateRecommendations).toHaveBeenCalledWith([updatedRec]);
});

test('opens Subpopulations tab when clicking "New Subpopulation"', () => {
  componentFilledIn.find('.recommendation__new-subpopulation').simulate('click');

  expect(setActiveTab).toHaveBeenCalledWith(2);
});

test('applies special subpopulations correctly', () => {
  const specialSubpop = _.cloneDeep(subpop);
  specialSubpop.special = true;
  specialSubpop.special_subpopulationName = 'TestSubpop1';

  const specialProps = _.cloneDeep(baseProps);
  specialProps.artifact = { subpopulations: [specialSubpop], recommendations: [rec] };

  const recComponent = fullRenderComponent(Recommendation, {
    rec,
    ...specialProps
  });

  recComponent.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');
  recComponent.find('.recommendation__subpopulation-select input').simulate('change');
  recComponent.find('.Select-option').at(0).simulate('mouseDown', { button: 0 });

  const updatedRec = _.cloneDeep(rec);
  updatedRec.subpopulations = [specialSubpop];

  expect(updateRecommendations).toHaveBeenCalledWith([updatedRec]);
});
