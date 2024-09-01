import React from 'react';
import { useHistory } from 'react-router';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import { useAppSelector } from '../../app/hooks';
import { selectEntries } from '../../features/entries/slice';
import CardEntry from '../../components/CardEntry';
import { handleBack } from '../../utils/nav';

const Entries: React.FC = () => {
  const history = useHistory();
  const entries = useAppSelector(selectEntries);

  return (
    <IonPage>
      <IonContent>
        <div className="dashboard-bg"></div>

        <div className="d-flex align-items-center px-4 pt-4 mb-3">
          <button type="button" className="btn btn-dark-2 p-1 pb-0 me-2" onClick={handleBack(history)}>
            <IonIcon icon={arrowBack} size="small" />
          </button>

          <div onClick={handleBack(history)}>Back</div>
        </div>

        <div className="d-flex align-items-center justify-content-between mx-4 mt-4 mb-3">
          <h4 className="mb-0">Past entries</h4>
        </div>

        <div className="d-flex flex-wrap mx-4 mb-3">
          {
            [...entries.entries].reverse().map((entry, i) => (
              <CardEntry id={(entries.entries.length - i - 1).toString()} entry={entry} key={i} />
            ))
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Entries;
