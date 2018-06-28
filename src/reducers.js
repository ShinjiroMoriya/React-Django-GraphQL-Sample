const initialState = {
  auth: {
    status: false,
    expire: null,
    token: null,
    account: {}
  },
  spaces: {},
  space: {},
  topSpaces: {},
  newsItems: {},
  newsItem: {},
  topNewsItems: {},
  queryLoading: true,
  mutationLoading: false,
  contractSpaces: {},
  messages: []
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return { ...state, ...action };
  }
};

export default AppReducer;
