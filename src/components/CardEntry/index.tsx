import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import type { Entry } from '../../features/entries/types';
import { MONTHS } from '../../utils/date';

import './style.css';

export interface CardEntryProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  entry: Entry;
}

const CardEntry: React.FC<CardEntryProps> = (props) => {
  const { id, entry } = props;
  const [dateStr, setDateStr] = useState<string>('');
  const [timeZulu, setTimeZulu] = useState<string>('');
  const [flightType, setFlightType] = useState<string>('');

  useEffect(() => {
    const bTimeStr = entry.time.toString();
    const bHours = bTimeStr.substring(0, 2);
    const bMins = bTimeStr.substring(bTimeStr.length > 4 ? 3 : 2);
    const dateB = new Date(`${entry.date} ${bHours}:${bMins}`);

    const month = MONTHS[dateB.getMonth()];
    const day = dateB.getDate().toString().padStart(2, '0');
    const year = dateB.getFullYear();
    setDateStr(`${day} ${month} ${year}`);
    setTimeZulu(`${bHours}${bMins}`);

    if (entry.flightType === 'preflight') setFlightType('Preflight');
    if (entry.flightType === 'transit') setFlightType('Transit');
    if (entry.flightType === 'postflight') setFlightType('Postflight');
  }, []);

  return (
    <div className="col-6 px-1 py-1">
      <Link to={`/entry/${id}`}>
        <div className="card card-gray card-entry">
          <div className="card-body">
            <div className="card-entry-img rounded-circle d-inline-block mb-4">
              <img src="/assets/airplane.png" alt="Airplane" width={24} height={24} />
            </div>

            <h3 className="card-entry-date mb-0">{ dateStr }</h3>
            <p className="text-sm mb-0">{ timeZulu }</p>
            <p className="text-sm mb-0">{ flightType }</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardEntry;
