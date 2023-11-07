import React from 'react';

const ActionButton = ({
  icon,
  label,
  onClick,
  type,
  style,
  stretch = false,
  disabled,
  active = false,
}) => {
  const handleOnClick = (e) => {
    e.preventDefault();
    onClick();
  };

  return (
    <button
      className={`rnw aic vsio-button vsio-button--action vsio-button--${style}-${
        active ? 'active' : 'inactive'
      } vsio-button--${style} vsio-button--${type} ${
        !label ? 'vsio-button--icon' : ''
      } ${stretch ? 'vsio-button--stretch' : ''}`}
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

        .text-with-icon {
          margin-left: 8px;
        }
      `}</style>
    </button>
  );
};

export default ActionButton;
