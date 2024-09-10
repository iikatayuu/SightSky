import React, { useCallback, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IonCheckbox, IonContent, IonIcon, IonPage, useIonAlert } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';

import { useAppSelector } from '../../app/hooks';
import { selectEntries } from '../../features/entries/slice';
import { handleBack } from '../../utils/nav';
import { MONTHS } from '../../utils/date';
import { getEntryCompliance, getPDF } from '../../utils/entry';

interface EntryParams {
  id: string;
}

const Entry: React.FC = () => {
  const { id } = useParams() as EntryParams;
  const history = useHistory();
  const entriesState = useAppSelector(selectEntries);
  const [presentAlert] = useIonAlert();
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
    return getEntryCompliance(entry.flightType);
  }, [entry.flightType]);

  const handlePdf = useCallback(async () => {
    const idStr = (parseInt(id) + 1).toString().padStart(4, '0');
    const bytes = await getPDF(idStr, entry);
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const filename = `aircraft-entry-${idStr}.pdf`;
    const writeRes = await Filesystem.writeFile({
      path: filename,
      data: blob,
      directory: Directory.Documents
    });
    
    presentAlert({
      header: 'Generated successfully!',
      message: `Your document can be located at ${writeRes.uri}`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Open file',
          handler: async () => {
            await FileOpener.open({
              filePath: writeRes.uri,
              contentType: 'application/pdf',
              openWithDefault: true
            });
          }
        }
      ]
    });
  }, [entry]);

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
          <textarea className="form-control form-control-dark" rows={5} value={entry.reason} readOnly></textarea>
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
          <button type="button" className="btn btn-success mb-2" onClick={handlePdf}>Download PDF</button>
          <button type="button" className="btn btn-danger" onClick={handleBack(history)}>Back</button>
        </div>
      </IonContent>
    </IonPage>
  )
};

export default Entry;
