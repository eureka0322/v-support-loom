import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import QrCode from 'qrcode.react';
import { shorten } from 'tinyurl';
import { useStore } from '../../store';

import PoweredBy from './PoweredBy';

import { theme } from '../../../theme.config';
import { baseUrl, videoUrl } from '../../../env.config.js';

const VideoNotSupported = ({
  type,
  tag,
  headline,
  description,
  action,
  actionText,
}) => {
  const store = useStore();
  const location = useLocation();
  const [tinyUrl, setTinyUrl] = useState('');

  useEffect(() => {
    if (store.state.device.platform.type === 'desktop') {
      async function createUrl() {
        const pathname = location.pathname;
        let webUrl;
        if (baseUrl().indexOf('ngrok') !== -1) {
          /* ngrok.io is an illegial domain due to tinyurl */
          webUrl = `http://192.168.1.8:3000/v/${pathname}`;
        } else {
          webUrl = videoUrl(pathname);
        }
        const tinyUrl = await shorten(webUrl).catch((error) =>
          console.error('[tiny][error]', error.message),
        );
        if (tinyUrl) {
          setTinyUrl(tinyUrl);
        }
      }
      createUrl();
    }
  }, []);

  return (
    <div className="dpf cnw aic video-not-supported">
      <header className="dpf cnw aic header">
        {type && tag && <span className={`type ${type}`}>{tag}</span>}
        <h1 className="headline">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.camera_denied_screen.title
            : headline}
        </h1>
        <h2 className="subheadline subheadline--accent">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.camera_denied_screen.subtitle
            : 'How to fix?'}
        </h2>
        <p className="description text">
          {Object.values(store.state.language.translations).length !== 0
            ? store.state.language.translations.camera_denied_screen.description
            : description}
        </p>
      </header>
      <h2 className="subheadline subheadline--accent">
        {Object.values(store.state.language.translations).length !== 0
          ? store.state.language.translations.camera_denied_screen
              .second_solution_seperator
          : 'or'}
      </h2>
      <div className="dpf cnw aic content">
        {action && actionText && (
          <div className="dpf jcc fileupload__wrapper">
            <label
              className="dpf aic jcc fileupload__button"
              htmlFor="file-upload"
            >
              <svg
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24"
                height="24"
                fill="white"
                className="file-icon"
              >
                <path d="M 12.5 4 C 10.032499 4 8 6.0324991 8 8.5 L 8 39.5 C 8 41.967501 10.032499 44 12.5 44 L 35.5 44 C 37.967501 44 40 41.967501 40 39.5 L 40 18.5 A 1.50015 1.50015 0 0 0 39.560547 17.439453 L 39.544922 17.423828 L 26.560547 4.4394531 A 1.50015 1.50015 0 0 0 25.5 4 L 12.5 4 z M 12.5 7 L 24 7 L 24 15.5 C 24 17.967501 26.032499 20 28.5 20 L 37 20 L 37 39.5 C 37 40.346499 36.346499 41 35.5 41 L 12.5 41 C 11.653501 41 11 40.346499 11 39.5 L 11 8.5 C 11 7.6535009 11.653501 7 12.5 7 z M 27 9.1210938 L 34.878906 17 L 28.5 17 C 27.653501 17 27 16.346499 27 15.5 L 27 9.1210938 z M 19.5 22.001953 C 19.063113 22.001953 18.621286 22.116022 18.228516 22.347656 C 17.464346 22.799097 17 23.613909 17 24.5 L 17 35.5 C 17 36.383233 17.461556 37.196679 18.224609 37.648438 C 19.003103 38.111888 19.917945 38.123809 20.705078 37.691406 L 30.705078 32.189453 L 30.707031 32.189453 C 31.499872 31.751996 32 30.910205 32 30 C 32 29.089795 31.499919 28.248002 30.707031 27.810547 L 30.705078 27.810547 L 20.703125 22.308594 L 20.701172 22.308594 C 20.327173 22.104115 19.912988 22.001953 19.5 22.001953 z M 20 25.34375 L 28.464844 30 L 20 34.65625 L 20 25.34375 z M 19.259766 35.060547 C 19.261166 35.059775 19.262272 35.061306 19.263672 35.060547 L 19.259766 35.0625 L 19.259766 35.060547 z" />
              </svg>
              <span className="label__text">
                {Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.camera_denied_screen
                      .button_copy
                  : actionText}
              </span>
            </label>
            <input
              type="file"
              id="file-upload"
              name="file-upload"
              accept="video/*, video/mp4, video/x-m4v, video/mpeg, video/ogg, video/webm"
              className="fileupload__input"
              onChange={action}
            />
          </div>
        )}
      </div>
      {store.state.device.platform.type === 'desktop' && tinyUrl.length !== 0 && (
        <div className="dpf cnw aic hardware__mode">
          <h2 className="subheadline subheadline--accent">
            {Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.camera_denied_screen
                  .second_solution_seperator
              : 'or'}
          </h2>
          <h1 className="headline">
            {Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.hardware_copy.title
              : 'Hardware Mode'}
          </h1>
          <p className="description text">
            Scan the QR code below to start a recording with your smartphone.
          </p>
          <div className="dpf cnw aic qr">
            <QrCode
              size={128}
              level="L"
              value={tinyUrl}
              renderAs="svg"
              className="orientation-message__qr-code"
              fgColor="white"
              bgColor="#0b0b0b"
            />
            <div className="instructions">
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.orientation_screen
                    .qr_description
                : 'Scan QR-code'}
            </div>
          </div>
        </div>
      )}
      <PoweredBy display="vertical" />
      <style jsx>{`
        .video-not-supported {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 64px 16px;
          overflow-y: auto;
        }
        .video-not-supported::after {
          content: '';
          width: 100%;
          height: 100%;
          position: fixed;
          bottom: -71px;
          left: 50%;
          transform: translateX(-50%);
          background: url('/assets/layout/phone-frame.png') bottom center /
            contain no-repeat;
          z-index: -1;
        }
        .header {
          width: 100%;
          max-width: 420px;
          margin-top: 132px;
        }
        .type {
          font-size: 16px;
          line-height: 26px;
          text-align: center;
          color: white;
          font-weight: 500;
          padding: 10px 12px 6px;
          border-radius: 5px;
          box-shadow: inset 0 1px 1px rgba(245, 244, 247, 0.25);
          margin-bottom: 56px;
        }
        .type.error {
          background: linear-gradient(180deg, #f81414 0%, #e00b0b 100%);
        }
        .logo {
          width: 60px;
          height: 60px;
          margin-bottom: 16px;
        }
        .headline {
          color: white;
          font-size: 26px;
          line-height: 36px;
          font-weight: 500;
          text-align: center;
        }
        .subheadline {
          font-size: 18px;
          margin: 16px 0;
          font-weight: 500;
        }
        .subheadline--accent {
          color: ${theme.primary_colour};
        }
        .description {
          width: 100%;
          max-width: 75%;
        }
        .text {
          font-size: 16px;
          line-height: 28px;
          text-align: center;
          color: #a1a1a1;
        }
        .fileupload__wrapper {
          width: 100%;
          margin-bottom: 8px;
        }
        .fileupload__button {
          height: 54px;
          padding: 13px 22px 15px 22px;
          border-radius: 30px;
          cursor: pointer;
          white-space: nowrap;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;

          background: ${theme.button_secondary_app_background};
          border: 1px solid #dddddd;
          box-shadow: ${theme.button_secondary_app_boxshadow};
        }
        .fileupload__button:active {
          border: 1px solid ${theme.primary_colour};
          background: ${theme.button_secondary_app_text};
        }
        .label__text {
          font-size: 16px;
          color: ${theme.button_secondary_app_text};
          font-weight: 500;
          position: relative;
          top: 3px;
        }
        .fileupload__button:active .label__text {
          color: ${theme.button_secondary_app_background};
        }
        .file-icon {
          margin-right: 8px;
          fill: ${theme.button_secondary_app_text};
        }
        .fileupload__button:active .file-icon {
          fill: ${theme.button_secondary_app_background};
        }
        .fileupload__input {
          display: none;
        }

        .hardware__mode {
          width: 100%;
          max-width: 420px;
        }

        .qr {
          margin-bottom: 32px;
        }

        .instructions {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 0;
          color: white;
        }

        @media screen and (max-width: 500px) {
          .video-not-supported::after {
            content: none;
          }
          .header {
            max-width: 100%;
            padding: 0;
          }
          .description {
            max-width: 90%;
          }
          .fileupload__wrapper {
            margin-bottom: 32px;
          }
        }
      `}</style>
      <style jsx global="true">{`
        .orientation-message__qr-code {
          margin-top: 16px;
          padding: 12px;
          border: 2px solid #262626;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default VideoNotSupported;
