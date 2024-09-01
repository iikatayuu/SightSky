import React, { useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { useAppSelector } from './app/hooks';
import { selectUser } from './features/user/slice';

import Login from './pages/Login/';
import Register from './pages/Register/';
import Dashboard from './pages/Dashboard/';
import Settings from './pages/Settings/';
import Entries from './pages/Entries/';
import Entry from './pages/Entry/';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/default.css';
import './styles/theme.css';

setupIonicReact();

const App: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isLogged = useMemo(() => user.status === 'logged-in', [user.status]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" render={() => isLogged ? <Redirect to="/dashboard" /> : <Login /> } />
          <Route exact path="/register" render={() => isLogged ? <Redirect to="/dashboard" /> : <Register /> } />
          <Route exact path="/dashboard" render={() => !isLogged ? <Redirect to="/" /> : <Dashboard /> } />
          <Route exact path="/settings" render={() => !isLogged ? <Redirect to="/" /> : <Settings /> } />
          <Route exact path="/entries" render={() => !isLogged ? <Redirect to="/" /> : <Entries /> } />
          <Route exact path="/entry/:id" render={() => !isLogged ? <Redirect to="/" /> : <Entry /> } />
          <Route render={() => <Redirect to="/" />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
