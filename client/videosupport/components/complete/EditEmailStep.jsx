import React from 'react';
import { useStore } from '../../store';

import HeadlineWithDescription from '../misc/HeadlineWithDescription';
import EmailForm from './EmailForm';

const EditEmailStep = ({
  headline,
  descriptions,
  isSend,
  isComplete,
  submitEmail,
  emailInput,
  setEmailInput,
  emailBuffer,
  setActiveStep,
}) => {
  const store = useStore();
  return (
    <div className="step__edit__email">
      <HeadlineWithDescription
        headline={headline}
        descriptions={descriptions}
      />
      <EmailForm
        submitEmail={submitEmail}
        isSend={isSend}
        isComplete={isComplete}
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        emailBuffer={emailBuffer}
        setActiveStep={setActiveStep}
        isEditForm
      />
      <div className="dpf rnw jcc spacer"></div>
      <style jsx>{`
        .step__edit__email {
          width: 100%;
          max-width: ${store.state.device.platform &&
          store.state.device.platform.type === 'desktop'
            ? '425px'
            : '100%'};
          margin: 0 auto;
        }

        .spacer {
          width: 100%;
          padding: 24px;
        }
      `}</style>
    </div>
  );
};

export default EditEmailStep;
