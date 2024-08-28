import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, useIonViewWillEnter } from '@ionic/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearRedirect, clearUserError, login, selectUser } from '../../features/user/slice';
import { handleInputChange } from '../../utils/input';

import './style.css';

const Login: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    dispatch(clearUserError());
    dispatch(login({ username, password }));
  }, [username, password]);

  useIonViewWillEnter(() => {
    setUsername('');
    setPassword('');
    dispatch(clearUserError());
    dispatch(clearRedirect());
  });

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-banner">
          <img src="/assets/logo.png" alt="SightSky Logo" width={100} height={100} />
        </div>

        <form className="login-form px-5" action="/" method="post" onSubmit={handleSubmit}>
          <h1 className="text-center pt-5">Login</h1>
          <div className="text-center text-muted mt-2 mb-2">Sign in to continue</div>

          <div className="form-group mb-2">
            <label htmlFor="login-username" className="text-sm text-muted">USERNAME</label>
            <input type="text" id="login-username" name="username" className="form-control" placeholder="jdelacruz123" value={username} onChange={handleInputChange(setUsername)} required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="login-password" className="text-sm text-muted">PASSWORD</label>
            <input type="password" id="login-password" name="password" className="form-control" placeholder="******" value={password} onChange={handleInputChange(setPassword)} required />
          </div>

          { user.error && (
            <div className="alert alert-danger" role="alert">{ user.error }</div>
          )}

          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-dark">Log in</button>
          </div>

          <div className="text-center mt-3 mb-1">
            <a href="#" className="text-sm">Forgot Password?</a>
          </div>

          <div className="text-center pb-3">
            <Link to="/register" className="text-sm">Create An Account</Link>
          </div>
        </form>
      </IonContent>
    </IonPage>
  )
};

export default Login;
