import React, { useRef } from 'react';

import { theme } from '../../../theme.config';
import { useStore } from '../../store';

const EmailForm = ({
  submitEmail,
  emailBuffer,
  setActiveStep,
  emailInput,
  setEmailInput,
  isEditForm,
  setFeedbackModalVisibility,
}) => {
  const emailInputRef = useRef(null);
  const store = useStore();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (emailInputRef.current && emailInputRef.current.value) {
      submitEmail(emailInputRef.current.value);
    }
  };

  const handleOnInputChange = ({ target }) => {
    const value = target.value;
    setEmailInput(value);
  };

  return (
    <form className="dpf aic form" onSubmit={handleOnSubmit}>
      <div className="dpf cnw input__group">
        <label htmlFor="email" className="input__label">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.email_modal.input_label
            : 'Email'}
        </label>
        <div className={`dpf cnw input__content`}>
          <input
            ref={emailInputRef}
            type="email"
            className="input__text"
            id="email"
            placeholder={
              Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.email_modal
                    .input_description
                : 'Your email'
            }
            required
            defaultValue={store.state.recording.receiverEmail}
            onChange={handleOnInputChange}
          />
          {emailInput.length !== 0 ||
          isEditForm ||
          store.state.videosupport.platform === 'web' ? (
            <button
              className={`dpf aic jcc button button__email`}
              role="submit"
              disabled={emailBuffer.length !== 0}
            >
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.email_modal
                    .input_button_copy
                : 'Save & Send'}
            </button>
          ) : (
            <button
              className={`dpf aic jcc button button__email`}
              onClick={() => {
                setFeedbackModalVisibility(true);
                setActiveStep(1);
              }}
            >
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.email_modal
                    .no_input_button_copy
                : 'No thanks'}
            </button>
          )}
        </div>
      </div>
      <style jsx>{`
        .form {
          width: 100%;
          margin-top: 24px;
        }

        .input__group {
          width: 100%;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
        }
        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: ${emailBuffer.length === 0 ? '#0b0b0b' : '#009900'};
          background: ${emailBuffer.length === 0 ? 'transparent' : '#EBFFEB'};
          border: ${emailBuffer.length === 0
            ? '1px solid #e5e6e6;'
            : '1px solid #009900;'};
          transition: all ease-in-out 0.15s;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }

        .input__text:-webkit-autofill {
          box-shadow: ${emailBuffer.length === 0
            ? '0 0 0 30px white inset'
            : '0 0 0 30px #EBFFEB inset'};
          border: ${emailBuffer.length === 0
            ? '1px solid #e5e6e6;'
            : '1px solid #009900;'};
          -webkit-text-fill-color: ${emailBuffer.length === 0
            ? '#0b0b0b'
            : '#009900'};
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .button {
          width: 100%;
          padding: 22px 24px 20px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: ${store.state.app.branding.secondaryColour};
          background: ${store.state.app.branding.primaryColour};
          box-shadow: ${theme.button_primary_modal_boxshadow};
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
        }

        .button__email {
          width: 100%;
          margin: 8px 0 0;
        }

        .button:disabled {
          background: #009900;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
};

export default EmailForm;
