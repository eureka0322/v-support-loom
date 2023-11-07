import React from 'react';

const LoaderWithText = ({ text, style = 'default' }) => {
  return (
    <div className={`dpf rnw aic chip chip--${style}`}>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="16px"
        height="16px"
        viewBox="0 0 17 17"
        className="loader"
      >
        <g id="circle">
          <circle id="circ" className="circle" cx="8.5" cy="8.5" r="7" />
          <path id="path" className="path" d="M15.5,8.5c0-3.9-3.1-7-7-7">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 8.5 8.5"
              to="360 8.5 8.5"
              dur="1s"
              repeatCount="indefinite"
            ></animateTransform>
          </path>
        </g>
      </svg>
      <p className="text">{text}</p>

      <style jsx>{`
        .chip {
          margin-top: 24px;
        }

        .chip--light {
          opacity: 0.6;
        }

        .text {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.25px;
          color: white;
          margin-left: 6px;
        }

        .circle {
          fill: none;
          stroke: #fff;
          stroke-width: 3;
          opacity: 0.5;
        }

        .path {
          fill: none;
          stroke: #fff;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .chip--dark .text {
          color: var(--dark-gray);
        }

        .chip--dark .circle {
          stroke: var(--black);
          opacity: 0.2;
        }
        .chip--dark .path {
          stroke: var(--black);
        }
      `}</style>
    </div>
  );
};

export default LoaderWithText;
