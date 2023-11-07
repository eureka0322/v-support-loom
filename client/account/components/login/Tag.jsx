import React from 'react';

const Tag = ({ style = 'header', text }) => {
  return (
    <div className={`dpf rnw aic tag tag__${style}`}>
      <div className="dpf icon__wrapper">
        <svg
          width="26px"
          height="26px"
          viewBox="0 0 26 26"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
        >
          <circle
            id="canvas"
            className="icon__canvas"
            cx="13"
            cy="13"
            r="13"
          ></circle>
          <polyline
            className="icon__check"
            points="9 13.5 11.6666667 16 17 11"
          ></polyline>
        </svg>
      </div>
      <p className="text">{text}</p>
      <style jsx>{`
        .tag__header {
          padding: 12px 16px;
        }

        .tag__pricing + .tag__pricing {
          margin-top: 16px;
        }

        .icon {
          position: relative;
          z-index: 1;
        }

        .tag__header .icon__canvas {
          fill: #8312f3;
        }

        .icon__check {
          stroke-width: 2.43;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
        }

        .tag__header .icon__check {
          stroke: white;
        }

        .tag__pricing .icon__canvas {
          fill: white;
        }

        .tag__pricing .icon__check {
          stroke: #8312f3;
        }

        .icon__wrapper {
          position: relative;
        }

        .tag__header .icon__wrapper::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36px;
          height: 36px;
          border-radius: 36px;
          transform: translate(-50%, -50%);
          background: rgba(134, 20, 248, 0.35);
        }

        .text {
          color: #fff;
          margin-left: 16px;
        }

        .tag__pricing .text {
          margin-left: 8px;
          line-height: 26px;
        }
      `}</style>
    </div>
  );
};

export default Tag;
