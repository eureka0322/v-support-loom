import React from 'react';

const Spinner = ({ isRecording, disabled }) => {
  return (
    <svg
      width="70px"
      height="70px"
      viewBox="0 0 70 70"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={`spinner ${disabled ? 'spinner--disabled' : ''}`}
    >
      <g id="icon" transform="translate(-101.000000, -101.000000)">
        <g id="spinner" transform="translate(103.000000, 103.000000)">
          <circle
            className={`spinner-border`}
            cx="33.0000013"
            cy="33.0000013"
            r="33.0000013"
          ></circle>
          <circle
            className={`spinner-border spinner-border-indicator`}
            cx="33.0000013"
            cy="33.0000013"
            r="33.0000013"
          ></circle>
          <circle
            className={`spinner-canvas ${
              isRecording ? 'spinner-canvas--active' : ''
            } `}
            cx="33.0000013"
            cy="33.0000013"
            r="23.4000009"
          ></circle>
        </g>
      </g>
      <style jsx>{`
        .spinner {
          transform: scale(1.4);
        }
        .spinner--disabled {
          cursor: not-allowed;
          opacity: 0.2;
        }

        .spinner:active .spinner-canvas {
          fill: var(--primary);
        }

        .spinner-border {
          stroke: white;
          stroke-width: 2;
          fill: none;
          transform-origin: 33px 33px;
          transform: scale(0.8);
        }

        .spinner-canvas {
          fill: white;
        }

        .spinner-canvas--active {
          fill: var(--primary);
        }

        .spinner--disabled .spinner-canvas {
          fill: var(--light-gray);
        }

        .spinner--disabled:active .spinner-border {
          stroke: var(--light-gray);
        }

        .spinner:active .spinner-canvas {
          fill: var(--light-gray);
        }
      `}</style>
    </svg>
  );
};

export default Spinner;
