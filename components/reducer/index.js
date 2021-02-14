const initialState = {
    email:"",
    phone:"",
};

const reducer = (state=initialState, action) => {
    if(action.type === "CHANGE_EMAIL"){
        return {
            ...state,
            email: action.payload
        }
    }
    if(action.type === "CHANGE_PHONE"){
        return {
            ...state,
            phone: action.payload
        }
    }
    return state;
};

export default reducer;