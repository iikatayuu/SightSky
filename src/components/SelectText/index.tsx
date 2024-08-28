import React, { useCallback, useEffect, useRef, useState } from 'react';
import { IonContent, IonModal } from '@ionic/react';

import { handleInputChange } from '../../utils/input';

import './style.css';

export interface SelectTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options?: string[];
  onValueChange?: (value: string) => void;
}

const SelectText: React.FC<SelectTextProps> = (props) => {
  const { options = [], onValueChange = () => {}, ...other } = props;
  const [customValue, setCustomValue] = useState<string>('');
  const modalOptions = useRef<HTMLIonModalElement>(null);

  const handleFocus = useCallback((e: React.FocusEvent) => {
    const input = e.target as HTMLInputElement;
    modalOptions.current?.present();
    input.blur();
    setCustomValue('');
  }, []);

  const handleClick = useCallback((value: string) => () => {
    modalOptions.current?.dismiss();
    onValueChange(value);
  }, []);

  const handleSave = useCallback(() => {
    modalOptions.current?.dismiss();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
  }, []);

  useEffect(() => {
    onValueChange(customValue);
  }, [customValue]);

  return (
    <>
      <input type="text" placeholder="- Select -" onFocus={handleFocus} {...other} readOnly />

      <IonModal ref={modalOptions} canDismiss initialBreakpoint={0.4} breakpoints={[0.4, 0.6]}>
        <IonContent>
          <div className="mx-3 mt-3 mb-2">
            <input type="text" className="form-control" value={customValue} onChange={handleInputChange(setCustomValue)} onKeyDown={handleKeyDown} />
          </div>

          <div className="list-group list-group-dark list-group-flush">
            {
              options.map((option, i) => (
                <a href="#" className="list-group-item list-group-item-action py-3" onClick={handleClick(option)} key={i}>{ option }</a>
              ))
            }
          </div>

          <div className="select-text-save d-grid gap-2 p-2">
            <button type="submit" className="btn btn-dark-2" onClick={handleSave}>Save</button>
          </div>
        </IonContent>
      </IonModal>
    </>
  );
};

export default SelectText;
