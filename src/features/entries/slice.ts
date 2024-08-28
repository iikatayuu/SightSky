import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Entry, EntriesFill } from './types';

export interface EntriesState {
  entries: Entry[];
  registrations: string[];
  nextIns: string[];
}

const entries = localStorage.getItem('entries');
const entriesFill = localStorage.getItem('entriesFill')
const parsedEntries = entries !== null ? JSON.parse(entries) as Entry[] : null;
const parsedEntriesFill = entriesFill !== null ? JSON.parse(entriesFill) as EntriesFill : null;

const defaultRegistrations = [
  'RP-C3594',
  'RP-C3521'
];

const defaultNextIns = ['OPS1', 'OPS2'];

if (parsedEntries === null) {
  localStorage.setItem('entries', '[]');
}

if (parsedEntriesFill === null) {
  const defaultEntriesFill: EntriesFill = {
    registrations: defaultRegistrations,
    nextIns: defaultNextIns
  };

  localStorage.setItem('entriesFill', JSON.stringify(defaultEntriesFill));
}

const initialState: EntriesState = {
  entries: parsedEntries !== null ? parsedEntries : [],
  registrations: parsedEntriesFill !== null ? parsedEntriesFill.registrations : defaultRegistrations,
  nextIns: parsedEntriesFill !== null ? parsedEntriesFill.nextIns : defaultNextIns
};

const addEntryReducer: CaseReducer<EntriesState, PayloadAction<Entry>> = (state, action) => {
  const entries = state.entries;
  entries.push(action.payload);
  state.entries = entries;
  localStorage.setItem('entries', JSON.stringify(entries));
};

const addRegistrationReducer: CaseReducer<EntriesState, PayloadAction<string>> = (state, action) => {
  const registrations = state.registrations;
  if (!registrations.includes(action.payload)) {
    registrations.push(action.payload);
    state.registrations = registrations;
    localStorage.setItem('entriesFill', JSON.stringify({
      registrations: state.registrations,
      nextIns: state.nextIns
    }));
  }
};

const addNextInReducer: CaseReducer<EntriesState, PayloadAction<string>> = (state, action) => {
  const nextIns = state.nextIns;
  if (!nextIns.includes(action.payload)) {
    nextIns.push(action.payload);
    state.nextIns = nextIns;
    localStorage.setItem('entriesFill', JSON.stringify({
      registrations: state.registrations,
      nextIns: state.nextIns
    }));
  }
};

export const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    addEntry: addEntryReducer,
    addRegistration: addRegistrationReducer,
    addNextIn: addNextInReducer
  }
});

export const { addEntry, addRegistration, addNextIn } = entriesSlice.actions;
export const selectEntries = (state: RootState) => state.entries;
export default entriesSlice.reducer;
