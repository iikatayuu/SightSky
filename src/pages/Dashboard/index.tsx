import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonPage, IonContent, IonIcon, IonFab, IonFabButton, IonModal, IonSelect, IonSelectOption, IonCheckbox } from '@ionic/react';
import { CapacitorHttp } from '@capacitor/core';
import { add, person, settings } from 'ionicons/icons';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import Cleave from 'cleave.js/react';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/user/slice';
import { addEntry, addNextIn, addRegistration, selectEntries } from '../../features/entries/slice';
import type { FlightType } from '../../features/entries/types';
import SelectText from '../../components/SelectText/';
import CardEntry from '../../components/CardEntry/';

import './style.css';
import { handleCheckboxChange, handleInputChange, handleInputNumberChange, handleSelectChange } from '../../utils/input';

const Dashboard: React.FC = () => {
  const user = useAppSelector(selectUser);
  const entries = useAppSelector(selectEntries);
  const dispatch = useAppDispatch();
  const [greetings, setGreetings] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(30);
  const [flightType, setFlightType] = useState<FlightType | null>(null);
  const [entryName, setEntryName] = useState<string>('');
  const [entryCompliance, setEntryCompliance] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [registration, setRegistration] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [nature, setNature] = useState<string>('');
  const [complianceYes, setComplianceYes] = useState<boolean>(false);
  const [complianceNo, setComplianceNo] = useState<boolean>(false);
  const [compliance, setCompliance] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [leftFuel, setLeftFuel] = useState<number>(0);
  const [rightFuel, setRightFuel] = useState<number>(0);
  const [totalFuel, setTotalFuel] = useState<number>(0);
  const [nextIns, setNextIns] = useState<string>('');
  const [tachTime, setTachTime] = useState<string>('');
  const [amoNo, setAmoNo] = useState<string>('');
  const [mechanic, setMechanic] = useState<string>('');
  const [error, setError] = useState<string>('');
  const canvas = React.createRef<ReactSketchCanvasRef>();
  const modalFab = useRef<HTMLIonModalElement>(null);
  const modalEntry = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    const date = new Date();
    const hrs = date.getHours();

    if (hrs >= 0 && hrs < 12) setGreetings('Good Morning!');
    if (hrs >= 12 && hrs < 18) setGreetings('Good Afternoon!');
    if (hrs >= 18 && hrs < 24) setGreetings('Good Evening!');
  }, []);

  useEffect(() => {
    CapacitorHttp.get({
      url: `https://api.open-meteo.com/v1/forecast?latitude=10.6464165&longitude=122.9193268&current=temperature_2m&timezone=Asia%2FSingapore&forecast_days=1`,
      headers: {
        Accept: 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) return;
      setTemperature(res.data.current.temperature_2m);
    })
  }, []);

  useEffect(() => {
    if (flightType === null) {
      setEntryName('');
    }

    if (flightType === 'preflight') {
      setEntryName('New Pre-Flight Maint. Entry');
      setEntryCompliance('Complied Pre-Flight Maint. Check in accordance with C172R/S Pre-Flight Maint. Check Form No. AICAT-AMO/AM/002 ISSUE 1 JUNE, REV DATE, 3 APRIL, 2021?');
    }

    if (flightType === 'transit') {
      setEntryName('New Transit Flight Maint. Entry');
      setEntryCompliance('Complied in accordance with C172R/S Transit Check Form AICAT/AM/014 REV. DATE 0/FEB-2021 ISSUE DATE: FEB 2021?');
    }

    if (flightType === 'postflight') {
      setEntryName('New Post-Flight Maint. Entry');
      setEntryCompliance('Complied Post-Flight Maint. Check as per C172R/S Post-Flight Maint. Check Form No. AICAT/AMO/AM/003 Issue. 1 June 2020 Rev. 3 April 2021?');
    }
  }, [flightType]);

  useEffect(() => {
    if (complianceYes) {
      setCompliance('1');
      setComplianceNo(false);
    }

    if (complianceNo) {
      setCompliance('0');
      setComplianceYes(false);
    }
  }, [complianceYes, complianceNo]);

  const handleEntryClick = useCallback((type: FlightType) => (e: React.MouseEvent) => {
    setFlightType(type);
    modalEntry.current?.present();

    setDate('');
    setRegistration('');
    setType('');
    setNature('');
    setComplianceYes(false);
    setComplianceNo(false);
    setCompliance('');
    setReason('');
    setTime('');
    setLeftFuel(0);
    setRightFuel(0);
    setTotalFuel(0);
    setNextIns('');
    setTachTime('');
    setAmoNo('');
    setMechanic('');
    setError('');
  }, []);

  const handleEntryClose = useCallback(() => {
    modalEntry.current?.dismiss();
  }, []);

  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    if (flightType === null) return;

    const signature = await canvas.current?.exportImage('png');
    const sketchingTime = await canvas.current?.getSketchingTime() ?? 0;
    if (signature && sketchingTime > 0) {
      dispatch(addRegistration(registration));
      dispatch(addNextIn(nextIns));
      dispatch(addEntry({
        flightType,
        submitter: user.username,
        date,
        registration,
        type,
        nature,
        compliance: compliance === '1',
        reason,
        time,
        leftFuel,
        rightFuel,
        totalFuel,
        nextins: nextIns,
        tachTime,
        amoNo,
        mechanic,
        signature
      }));

      modalEntry.current?.dismiss();
      modalFab.current?.dismiss();
    } else {
      setError('Please sign');
    }
  };

  return (
    <IonPage id="dashboard">
      <IonContent>
        <div className="dashboard-bg"></div>

        <div className="d-flex align-items-center mx-4 mt-4 mb-3">
          <div className="flex-fill">
            <div className="text-sm mb-1">{ greetings }</div>
            <h4 className="dashboard-name">{ user.name }</h4>
          </div>

          <img src="/assets/user.jpg" alt={user.name} width={48} height={48} className="rounded-circle" />
        </div>

        <div className="card card-dark mx-4 mb-4">
          <div className="card-body d-flex align-items-center">
            <div className="flex-fill">
              <h2 className="dashboard-temp mb-0">{ temperature }&deg;C</h2>
              <div className="text-sm">Today</div>
            </div>

            <img src="/assets/cloudy.png" alt="Current weather" height={50} />
          </div>
        </div>

        <h2 className="mx-4 mb-4 text-sm">Welcome!</h2>
        <div className="row mx-4 mb-5">
          <Link to="/profile" className="col-6 ps-0 pe-1">
            <div className="card card-dark">
              <div className="card-body d-flex align-items-center px-2 py-1">
                <IonIcon icon={person} className="me-2 icon-xl" />
                <div className="flex-fill text-center">Profile</div>
              </div>
            </div>
          </Link>

          <Link to="/settings" className="col-6 ps-1 pe-0">
            <div className="card card-gray">
              <div className="card-body d-flex align-items-center px-2 py-1">
                <IonIcon icon={settings} className="me-2 icon-xl" />
                <div className="flex-fill text-center">Settings</div>
              </div>
            </div>
           </Link>
        </div>

        <hr className="mx-4" />

        <div className="d-flex align-items-center justify-content-between mx-4 mb-3">
          <h4 className="text-sm mb-0">Past entries</h4>
          <Link to="/entries" className="text-light text-underline text-sm">See All</Link>
        </div>

        <div className="d-flex flex-wrap mx-4 mb-3">
          {
            [...entries.entries].reverse().slice(0, 6).map((entry, i) => (
              <CardEntry entry={entry} key={i} />
            ))
          }
        </div>

        <IonFab slot="fixed" vertical="bottom" horizontal="center" className="mb-2">
          <IonFabButton id="dashboard-fab">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonModal ref={modalFab} trigger="dashboard-fab" initialBreakpoint={0.25}>
          <IonContent>
            <div className="d-grid gap-2 px-5 py-4">
              <button type="button" className="btn btn-dark-3" onClick={handleEntryClick('preflight')}>New Pre-Flight Maint. Entry</button>
              <button type="button" className="btn btn-dark-3" onClick={handleEntryClick('transit')}>New Transit Flight Maint. Entry</button>
              <button type="button" className="btn btn-dark-3" onClick={handleEntryClick('postflight')}>New Post-Flight Maint. Entry</button>
            </div>
          </IonContent>
        </IonModal>

        <IonModal ref={modalEntry} canDismiss>
          <IonContent>
            <div className="d-grid gap-2 px-4 py-3">
              <button type="button" className="btn btn-dark-3">{entryName}</button>
            </div>

            <form action="/" method="post" className="px-4" onSubmit={handleEntrySubmit}>
              <div className="form-group mb-3">
                <label htmlFor="entry-date" className="mb-2">Date</label>
                <Cleave id="entry-date" name="date" className="form-control form-control-dark" placeholder="_ _ / _ _ / _ _ _ _" options={{
                  date: true,
                  datePattern: ['m', 'd', 'Y']
                }} value={date} onChange={handleInputChange(setDate)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-registration" className="mb-2">Aircraft Registration</label>
                <SelectText id="entry-registration" name="registration" className="form-control form-control-dark" value={registration} options={entries.registrations} onValueChange={setRegistration} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-type" className="mb-2">Aircraft Type</label>
                <IonSelect id="entry-type" name="type" className="form-control form-control-dark py-0" value={type} interface="action-sheet" onIonChange={handleSelectChange(setType)}>
                  <IonSelectOption value="">- Select -</IonSelectOption>
                  <IonSelectOption>Cessna 172R/S</IonSelectOption>
                </IonSelect>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-nature" className="mb-2">Nature of Flight</label>
                <IonSelect id="entry-nature" name="nature" className="form-control form-control-dark py-0" value={nature} interface="action-sheet" onIonChange={handleSelectChange(setNature)}>
                  <IonSelectOption value="">- Select -</IonSelectOption>
                  <IonSelectOption>Test</IonSelectOption>
                  <IonSelectOption>Ferry</IonSelectOption>
                  <IonSelectOption>Training</IonSelectOption>
                  <IonSelectOption>ADG/MX flight</IonSelectOption>
                </IonSelect>
              </div>

              <div className="form-group mt-5 mb-3">
                <label htmlFor="entry-compliance" className="mb-2">
                  <p className="entry-compliance-text text-center">{ entryCompliance }</p>
                </label>
                <div><IonCheckbox labelPlacement="end" mode="md" checked={compliance === '1'} onIonChange={handleCheckboxChange(setComplianceYes)}>YES</IonCheckbox></div>
                <div><IonCheckbox labelPlacement="end" mode="md" checked={compliance === '0'} onIonChange={handleCheckboxChange(setComplianceNo)}>NO</IonCheckbox></div>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-reason" className="mb-2">Reason</label>
                <textarea id="entry-reason" name="reason" className="form-control form-control-dark" rows={5} value={reason} onChange={handleInputChange(setReason)} required></textarea>
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-time" className="mb-2">Time in Zulu</label>
                <Cleave id="entry-time" name="time" className="form-control form-control-dark" options={{
                  time: true,
                  timePattern: ['h', 'm']
                }} value={time} onChange={handleInputChange(setTime)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-left-fuel" className="mb-2">Left Fuel Tank Measured</label>
                <input type="number" id="entry-left-fuel" name="left-fuel" className="form-control form-control-dark" placeholder="gal." value={leftFuel || ''} onChange={handleInputNumberChange(setLeftFuel)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-right-fuel" className="mb-2">Right Fuel Tank Measured</label>
                <input type="number" id="entry-right-fuel" name="right-fuel" className="form-control form-control-dark" placeholder="gal." value={rightFuel || ''} onChange={handleInputNumberChange(setRightFuel)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-total-fuel" className="mb-2">Total Fuel Serviced</label>
                <input type="number" id="entry-total-fuel" name="total-fuel" className="form-control form-control-dark" placeholder="gal." value={totalFuel || ''} onChange={handleInputNumberChange(setTotalFuel)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-nextins" className="mb-2">Next Inspection</label>
                <SelectText id="entry-nextins" name="nextins" className="form-control form-control-dark" value={nextIns} options={entries.nextIns} onValueChange={setNextIns} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-tach" className="mb-2">Tach Time Due</label>
                <input type="text" id="entry-tach" name="tach" className="form-control form-control-dark" value={tachTime} onChange={handleInputChange(setTachTime)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-amo" className="mb-2">AMO No.</label>
                <input type="text" id="entry-amo" name="amo" className="form-control form-control-dark" value={amoNo} onChange={handleInputChange(setAmoNo)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-mechanic" className="mb-2">Aircraft Mechanic</label>
                <input type="text" id="entry-mechanic" name="mechanic" className="form-control form-control-dark" value={mechanic} onChange={handleInputChange(setMechanic)} required />
              </div>

              <div className="form-group mb-3">
                <label htmlFor="entry-signature">Mechanic's Signature for Release</label>
                <ReactSketchCanvas ref={canvas} strokeWidth={5} strokeColor="black" withTimestamp />
              </div>

              { error && (
                <div className="alert alert-danger" role="alert">{ error }</div>
              )}

              <div className="d-grid gap-2 mt-5 mb-3">
                <button type="submit" className="btn btn-success mb-3">RELEASE</button>
                <button type="button" className="btn btn-danger" onClick={handleEntryClose}>CANCEL</button>
              </div>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  )
};

export default Dashboard;
