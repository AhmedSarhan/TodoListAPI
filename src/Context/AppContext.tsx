import React, { createContext, useReducer } from 'react';
import { AppReducer } from './AppReducer';
import { ACTION_TYPES } from './utils/actionTypes';
import { StateType, Message, UserType } from './utils/contextTypes';
const getUserData = () => {
  let userData = localStorage.getItem('user');
  let user;
  if (typeof userData === 'string') {
    user = JSON.parse(userData);
  }
  return user;
};
const initialState = {
  loggedInState: Boolean(localStorage.getItem('user')) as boolean,
  snackBarState: false as boolean,
  messageState: {
    text: '',
    type: 'success',
  },
  reFetchingAvatar: false,
  userState: localStorage.getItem('user')
    ? getUserData()
    : {
        name: '',
        age: 0,
        email: '',
        token: '',
        _id: '',
      },
} as StateType;

export const AppContext = createContext<StateType>(initialState);

const AppContextProvider = (props: any) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  const toggleLogIn = (loggedIn: boolean) => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_LOGIN_STATE,
      payload: loggedIn,
    });
  };
  const toggleSnackBarState = (snackOpen: boolean) => {
    dispatch({
      type: ACTION_TYPES.TOGGLE_SNACK_STATE,
      payload: snackOpen,
    });
  };
  const dispatchAnewMessage = (message: Message) => {
    dispatch({
      type: ACTION_TYPES.NEW_MESSAGE,
      payload: message,
    });
  };
  const setUserData = (user: UserType) => {
    dispatch({
      type: ACTION_TYPES.UPDATE_USER,
      payload: user,
    });
  };
  const refetchAvatarHandler = (data: boolean) => {
    dispatch({
      type: ACTION_TYPES.REFETCH_AVATAR,
      payload: data,
    });
  };
  const contextValues = {
    ...state,
    toggleLogIn,
    toggleSnackBarState,
    dispatchAnewMessage,
    setUserData,
    refetchAvatarHandler,
  };

  return (
    <AppContext.Provider value={contextValues}>
      {props.children}
    </AppContext.Provider>
  );
};
export default AppContextProvider;
