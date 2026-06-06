// Mock Realm to prevent native module crashes during tests
jest.mock('realm', () => {
  class MockObject {}
  return {
    UpdateMode: {
      Modified: 'modified',
    },
    Object: MockObject,
  };
});
