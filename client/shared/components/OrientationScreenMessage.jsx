import React from 'react';
import { useStore } from '../../videosupport/store';

import Logo from './Logo';

const OrientationScreenMessage = () => {
  const store = useStore();

  return (
    <section className="dpf jcc aic orientation-message">
      <div className="dpf cnw aic message">
        <header className="header">
          <h1 className="headline">
            {Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.orientation_screen.title
              : 'Attention'}
          </h1>
        </header>
        <p className="description text">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.orientation_screen.description
            : 'Please use your phone in (📱) portrait mode.'}
        </p>
      </div>
      <div className="logo__wrapper">
        <Logo version="dark" />
      </div>
      <style jsx>{`
        .orientation-message {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          display: none;
          z-index: 2; /* +1 then recording button */
          padding: 0 16px;
        }

        .message {
          width: 100%;
          max-width: 385px;
          margin-top: -32px;
        }

        .headline {
          font-size: 28px;
          font-weight: 700;
          color: #0b0b0b;
        }

        .description {
          margin-top: 8px;
        }

        .text {
          font-size: 18px;
          line-height: 26px;
          text-align: center;
        }

        .logo__wrapper {
          position: absolute;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
        }

        .instructions {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 0;
        }

        @media only screen and (orientation: landscape) {
          .orientation-message {
            display: flex;
          }
        }
      `}</style>
    </section>
  );
};

export default OrientationScreenMessage;
