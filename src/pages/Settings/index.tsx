import React, { useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonIcon } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import { useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/slice';
import { handleBack } from '../../utils/nav';

import signout from '../../assets/sign-out.svg';
import './style.css';

const Settings: React.FC = () => {
  const history = useHistory();
  const user = useAppSelector(selectUser);

  const handleLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/';
  }, []);

  return (
    <IonPage>
      <IonContent>
        <div className="settings-content">
          <div className="d-flex align-items-center px-5 pt-5 mb-3">
            <button type="button" className="btn btn-dark-2 p-1 pb-0 me-2" onClick={handleBack(history)}>
              <IonIcon icon={arrowBack} size="small" />
            </button>

            <div onClick={handleBack(history)}>Back</div>
          </div>

          <div className="d-flex align-items-center mx-5 mb-5">
            <img src="/assets/user.jpg" alt={user.name} width={32} height={32} className="rounded me-3" />
            <h2 className="settings-name mb-0">{ user.name }</h2>
          </div>

          <h4 className="text-sm mx-5 mb-4">About this Application</h4>
          <p className="text-center text-sm mx-5 mb-4">SightSky is a cutting-edge digital logbook manual designed to revolutionize flight operations and maintenance documentation. Created by the group 3 of AE-403, aeronautical engineering students from Holy Angel University, this app is the product of a research project entitled "SightSky: A Versatile Digital Logbook Manual for Flight Operations and Maintenance."</p>
          <p className="text-center text-sm mx-5">Targeted specifically for Alpha Aviation Group, SightSky offers a comprehensive, user-friendly platform that addresses the unique needs of aviation professionals. The app provides an all-in-one solution for recording, tracking, and managing critical flight and maintenance data, ensuring accuracy, efficiency, and compliance. With its intuitive interface and versatile features, SightSky simplifies complex processes, making it an indispensable tool for modern aviation teams at Alpha Aviation Group.</p>
        </div>

        <div className="settings-footer d-flex align-items-center justify-content-between mx-5">
          <Link to="/" onClick={handleLogout} className="d-flex align-items-center text-light">
            <IonIcon src={signout} className="me-3 rotate-90" /> Sign Out
          </Link>

          <a href="#" className="text-gray-2 text-sm">Privacy & Policy</a>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Settings;
