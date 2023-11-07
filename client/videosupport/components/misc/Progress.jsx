import React from 'react';

const TOTAL_STEPS = 2;

import { theme } from '../../../theme.config';
import { useStore } from '../../store';

const Progress = ({ step, display = 'light', uploadPercentage }) => {
  const store = useStore();
  return (
    <div className="dpf cnw progressbar">
      <p className="description">
        {uploadPercentage === undefined ||
        uploadPercentage === null ||
        uploadPercentage === 100
          ? Object.values(store.state.language.translations).length !== 0
            ? `${store.state.language.translations.record_screen.progress_copy} ${step}`
            : `Step ${step}`
          : Object.values(store.state.language.translations).length !== 0
          ? store.state.language.translations.record_screen.loading_copy
          : 'Loading'}
      </p>
      <div className="bar">
        {uploadPercentage === undefined ||
        uploadPercentage === null ||
        uploadPercentage === 100 ? (
          <div className="inner"></div>
        ) : (
          <div className="inner__loader"></div>
        )}
        <div className="canvas"></div>
      </div>
      <style jsx>{`
        .progressbar {
          width: 100%;
        }

        .description {
          font-size: 12px;
          font-weight: 700;
          color: ${display === 'light' ? 'white' : '#0b0b0b'};
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        }

        .bar {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 5px;
          height: 4px;
        }

        .inner {
          position: absolute;
          top: 0;
          left: 0;
          width: ${(step / TOTAL_STEPS) * 100}%;
          background: ${store.state.app.branding.primaryColour};
          height: 100%;
          border-radius: 5px;
          z-index: 1;
        }

        .inner__loader {
          position: absolute;
          top: 0;
          left: 0;
          width: ${uploadPercentage}%;
          background: ${store.state.app.branding.primaryColour};
          height: 100%;
          border-radius: 5px;
          z-index: 1;
        }

        .canvas {
          position: absolute;
          top: 0;
          left: 0;
          background: ${display === 'light'
            ? theme.progress_background
            : 'rgba(0, 0, 0, 0.05)'};
          width: 100%;
          height: 100%;
          z-index: 0;
        }
      `}</style>
    </div>
  );
};

export default Progress;
