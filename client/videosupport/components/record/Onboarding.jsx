import React from 'react';
import Cookies from 'cookies-js';

import LogoMark from '../../../shared/components/LogoMark';

import { theme } from '../../../theme.config';
import { useStore } from '../../store';

const Onboarding = ({ setIsOnboarded }) => {
  const store = useStore();
  const handleOnboardinClick = () => {
    Cookies.set('videosupport-io-onboarded', 'true', {
      expires: 60 * 60 * 24,
    }); // should expire after 24 hours
    setIsOnboarded(true);
  };

  return (
    <section className="dpf jcc aic onboarding">
      <div className="background"></div>
      <div className="dpf cnw aic message">
        <div className="logomark__wrapper">
          <LogoMark />
        </div>
        <header className="header">
          <h1 className="headline">videosupport</h1>
        </header>
        <p className="description text">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.onboarding_screen.description
            : 'Helping you is our superpower. See how it works:'}
        </p>
        <ul className="dpf cnw aic list">
          <li className="dpf rnw aic list__item">
            <div className="dpf jcc aic list__item__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0b0b0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="svg-icon"
              >
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
            </div>
            <div className="dpf content">
              <header className="dpf cnw list__item__header">
                <h1 className="list__item__text list__item__headline">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_one.title
                    : 'Record / Upload'}
                </h1>
                <p className="list__item__text list__item__description">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_one.description
                    : 'Start by capturing the issue'}
                </p>
              </header>
            </div>
          </li>
          <li className="dpf rnw aic list__item">
            <div className="dpf jcc aic list__item__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="svg-icon"
              >
                <path
                  fill="#0B0B0B"
                  d="M22.5,16h-2v-2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2h-2c-0.6,0-1,0.4-1,1s0.4,1,1,1h2v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-2
	h2c0.6,0,1-0.4,1-1S23.1,16,22.5,16z"
                />
                <path
                  fill="#0B0B0B"
                  d="M1.5,22c-0.1,0-0.3,0-0.4-0.1c-0.4-0.2-0.6-0.5-0.6-0.9V5c0-1.7,1.3-3,3-3h14c1.7,0,3,1.3,3,3v4
	c0,0.6-0.4,1-1,1s-1-0.4-1-1V5c0-0.6-0.4-1-1-1h-14c-0.6,0-1,0.4-1,1v13.6l2.3-2.3C5,16.1,5.2,16,5.5,16h6c0.6,0,1,0.4,1,1
	s-0.4,1-1,1H5.9l-3.7,3.7C2,21.9,1.8,22,1.5,22z"
                />
              </svg>
            </div>
            <div className="dpf content">
              <header className="dpf cnw list__item__header">
                <h1 className="list__item__text list__item__headline">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_two.title
                    : 'Message'}
                </h1>
                <p className="list__item__text list__item__description">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_two.description
                    : 'Add an optional message'}
                </p>
              </header>
            </div>
          </li>
          <li className="dpf rnw aic list__item">
            <div className="dpf jcc aic list__item__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0b0b0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="svg-icon svg-icon__send"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <div className="dpf content">
              <header className="dpf cnw list__item__header">
                <h1 className="list__item__text list__item__headline">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_three.title
                    : 'Send'}
                </h1>
                <p className="list__item__text list__item__description">
                  {Object.values(store.state.language.translations).length !== 0
                    ? store.state.language.translations.onboarding_screen
                        .step_three.description
                    : 'Finish off by pressing send'}
                </p>
              </header>
            </div>
          </li>
        </ul>
        <button onClick={handleOnboardinClick} className="button">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.onboarding_screen.button_copy
            : 'Get started'}
        </button>
      </div>
      <style jsx>{`
        .onboarding {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .message {
          position: relative;
          width: 100%;
          max-width: 310px;
          margin-top: -64px;
          z-index: 3;
        }

        .logomark__wrapper {
          margin-bottom: 8px;
        }

        .headline {
          font-size: 28px;
          font-weight: 500;
          line-height: 34px;
          text-align: center;
          color: white;
        }

        .description {
          margin-top: 8px;
        }

        .text {
          font-size: 18px;
          line-height: 28px;
          text-align: center;
          color: white;
        }

        .list {
          width: 100%;
          margin-top: 32px;
        }

        .list__item {
          width: 100%;
        }

        .list__item__icon {
          background: white;
          width: 100%;
          height: 65px;
          border-radius: 50%;
          max-width: 65px;
        }

        .content {
          padding-left: 24px;
        }

        .list__item__text {
          color: white;
          font-size: 18px;
        }

        .list__item__headline {
          font-weight: 500;
        }

        .list__item__description {
          font-size: 16px;
          line-height: 24px;
          margin-top: 2px;
          color: #a1a1a1;
        }

        .svg-icon__send {
          position: relative;
          left: -2px;
        }

        .list__item + .list__item {
          margin-top: 32px;
        }

        .button {
          font-size: 16px;
          padding: 16px 100px 14px;
          color: ${store.state.app.branding.secondaryColour};
          font-weight: 500;
          background: ${store.state.app.branding.primaryColour};
          box-shadow: ${theme.button_primary_modal_boxshadow};
          white-space: nowrap;
          border-radius: 25px;
          margin-top: 56px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .button:active {
          box-shadow: none;
        }

        .background {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
        }
      `}</style>
    </section>
  );
};

export default Onboarding;
