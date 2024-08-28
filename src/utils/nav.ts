import React from 'react';
import * as H from 'history';

export function handleBack (history: H.History<unknown>) {
  return (e: React.MouseEvent) => {
    e.preventDefault();
    history.goBack();
  }
}
