import React from 'react';

import { theme } from '../../../theme.config';
import { videoUrl } from '../../../env.config';
import { useStore } from '../../store';

const FormButton = ({ style = 'primary', text, role, link, action }) => {
  const store = useStore();
  const renderButtonStyle = (s) => {
    if (s === 'primary') {
      return 'button__primary';
    } else {
      return 'button__secondary';
    }
  };

  const renderButtonFunc = (s) => {
    if (s === 'primary') {
      return handlePrimaryAction();
    } else {
      return handleSecondaryAction();
    }
  };

  const handlePrimaryAction = () => {
    if (link) {
      window.location.href = videoUrl(link);
    } else if (action) {
      action();
    }
  };

  const handleSecondaryAction = () => {
    console.log('[FormButton] [handleSecondaryAction]');
    if (link) {
      window.location.href = link;
    } else if (action) {
      action();
    }
  };

  return (
    <button
      onClick={() => renderButtonFunc(style)}
      className={`dpf aic jcc button ${renderButtonStyle(style)}`}
      role={role}
    >
      {text}
      <style jsx>{`
        .button {
          width: 100%;
          padding: 22px 24px 20px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .button.button__primary {
          color: ${store.state.app.branding.secondaryColour};
          background: ${store.state.app.branding.primaryColour};
          box-shadow: ${theme.button_primary_modal_boxshadow};
        }

        .button.button__primary:active {
          box-shadow: none;
        }

        .button.button__secondary {
          padding: 21px 24px 19px;
          color: ${store.state.app.branding.primaryColour};
          background: ${store.state.app.branding.secondaryColour};
          border: 1px solid #dddddd;
          box-shadow: ${theme.button_secondary_modal_boxshadow};
          margin-top: 8px;
        }

        .button.button__secondary:active {
          box-shadow: none;
        }
      `}</style>
    </button>
  );
};

export default FormButton;
