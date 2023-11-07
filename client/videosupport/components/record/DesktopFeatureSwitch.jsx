import React, { Fragment } from 'react';
import { useStore } from '../../store';
import AttentionPrompt from './AttentionPrompt';

const DesktopFeatureSwitch = ({ isAttentionprompt, setAttentionprompt }) => {
  const store = useStore();
  return (
    <div className="switch__wrapper">
      {store.state.device.platform &&
        store.state.device.platform.type === 'desktop' &&
        store.state.device.browser.name === 'Chrome' && (
          <div className="dpf rnw jcc aic switch">
            <div
              className={`dpf jcc option ${
                !isAttentionprompt ? 'option--active' : ''
              }`}
              onClick={() => setAttentionprompt(false)}
            >
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.record_screen.selfie_copy
                    .title
                : 'Selfie Mode'}
            </div>
            <div
              className={`dpf jcc option ${
                isAttentionprompt ? 'option--active' : ''
              }`}
              onClick={() => setAttentionprompt(true)}
            >
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.record_screen.hardware_copy
                    .title
                : 'Hardware Mode'}
            </div>
          </div>
        )}
      {isAttentionprompt &&
        store.state.device.platform &&
        store.state.device.platform.type === 'desktop' &&
        store.state.device.browser.name !== 'Safari' &&
        store.state.device.browser.name !== 'Firefox' && (
          <AttentionPrompt
            title={
              Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.record_screen.hardware_copy
                    .title
                : 'Hardware Mode'
            }
            description={
              Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.record_screen.hardware_copy
                    .description
                : 'Are you looking to bring your hardware product into focus, then we recommend using a smartphone. Scan the QR-Code below OR copy the link to get started.'
            }
            setAttentionprompt={() => setAttentionprompt(!isAttentionprompt)}
            showQR={true}
          />
        )}
      {store.state.device.platform &&
        store.state.device.platform.type === 'desktop' &&
        (store.state.device.browser.name === 'Safari' ||
          store.state.device.browser.name === 'Firefox') && (
          <Fragment>
            <div className="dpf rnw jcc aic switch">
              <div className={`dpf jcc option option--active`}>
                {Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.record_screen
                      .unsupported_copy.title
                  : 'Unsupported Browser'}
              </div>
            </div>
            <AttentionPrompt
              title={
                Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.record_screen
                      .unsupported_copy.title
                  : 'Unsupported Browser'
              }
              description={
                Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.record_screen
                      .unsupported_copy.description
                  : 'Your browser does not allow video recordings. We recommend Google Chrome or using a smartphone. Scan the QR-Code below OR copy the link to get started.'
              }
              setAttentionprompt={() => setAttentionprompt(!isAttentionprompt)}
              showQR={true}
              notSupported={true}
            />
          </Fragment>
        )}

      <style jsx>
        {`
          .switch__wrapper {
            position: absolute;
            top: 32px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            max-width: 350px;
            z-index: 4;
          }
          .switch {
            border-radius: 25px;
            border: 1px solid ${store.state.app.branding.primaryColour};
            color: white;
            width: 100%;
          }
          .option {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: bold;
            line-height: 9px;
            letter-spacing: 1px;
            padding: 16px 16px 12px;
            color: ${store.state.app.branding.secondaryColour};
            width: 100%;
            cursor: pointer;
            white-space: nowrap;
          }
          .option:hover {
            color: ${store.state.app.branding.primaryColour};
          }
          .option--active {
            background: ${store.state.app.branding.primaryColour};
            border-radius: 25px;
          }
          .option--active:hover {
            color: inherit;
          }
        `}
      </style>
    </div>
  );
};

export default DesktopFeatureSwitch;
