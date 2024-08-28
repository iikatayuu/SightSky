import React, { useCallback, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { IonPage, IonContent, useIonViewWillEnter, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import Cleave from 'cleave.js/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearUserError, register, selectUser } from '../../features/user/slice';
import { handleInputChange } from '../../utils/input';
import { handleBack } from '../../utils/nav';

import './style.css';

const Register: React.FC = () => {
  const history = useHistory();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [bdate, setBdate] = useState<string>('');

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearUserError());
    dispatch(register({ name, username, password, bdate }));
  }, [name, username, password, bdate]);

  useIonViewWillEnter(() => {
    setName('');
    setUsername('');
    setPassword('');
    setBdate('');
    dispatch(clearUserError());
  }, []);

  return user.redirect ? <Redirect to="/" /> : (
    <IonPage>
      <IonContent fullscreen>
        <div className="register-banner">
          <Link to="/" onClick={handleBack(history)}><IonIcon icon={arrowBack} size="large" /></Link>
        </div>

        <form className="register-form px-5" action="/" method="post" onSubmit={handleSubmit}>
          <h1 className="text-center pt-5">Create New Account</h1>
          <div className="text-center mb-3">
            <Link to="/" onClick={handleBack(history)} className="text-sm text-muted">Already Registered? Log in here.</Link>
          </div>

          <div className="form-group mb-2">
            <label htmlFor="register-name" className="text-sm text-muted">NAME</label>
            <input type="text" id="register-name" name="name" className="form-control" placeholder="Juan Dela Cruz" value={name} onChange={handleInputChange(setName)} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="register-username" className="text-sm text-muted">USERNAME</label>
            <input type="text" id="register-username" name="username" className="form-control" placeholder="jdelacruz123" value={username} onChange={handleInputChange(setUsername)} required />
          </div>

          <div className="form-group mb-2">
            <label htmlFor="register-password" className="text-sm text-muted">PASSWORD</label>
            <input type="password" id="register-password" name="password" className="form-control" placeholder="******" value={password} onChange={handleInputChange(setPassword)} required />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="register-bdate" className="text-sm text-muted">DATE OF BIRTH</label>
            <Cleave id="register-bdate" name="bdate" className="form-control" placeholder="_ _ / _ _ / _ _ _ _" options={{
              date: true,
              datePattern: ['m', 'd', 'Y']
            }} value={bdate} onChange={handleInputChange(setBdate)} required />
          </div>

          { user.error && (
            <div className="alert alert-danger" role="alert">{ user.error }</div>
          )}

          <div className="d-grid gap-2 pb-3">
            <button type="submit" className="btn btn-dark">Sign up</button>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
