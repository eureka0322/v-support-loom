import React from 'react';

const FrameButton = ({ onClick, label, disabled, linkUrl }) => {
  return (
    <a href={linkUrl} disabled={!linkUrl}>
      <button
        onClick={onClick}
        className="dpf aic jcc button"
        disabled={disabled}
      >
        {label}
        <style jsx>{`
          .button {
            font-size: 15px;
            font-weight: 500;
            color: white;
            line-height: 10px;
            border-radius: 5px;
            padding: 19px 32px 16px;
            background: #8614f8;
            cursor: pointer;
            margin-top: 12px;
            border: 1px solid transparent;
          }
          .button:hover {
            color: #8614f8;
            background: white;
            border: 1px solid #8614f8;
          }
          .button:disabled {
            color: #8614f8;
            background: #e6cdfe;
            border: 1px solid #8614f8;
            cursor: not-allowed;
          }
        `}</style>
      </button>
    </a>
  );
};

export default FrameButton;
