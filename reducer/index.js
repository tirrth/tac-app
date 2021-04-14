const initialState = {
  email: '',
  phone: '',

  profile_info: {},
};

const reducer = (state = initialState, action) => {
  if (action.type === 'CHANGE_EMAIL') {
    return {
      ...state,
      email: action.payload,
    };
  }
  if (action.type === 'CHANGE_PHONE') {
    return {
      ...state,
      phone: action.payload,
    };
  }
  if (action.type === 'CHANGE_PROFILE_INFO') {
    return {
      ...state,
      profile_info: {...state.profile_info, ...action.payload},
    };
  }
  return state;
};

export default reducer;
