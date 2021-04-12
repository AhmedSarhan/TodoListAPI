export type Action = {
  type: string;
  payload: any
}
export type Message = {
  text: string;
  type: 'error'
  | 'info'
  | 'success'
  | 'warning'
}
export type UserType = {
  user: {
    name?: string;
    email?: string;
    age?: number;
    _id?: string;
  };
  token?: string;

} | null

type UserState = {
  name?: string;
  email?: string;
  age?: number;
  _id?: string;
  token?: string;

}
export type StateType = {
  loggedInState: boolean;
  toggleLogIn: (val: boolean) => void;
  snackBarState: boolean;
  messageState: Message;
  userState: UserState;
  reFetchingAvatar: boolean;
  toggleSnackBarState: (val: boolean) => void;
  dispatchAnewMessage: (val: Message) => void;
  setUserData: (val: UserType) => void;
  refetchAvatarHandler: (val: boolean) => void;
}