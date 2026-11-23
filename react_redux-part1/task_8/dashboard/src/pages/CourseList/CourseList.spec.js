import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import mockAxios from 'jest-mock-axios';
import CourseList from './CourseList';
import coursesReducer, { fetchCourses } from '../../features/courses/coursesSlice';
import { logout } from '../../features/auth/authSlice';

const coursesData = [
  { id: 1, name: 'ES6', credit: 60 },
  { id: 2, name: 'Webpack', credit: 20 },
  { id: 3, name: 'React', credit: 40 },
];

const createMockStore = () =>
  configureStore({
    reducer: {
      courses: coursesReducer,
    },
  });

const renderWithStore = (store) =>
  render(
    <Provider store={store}>
      <CourseList />
    </Provider>
  );

const loadCourses = async (store) => {
  const promise = store.dispatch(fetchCourses());
  mockAxios.mockResponse({ data: { courses: coursesData } });
  await promise;
};

describe('CourseList', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    mockAxios.reset();
    jest.restoreAllMocks();
  });

  test('displays the courses list fetched from the API', async () => {
    const store = createMockStore();
    await loadCourses(store);

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/courses.json');

    renderWithStore(store);

    expect(screen.getAllByRole('row')).toHaveLength(5);
    expect(screen.getByText('Available courses')).toBeInTheDocument();
    coursesData.forEach(({ name, credit }) => {
      expect(screen.getByText(name)).toBeInTheDocument();
      expect(screen.getByText(String(credit))).toBeInTheDocument();
    });
  });

  test('resets the courses array when the logout action is dispatched', async () => {
    const store = createMockStore();
    await loadCourses(store);
    expect(store.getState().courses.courses).toHaveLength(3);

    store.dispatch(logout());
    renderWithStore(store);

    expect(store.getState().courses.courses).toEqual([]);
    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByText(/no course available yet/i)).toBeInTheDocument();
  });
});
