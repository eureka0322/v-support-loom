import React from 'react';
import ActionButton from './button/ActionButton';

import ExternalButton from './button/ExternalButton';

const Prompt = ({
  title,
  text,
  explanationHeadline,
  explanation,
  action,
  actionLabel,
}) => {
  return (
    <div className="dpf prompt">
      <div className="cnw aic prompt-content">
        <div className="headline">{title}</div>
        <p className="text">{text}</p>
        {explanationHeadline && (
          <p className="text text--headilne">{explanationHeadline}</p>
        )}
        {explanation && <p className="text">{explanation}</p>}
        {action && typeof action !== 'function' && (
          <ExternalButton
            type={'primary'}
            style="lg"
            to={action}
            label={actionLabel}
            stretch
          />
        )}
        {action && typeof action === 'function' && (
          <ActionButton
            onClick={action}
            type={'primary'}
            style="lg"
            label={actionLabel}
            stretch
          />
        )}
      </div>
      <div className="background" />
      <style jsx>{`
        .prompt {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 6;
        }
        .prompt-content {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          max-width: 350px;
          transform: translate(-50%, -50%);
          padding: 24px;
          background: var(--white);
          border-radius: 10px;
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
        }

        .headline {
          font-size: var(--fs-lg);
          font-weight: 500;
          text-align: center;
        }

        .text {
          text-align: center;
          color: var(--dark-gray);
          margin: 8px 0 16px;
          line-height: 24px;
        }

        .text--headilne {
          font-weight: 500;
          text-align: center;
          color: var(--primary);
        }

        .text + .text {
          margin-top: 4px;
        }

        .background {
          width: 100%;
          height: 100%;
          background: rgba(11, 11, 11, 0.2);
        }

        @media only screen and (max-width: 425px) {
          .prompt-content {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
};

export default Prompt;
