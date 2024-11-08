import { createContext, useRef, useEffect, useState } from 'react';

export const OutsideClickContext = createContext(null);

export const OutsideClickProvider = ({ children }) => {
  const formFieldRef = useRef(null);
  const fieldEditorRef = useRef(null);

  const [outsideClickHandlers, setOutsideClickHandlers] = useState([]);

  const handleClickOutside = (event) => {

    //console.log('click detected')
    if (
      event.target.closest('#saving-options-window') 
      // ||
      // event.target.closest('#choosing-options-window')
    ) {
      console.log('click dis')
      return;
    }

    if (
      formFieldRef.current &&
      !formFieldRef.current.contains(event.target) &&
      fieldEditorRef.current &&
      !fieldEditorRef.current.contains(event.target)
    ) {
      // Run your function here
      outsideClickHandlers.forEach((handler) => handler());
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const registerOutsideClickHandler = (handler) => {
    setOutsideClickHandlers((prevHandlers) => [...prevHandlers, handler]);
  };

  const unregisterOutsideClickHandler = (handler) => {
    setOutsideClickHandlers((prevHandlers) =>
      prevHandlers.filter((prevHandler) => prevHandler !== handler)
    );
  };

  return (
    <OutsideClickContext.Provider
      value={{ formFieldRef, fieldEditorRef, registerOutsideClickHandler, unregisterOutsideClickHandler }}
    >
      {children}
    </OutsideClickContext.Provider>
  );
};