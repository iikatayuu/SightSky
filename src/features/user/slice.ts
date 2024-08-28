import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { UserPayload } from './types';
import { loginUser, registerUser } from './userAPI';

export interface UserState {
  username: string;
  name: string;
  bdate: string;
  token: string;
  status: 'logging-in' | 'logged-in' | 'logged-out';
  error: string;
  redirect: boolean;
}

export interface LoginParams {
  username: string;
  password: string;
}

const token = localStorage.getItem('token') || '';
const parsedUser = token !== '' ? JSON.parse(atob(token)) as UserPayload : null;
const isLogged = parsedUser !== null;

const initialState: UserState = {
  username: isLogged ? parsedUser.username : '',
  name: isLogged ? parsedUser.name : '',
  bdate: isLogged ? parsedUser.bdate : '',
  token,
  status: isLogged ? 'logged-in' : 'logged-out',
  error: '',
  redirect: false
};

const loginReducer: CaseReducer<UserState, PayloadAction<LoginParams>> = (state, action) => {
  const { username, password } = action.payload;
  const account = loginUser(username, password);
  if (account !== null) {
    const accountStr = btoa(JSON.stringify(account));
    localStorage.setItem('token', accountStr);

    state.username = username;
    state.name = account.name;
    state.bdate = account.bdate;
    state.token = accountStr;
    state.status = 'logged-in';
    state.error = '';
  } else {
    state.error = 'Invalid credentials';
  }
};

const registerReducer: CaseReducer<UserState, PayloadAction<UserPayload>> = (state, action) => {
  const { name, username, password, bdate } = action.payload;
  const success = registerUser(name, username, password, bdate);
  if (!success) state.error = 'Username already exists';
  else state.redirect = true;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: loginReducer,
    register: registerReducer,
    clearUserError: (state) => {
      state.error = '';
    },
    clearRedirect: (state) => {
      state.redirect = false;
    }
  }
});

export const { login, register, clearUserError, clearRedirect } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
