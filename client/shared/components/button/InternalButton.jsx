import React from 'react';

import { NavLink } from 'react-router-dom';

const InternalButton = ({ icon, label, to, type, style }) => {
  return (
    <NavLink
      className={`rnw aic vsio-button vsio-button--internal vsio-button--${style} vsio-button--${type} ${
        !label ? 'vsio-button--icon' : ''
      }`}
      to={to}
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
    </NavLink>
  );
};

export default InternalButton;
