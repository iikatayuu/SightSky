
export type FlightType = 'preflight' | 'transit' | 'postflight';

export interface Entry {
  flightType: FlightType;
  submitter: string;
  date: string;
  registration: string;
  type: string;
  nature: string;
  compliance: boolean;
  reason: string;
  time: string;
  leftFuel: number;
  rightFuel: number;
  totalFuel: number;
  nextins: string;
  tachTime: string;
  amoNo: string;
  mechanic: string;
  signature: string;
}

export interface EntriesFill {
  registrations: string[];
  nextIns: string[];
}
