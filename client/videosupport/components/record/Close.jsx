import React from 'react';
import { useNavigate } from 'react-router-dom';

const Close = ({ onClick, style }) => {
  const navigate = useNavigate();

  const handleOnClose = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      onClick={handleOnClose}
      className={`dpf jcc aic button-close button-close--${style}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={`button-icon button-icon--${style}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      <style jsx global="true">{`
        .button-close {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          margin-bottom: 16px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .button-close--primary {
          background: var(--white);
        }
        .button-close--primary:hover {
          background: var(--light-gray);
        }
        .button-close--primary:focus,
        .button-close--primary:active {
          border: 1px solid var(--black);
          box-shadow: 0 0 0 3px rgba(11, 11, 11, 0.1);
          outline: none;
        }
        .button-close--secondary {
          background: rgba(0, 0, 0, 0.1);
        }
        .button-close--secondary:focus,
        .button-close--secondary:active {
          border: 1px solid var(--black);
          box-shadow: 0 0 0 3px rgba(11, 11, 11, 0.1);
          outline: none;
        }

        .button-icon--primary {
          stroke: var(--black);
        }
        .button-icon--secondary {
          stroke: var(--white);
        }
      `}</style>
    </button>
  );
};

export default Close;
