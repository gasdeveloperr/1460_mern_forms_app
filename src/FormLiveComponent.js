import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import './FormLiveStyles.css';



const FormLiveComponent = ({field, index}) => {



    return (
      <>
          {field.type === 'short_answer' && (
            <label key={index} className="form-live-component-container">
              <div className="form-short-answer">
                <div className='form-component-title'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <input className='form-live-input'/>
              </div>
            </label>
          )}
          {field.type === 'long_answer' && (
            <label key={index} className="form-live-component-container">
              <div className="form-short-answer">
                <div className='form-component-title'>
                  {field.required && <span>*</span>}
                  {field.title}
                </div>
                <textarea className='long-answer-input'/>
              </div>
            </label>
          )}
          {field.type === 'name' && (
            <div className="form-component-name">
              <div className='form-component-title'>
                {field.required && <span>*</span>}
                {field.title}
              </div>
              <div className="form-component-name-fields">

                <input className='form-live-input'/>
                <input className='form-live-input'/>
              </div>
              <div className="form-component-name-fields">
                <div className='form-component-label'>
                  {field.required && <span>*</span>}
                  {field.labels[0]}
                </div>
                <div className='form-component-label'>
                  {field.required && <span>*</span>}
                  {field.labels[1]}
                </div>
              </div>
            </div>
          )}
        </>
    );
};

export default FormLiveComponent;