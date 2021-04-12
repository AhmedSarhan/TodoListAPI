import produce from 'immer';
import { ACTION_TYPES } from './utils/actionTypes';
import { Action, StateType } from './utils/contextTypes';

export const AppReducer = (state: StateType, action: Action) =>
  produce(state, draft => {
    switch (action.type) {
      case ACTION_TYPES.TOGGLE_LOGIN_STATE:
        draft.loggedInState = action.payload
        return;
      case ACTION_TYPES.TOGGLE_SNACK_STATE:
        draft.snackBarState = action.payload
        return;
      case ACTION_TYPES.NEW_MESSAGE:
        draft.snackBarState = true;
        draft.messageState = action.payload;
        return;
      case ACTION_TYPES.UPDATE_USER:
        let newUser;
        if (action.payload) {
          //console.log('pay', action.payload)
          newUser = {
            token: action.payload.token,
            name: action.payload.user.name,
            age: action.payload.user.age,
            email: action.payload.user.email,
            _id: action.payload.user._id
          }
          localStorage.setItem('user', JSON.stringify(newUser))
        } else {
          newUser = {
            name: '',
            age: 0,
            email: '',
            token: '',
            _id: ''
          }
        }
        draft.userState = newUser;
        return;
      case ACTION_TYPES.REFETCH_AVATAR:
        draft.reFetchingAvatar = action.payload;
        return;
      default:
        return state;
    }
  })