import React from 'react';

const InlineLoader = ({ message, hasBackground = false }) => {
  return (
    <div className="dpf cnw jcc aic inline-loader">
      <div className="dpf jcc aic loader">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="17px"
          height="17px"
          viewBox="0 0 17 17"
          className="uploading__icon"
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
        {message && <p className="text">{message}</p>}
      </div>

      <style jsx>{`
        .inline-loader {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 100;
          background: ${hasBackground
            ? 'rgba(11, 11, 11, 0.1)'
            : 'rgba(0, 0, 0, 0)'};
        }

        .loader {
          position: relative;
          padding: 16px 17px 18px 16px;
          background: #0b0b0b;
          border-radius: 5px;
          margin-top: -65px;
          box-shadow: inset 0 1px 1px rgba(245, 244, 247, 0.25);
        }

        .uploading__icon {
          transform: scale(1.3);
        }

        .circle {
          fill: none;
          stroke: #ffffff;
          stroke-width: 3;
          stroke-opacity: 0.3;
        }

        .path {
          fill: none;
          stroke: #ffffff;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .text {
          position: relative;
          top: 2px;
          font-size: 12px;
          line-height: 10px;
          font-weight: 700;
          margin-left: 16px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default InlineLoader;
