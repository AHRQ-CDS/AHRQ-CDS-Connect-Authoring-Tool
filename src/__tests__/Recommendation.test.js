import _ from 'lodash';
import Recommendation from '../components/builder/Recommendation';
import { fullRenderComponent, createTemplateInstance } from '../helpers/test_helpers';
import { instanceTree, elementGroups } from '../helpers/test_fixtures';

let component;
let componentWithSubpop;
let rec;
const recUid = 'rec-100';
let recWithSubpop;
let subpop;
const subpopUid = 'sp-100';
let onUpdate;
let updateRecommendations;
let onRemove;
let setActiveTab;

beforeEach(() => {
  onUpdate = jest.fn();
  updateRecommendations = jest.fn();
  onRemove = jest.fn();
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
    name: 'Test Subpopulation 1'
  };
  recWithSubpop = _.cloneDeep(rec);
  recWithSubpop.subpopulations = [ subpop ];

  const baseProps = {
    onUpdate,
    onRemove,
    updateRecommendations,
    setActiveTab,
    subpopulations: [ subpop ]
  }

  component = fullRenderComponent(Recommendation, Object.assign({
    rec,
    recommendations: [ rec ]
  }, baseProps));

  componentWithSubpop = fullRenderComponent(Recommendation, Object.assign({
    rec: recWithSubpop,
    recommendations: [ recWithSubpop ]
  }, baseProps));
});

test('has correct base class', () => {
  component.hasClass('recommendation');
});

test('deletes recommendation', () => {
  component.find('.recommendation__remove button').simulate('click');

  expect(onRemove).toHaveBeenCalledWith(recUid);
});

test('subpopulations don\'t display when none passed in as prop', () => {
  expect(component.find('.recommendation__subpopulations')).toHaveLength(0);
});

test('subpopulations display when passed in as prop', () => {
  expect(componentWithSubpop.find('.recommendation__subpopulations')).toHaveLength(1);
  expect(componentWithSubpop.find('.recommendation__subpopulation-pill')).toHaveLength(1);
});

test('subpopulations display after clicking "Add subpopulation" button', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');

  expect(component.find('.recommendation__subpopulations')).toHaveLength(1);
});

test('properly filters subpopulation options', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');
  component.find('.recommendation__subpopulation-select input').simulate('change');
  expect(component.find('.Select-option')).toHaveLength(1);

  componentWithSubpop.find('.recommendation__subpopulation-select input').simulate('change');
  expect(componentWithSubpop.find('.Select-option')).toHaveLength(0);
});

test('adds subpopulations', () => {
  component.find('button').findWhere(button => button.text() === 'Add subpopulation').simulate('click');
  component.find('.recommendation__subpopulation-select input').simulate('change');
  component.find('.Select-option').at(0).simulate('mouseDown', { button: 0 });

  expect(updateRecommendations).toHaveBeenCalled(); // TODO: toHaveBeenCalledWith
});

test('deletes subpopulations', () => {
  componentWithSubpop.find('.recommendation__subpopulation-pill button').simulate('click');

  expect(updateRecommendations).toHaveBeenCalled(); // TODO: toHaveBeenCalledWith
});

test('opens Subpopulations tab when clicking "New Subpopulation"', () => {
  componentWithSubpop.find('.recommendation__new-subpopulation').simulate('click');

  expect(setActiveTab).toHaveBeenCalledWith(2, 'addBlankSubpopulation');
});

test('adds rationale', () => {
  component.find('.recommendation__add-rationale').simulate('click');

  expect(component.find('.recommendation__rationale')).toHaveLength(1);
});

test('displays rationale when passed in as prop', () => {
  // TODO
});

test('can edit recommendation and rationale text', () => {
  // TODO
});
