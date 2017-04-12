import AuthorList from '../components/AuthorList';
import { shallowRenderComponent } from '../helpers/test_helpers';

// TODO: more clever way to mock data coming out of mongo?

test('AuthorList renders with list of authors', () => {
  const authors = [
    {
      _id: '123',
      name: 'McMaster',
      text: 'Hello world'
    },
    {
      _id: '124',
      name: 'McMaster',
      text: 'Hello world'
    },
    {
      _id: '125',
      name: 'McMaster',
      text: 'Hello world'
    }
  ];

  const component = shallowRenderComponent(AuthorList, {
    data: authors
  });

  expect(component.children()).toHaveLength(authors.length);
});
