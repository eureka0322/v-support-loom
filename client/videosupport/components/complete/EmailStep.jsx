import React from 'react';
import { useStore } from '../../store';

import HeadlineWithDescription from '../misc/HeadlineWithDescription';
import EmailForm from './EmailForm';

const EmailStep = ({
  headline,
  descriptions,
  setActiveStep,
  isEmailSent,
  isComplete,
  submitEmail,
  emailInput,
  emailBuffer,
  setEmailInput,
  setFeedbackModalVisibility,
}) => {
  const store = useStore();
  return (
    <div className="step__email">
      <HeadlineWithDescription
        headline={headline}
        descriptions={descriptions}
      />
      <EmailForm
        submitEmail={submitEmail}
        isEmailSent={isEmailSent}
        isComplete={isComplete}
        emailInput={emailInput}
        emailBuffer={emailBuffer}
        setActiveStep={setActiveStep}
        setEmailInput={setEmailInput}
        setFeedbackModalVisibility={setFeedbackModalVisibility}
      />
      <style jsx>{`
        .step__email {
          width: 100%;
          max-width: ${store.state.device.platform &&
          store.state.device.platform.type === 'desktop'
            ? '425px'
            : '100%'};
          marign: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default EmailStep;
