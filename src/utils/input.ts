import React from 'react';
import { CheckboxCustomEvent, SelectCustomEvent } from '@ionic/react';

export function handleInputChange (callback: (value: string) => void) {
  return (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    callback(input.value as string);
  }
}

export function handleInputNumberChange (callback: (value: number) => void) {
  return (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    if (input.value !== '') {
      const value = parseInt(input.value);
      callback(value);
    } else {
      callback(0);
    }
  }
}

export function handleSelectChange<T = string> (callback: (value: T) => void) {
  return (event: SelectCustomEvent) => {
    callback(event.target.value!);
  }
}

export function handleCheckboxChange (callback: (value: boolean) => void) {
  return (event: CheckboxCustomEvent) => {
    callback(event.target.checked);
  }
}
