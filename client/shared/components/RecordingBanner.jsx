import React from 'react';

import ExternalButton from './button/ExternalButton';

const RecordingBanner = ({ title, button }) => {
  return (
    <div className="cnw aifs recording-banner">
      <div className="vsio-subheadline--lg subheadline">{title}</div>
      {button && <ExternalButton {...button} />}
      <style jsx>{`
        .recording-banner {
          width: 100%;
          padding: 16px 16px 24px;
          background: var(--light-blue);
          border: 1px solid var(--light-gray);
          border-radius: 5px;
        }

        .subheadline {
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default RecordingBanner;
