import React, { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonCheckbox, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';

import { useAppSelector } from '../../app/hooks';
import { selectEntries } from '../../features/entries/slice';
import { handleBack } from '../../utils/nav';
import { MONTHS } from '../../utils/date';

interface EntryParams {
  id: string;
}

const Entry: React.FC = () => {
  const { id } = useParams() as EntryParams;
  const history = useHistory();
  const entriesState = useAppSelector(selectEntries);
  const entryId = useMemo(() => parseInt(id), [id]);
  const entry = useMemo(() => entriesState.entries[entryId], [entriesState.entries]);
  const dateStr = useMemo(() => {
    const date = new Date(entry.date);
    const month = MONTHS[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }, [entry.date]);

  const timeStr = useMemo(() => {
    const str = entry.time.toString();
    const hours = str.substring(0, 2);
    const minutes = str.substring(str.length > 4 ? 3 : 2);
    return `${hours}${minutes}`;
  }, [entry.time]);

  const entryCompliance = useMemo(() => {
    if (entry.flightType === 'preflight') {
      return 'Complied Pre-Flight Maint. Check in accordance with C172R/S Pre-Flight Maint. Check Form No. AICAT-AMO/AM/002 ISSUE 1 JUNE, REV DATE, 3 APRIL, 2021?';
    }

    if (entry.flightType === 'transit') {
      return 'Complied in accordance with C172R/S Transit Check Form AICAT/AM/014 REV. DATE 0/FEB-2021 ISSUE DATE: FEB 2021?';
    }

    if (entry.flightType === 'postflight') {
      return 'Complied Post-Flight Maint. Check as per C172R/S Post-Flight Maint. Check Form No. AICAT/AMO/AM/003 Issue. 1 June 2020 Rev. 3 April 2021?';
    }
  }, [entry.flightType]);

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
          <h4 className="mb-0">Entry { entryId + 1 }</h4>
        </div>

        <div className="d-flex justify-content-between mx-4 mb-2">
          <span className="me-2">Date:</span>
          <span>{ dateStr }</span>
        </div>

        <div className="d-flex justify-content-between mx-4 mb-2">
          <span className="me-2">Time in Zulu:</span>
          <span>{ timeStr }</span>
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Aircraft Registration:</label>
          <input type="text" className="form-control form-control-dark" value={entry.registration} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Aircraft Type:</label>
          <input type="text" className="form-control form-control-dark" value={entry.type} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Nature of Flight:</label>
          <input type="text" className="form-control form-control-dark" value={entry.nature} readOnly />
        </div>

        <div className="form-group mx-4 my-3">
          <IonCheckbox labelPlacement="end" mode="md" checked={entry.compliance} disabled>
            <span className="ion-checkbox-text">{ entryCompliance }</span>
          </IonCheckbox>
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Reason:</label>
          <input type="text" className="form-control form-control-dark" value={entry.reason} readOnly />
        </div>

        <div className="row mx-4 mb-2">
          <div className="form-group col-6 ps-0">
            <label>Left Fuel Tank:</label>
            <input type="text" className="form-control form-control-dark" value={entry.leftFuel + ' gal.'} readOnly />
          </div>

          <div className="form-group col-6 pe-0">
            <label>Right Fuel Tank:</label>
            <input type="text" className="form-control form-control-dark" value={entry.rightFuel + ' gal.'} readOnly />
          </div>
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Total Fuel Serviced:</label>
          <input type="text" className="form-control form-control-dark" value={entry.totalFuel + ' gal.'} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Next Inspection:</label>
          <input type="text" className="form-control form-control-dark" value={entry.nextins} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Tach Time Due:</label>
          <input type="text" className="form-control form-control-dark" value={entry.tachTime} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>AMO No.:</label>
          <input type="text" className="form-control form-control-dark" value={entry.amoNo} readOnly />
        </div>

        <div className="form-group mx-4 mb-2">
          <label>Aircraft Mechanic:</label>
          <input type="text" className="form-control form-control-dark" value={entry.mechanic} readOnly />
        </div>

        <div className="mx-4 mb-3">
          <div className="mb-1"><strong className="me-2">Signature:</strong></div>
          <img src={entry.signature} alt="Mechanic's signature" />
        </div>

        <div className="d-grid grid-2 mx-4 mb-5">
          <button type="button" className="btn btn-danger" onClick={handleBack(history)}>Back</button>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Entry;
