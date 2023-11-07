import React from 'react';
import { QrCode, Tv, Camera } from '../../../shared/icons';

import RecordingInProgressStep from './RecordingInProgressStep';
import ActionButton from '../../../shared/components/button/ActionButton';

const RecordingInProgress = ({
  headline,
  description,
  isQrScanned,
  isRecordingOnPhone,
  isVideoProcessing,
  cancelOperation,
}) => {
  return (
    <React.Fragment>
      {headline && description && (
        <header className="dpf cnw aic header__content">
          <h1 className="headline__header">{headline}</h1>
          <p className="description__header">{description}</p>
        </header>
      )}
      <div className="dpf cnw aic process-wrapper">
        <p className="text text--uppercase">steps</p>
        <div className="dpf cnw steps-content">
          <RecordingInProgressStep
            state={isQrScanned}
            headline="Qr-code scanned"
            icon={<QrCode />}
          />
          <RecordingInProgressStep
            state={isRecordingOnPhone}
            headline="Recording on device"
            icon={<Camera state={isRecordingOnPhone} />}
          />
          <RecordingInProgressStep
            state={isVideoProcessing}
            headline="Processing video"
            icon={<Tv state={isVideoProcessing} />}
          />
        </div>
      </div>
      <ActionButton
        label="Cancel"
        onClick={cancelOperation}
        type="lg"
        style="error"
        stretch={true}
      />
      <style jsx>{`
        .headline__header {
          font-size: 38px;
          font-weight: 700;
          line-height: 40px;
          text-align: center;
        }

        .description__header {
          width: 100%;
          margin: 8px auto 0;
          color: #a1a1a1;
          text-align: center;
          line-height: 24px;
        }

        .text {
          font-size: 18px;
          line-height: 36px;
          color: #0b0b0b;
          text-align: center;
        }

        .steps-content {
          width: 100%;
          margin-top: 16px;
        }

        .process-wrapper {
          width: 100%;
          margin: 24px 0;
        }

        .text--uppercase {
          color: #0b0b0b;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          line-height: 10px;
          letter-spacing: 1px;
        }

        .text--background {
          padding: 4px 8px;
          background: white;
          position: relative;
          z-index: 1;
        }

        .button {
          width: 100%;
          font-size: 14px;
          line-height: 10px;
          font-weight: 500;
          background: #8614f8;
          border-radius: 5px;
          color: white;
          transition: background 0.15s;
          border: 1px solid transparent;
          position: relative;
          cursor: pointer;
          padding: 19px 24px 16px 24px;
          text-align: center;
          margin-top: 8px;
        }
        .button:hover {
          color: #8614f8;
          background: white;
          border: 1px solid #8614f8;
        }

        .button--error {
          background: #f81414;
        }
      `}</style>
    </React.Fragment>
  );
};

export default RecordingInProgress;
