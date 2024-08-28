import { UserPayload } from './types';

const accountsStr = localStorage.getItem('accounts');
const accounts: UserPayload[] = accountsStr !== null ? JSON.parse(atob(accountsStr)) : [];

export function loginUser (username: string, password: string) {
  let loggedAcc = null;
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (account.username === username) {
      if (account.password === password) loggedAcc = account;
      break;
    }
  }

  return loggedAcc;
}

export function registerUser (name: string, username: string, password: string, bdate: string) {
  const found = accounts.some(account => account.username === username);
  if (!found) {
    accounts.push({ name, username, password, bdate });
    localStorage.setItem('accounts', btoa(JSON.stringify(accounts)));
  }

  return !found;
}
