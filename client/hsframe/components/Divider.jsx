import React from "react";

const Divider = ({label}) => {
  return(
    <div className="dpf cnw aic divider__wrapper">
    {
      label &&
      <span className="dpif label">{label}</span>
    }
      <div className="divider"></div>
      <style jsx>{`

        .divider__wrapper {
          position: relative;
          width: 100%;
        }
        .label {
          position: absolute;
          top: calc(50% + 1px);
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          padding: 2px 8px;
          background: white;
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 8px;
        }
        .divider {
          width: 100%;
          border: 1px solid #e5e6e6;
        }
      `}</style>
    </div>
  )
};

export default Divider;