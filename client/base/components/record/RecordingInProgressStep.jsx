import React from 'react';
import { CheckUp, Loader } from '../../../shared/icons';

const RecordingInProgressStep = ({ headline, state, icon }) => {
  const renderState = () => {
    if (state && typeof state !== 'string') {
      return <CheckUp />;
    } else if (state === 'active') {
      return <Loader loading={true} />;
    } else {
      return <Loader loading={false} />;
    }
  };

  return (
    <div className="dpf rnw jcsb aic recording-in-progress__step">
      <div className="state">
        <div className="state-icon">{renderState()}</div>
      </div>
      <div className={`headline ${!state ? 'headline--inactive' : ``}`}>
        {headline}
      </div>
      <div className="icon-wrapper">{icon}</div>
      <style jsx>{`
        .recording-in-progress__step {
          width: 100%;
          position: relative;
          padding: 16px 16px 16px 32px;
          border: 1px solid #e5e6e6;
          border-radius: 3px;
          background: white;
        }

        .recording-in-progress__step + .recording-in-progress__step {
          margin-top: 8px;
        }

        .state {
          position: absolute;
          top: calc(50% - 18px);
          left: -18px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1px solid #e5e6e6;
        }

        .state-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 22px;
          height: 22px;
        }

        .headline {
          font-size: 15px;
          font-weight: 500;
          margin-top: 4px;
        }

        .headline--inactive {
          color: #e5e6e6;
        }

        .icon-wrapper {
          width: 24px;
          height: 24px;
          transform: scale(1.25);
        }
      `}</style>
    </div>
  );
};

export default RecordingInProgressStep;
