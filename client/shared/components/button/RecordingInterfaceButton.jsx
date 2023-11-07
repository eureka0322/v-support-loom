import React from 'react';

const RecordingInterfaceButton = ({ icon, label, onClick, disabled }) => {
  const handleOnClick = (e) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  return (
    <button
      className={`cnw aic vsio-ui-button`}
      onClick={handleOnClick}
      disabled={disabled}
    >
      {icon && <div className="dpf jcc aic icon">{icon}</div>}
      {label && (
        <p className={`text ${icon ? 'text-with-icon' : ''}`}>{label}</p>
      )}

      <style jsx>{`
        .icon {
          width: 24px;
          height: 24px;
        }

        .text {
          color: var(--white);
          font-size: var(--fs-sm);
          font-weight: 500;
        }

        .text-with-icon {
          margin-top: 4px;
        }
      `}</style>
    </button>
  );
};

export default RecordingInterfaceButton;
