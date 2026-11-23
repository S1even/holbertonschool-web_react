import mockAxios from 'jest-mock-axios';
import { configureStore } from '@reduxjs/toolkit';
import coursesReducer, { fetchCourses } from '../courses/coursesSlice';
import { logout } from '../auth/authSlice';

describe('coursesSlice', () => {
  const initialState = {
    courses: [],
  };

  const coursesData = [
    { id: 1, name: 'ES6', credit: 60 },
    { id: 2, name: 'Webpack', credit: 20 },
    { id: 3, name: 'React', credit: 40 },
  ];

  afterEach(() => {
    mockAxios.reset();
  });

  test('returns the correct initial state by default', () => {
    expect(coursesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('fetches courses data correctly', async () => {
    const store = configureStore({ reducer: { courses: coursesReducer } });

    const promise = store.dispatch(fetchCourses());

    expect(mockAxios.get).toHaveBeenCalledWith('http://localhost:5173/courses.json');
    mockAxios.mockResponse({ data: { courses: coursesData } });
    await promise;

    expect(store.getState().courses.courses).toEqual(coursesData);
  });

  test('updates courses when fetchCourses is fulfilled', () => {
    const state = coursesReducer(initialState, {
      type: fetchCourses.fulfilled.type,
      payload: coursesData,
    });

    expect(state.courses).toEqual(coursesData);
  });

  test('resets courses to an empty array when logout is dispatched', () => {
    const state = coursesReducer({ courses: coursesData }, logout());

    expect(state.courses).toEqual([]);
    expect(state).toEqual(initialState);
  });
});
