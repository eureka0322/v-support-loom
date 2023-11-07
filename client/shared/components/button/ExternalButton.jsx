import React from 'react';

const ExternalButton = ({
  icon,
  label,
  to,
  target = '_self',
  type,
  style,
  stretch,
  disabled,
}) => {
  return (
    <a
      className={`rnw aic vsio-button vsio-button--internal vsio-button--${style} vsio-button--${type} ${
        !label ? 'vsio-button--icon' : ''
      } ${stretch ? 'vsio-button--stretch' : ''} ${
        disabled ? 'vsio-button--disabled' : ''
      }`}
      target={target}
      href={to}
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
    </a>
  );
};

export default ExternalButton;
