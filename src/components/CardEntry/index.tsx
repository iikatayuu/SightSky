import React, { useEffect, useState } from 'react';

import type { Entry } from '../../features/entries/types';

import './style.css';

export interface CardEntryProps extends React.HTMLAttributes<HTMLElement> {
  entry: Entry;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const CardEntry: React.FC<CardEntryProps> = (props) => {
  const { entry } = props;
  const [gap, setGap] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const dateA = new Date();
    const timeA = Math.floor(dateA.getTime() / 1000);
    const bTimeStr = entry.time.toString();
    const bHours = bTimeStr.substring(0, 2);
    const bMins = bTimeStr.substring(bTimeStr.length > 4 ? 3 : 2);
    const dateB = new Date(`${entry.date} ${bHours}:${bMins}`);
    const timeB = Math.floor(dateB.getTime() / 1000);
    const diff = timeB - timeA;
    let gapUnit = '';
    let gap = 0;

    if (diff > 86400) {
      gap = Math.floor(diff / 86400);
      gapUnit = 'day' + (gap > 1 ? 's' : '');
    } else if (diff > 3600) {
      gap = Math.floor(diff / 3600);
      gapUnit = 'hour' + (gap > 1 ? 's' : '');
    } else if (diff > 60) {
      gap = Math.floor(diff / 60);
      gapUnit = 'minute' + (gap > 1 ? 's' : '');
    }

    const month = MONTHS[dateB.getMonth()];
    const day = dateB.getDate().toString().padStart(2, '0');
    const year = dateB.getFullYear();
    setGap(`${gap} ${gapUnit}`);
    setDateStr(`${day} ${month} ${year}`);
  }, []);

  return (
    <div className="col-6 px-1 py-1">
      <div className="card card-gray">
        <div className="card-body">
          <div className="card-entry-img rounded-circle d-inline-block mb-4">
            <img src="/assets/airplane.png" alt="Airplane" width={24} height={24} />
          </div>

          <h3 className="card-entry-date mb-0">{ dateStr }</h3>
          <p className="text-sm mb-0">{ gap }</p>
        </div>
      </div>
    </div>
  );
};

export default CardEntry;
