import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import QrCode from 'qrcode.react';
import { shorten } from 'tinyurl';
import { toast } from 'react-hot-toast';

import HeadlineWithDescription from '../misc/HeadlineWithDescription';

import { useStore } from '../../store';
import { baseUrl, videoUrl } from '../../../env.config.js';

const AttentionPrompt = ({ title, description, description2, showQR }) => {
  const store = useStore();

  const location = useLocation();
  const [tinyUrl, setTinyUrl] = useState('');

  const handleCopyClick = (e) => {
    e.preventDefault();
    if (tinyUrl.length !== 0) {
      navigator.clipboard
        .writeText(tinyUrl)
        .then(() => {
          toast.success('Copied');
        })
        .catch((err) => {
          console.error('[copy]', err);
        });
    }
  };

  useEffect(() => {
    async function createUrl() {
      const jwt = store.retrieveCookie();
      const pathname = `record/${jwt}`;
      let webUrl;
      if (baseUrl().indexOf('ngrok') !== -1) {
        /* ngrok.io is an illegial domain due to tinyurl */
        webUrl = `https://192.168.0.1:3000/${pathname}`;
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
  }, []);

  return (
    <div className={`modal`}>
      <div className="modal__inner">
        <section className="dpf cnw aic feedback">
          <HeadlineWithDescription
            headline={title}
            descriptions={[
              {
                id: 'gr1f',
                text: description,
              },
              {
                id: 'fgr1g',
                text: description2,
              },
            ]}
            style="in-modal"
          />
          {showQR && tinyUrl.length !== 0 ? (
            <div className="dpf cnw aic qr">
              <QrCode
                size={128}
                level="L"
                value={tinyUrl}
                renderAs="svg"
                className="orientation-message__qr-code"
                fgColor="#0b0b0b"
              />
              <div className="instructions">
                {Object.values(store.state.language.translations).length !== 0
                  ? store.state.language.translations.orientation_screen
                      .qr_description
                  : 'Scan QR-code'}
              </div>
            </div>
          ) : (
            <div className="dpf cnw aic jcc qr qr__loading">
              <div className="dpf jcc aic message">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="17px"
                  height="17px"
                  viewBox="0 0 17 17"
                  className="uploading__icon"
                >
                  <g id="circle">
                    <circle
                      id="circ"
                      className="circle"
                      cx="8.5"
                      cy="8.5"
                      r="7"
                    />
                    <path
                      id="path"
                      className="path"
                      d="M15.5,8.5c0-3.9-3.1-7-7-7"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 8.5 8.5"
                        to="360 8.5 8.5"
                        dur="1s"
                        repeatCount="indefinite"
                      ></animateTransform>
                    </path>
                  </g>
                </svg>
              </div>
            </div>
          )}
          <div className="dpf cnw copy__link__wrapper">
            <input
              type="text"
              className="input__text"
              disabled
              value={tinyUrl.length !== 0 ? tinyUrl : 'Loading ...'}
            />
            <button
              onClick={handleCopyClick}
              className="copy__link__button"
              disabled={tinyUrl.length !== 0 ? false : true}
            >
              {Object.values(store.state.language.translations).length !== 0
                ? store.state.language.translations.record_screen.hardware_copy
                    .button_copy
                : 'Copy link'}
            </button>
          </div>
        </section>
      </div>

      <style jsx>{`
        .modal {
          position: absolute;
          top: 55px;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3;
          display: flex;
          animation: fadeIn 0.6s ease-in;
        }

        .modal__inner {
          position: absolute;
          top: 0;
          left: 50%;
          width: 100%;
          max-width: 425px;
          transform: translateX(-50%);
        }

        .feedback {
          width: 100%;
          background: white;
          padding: 40px 24px;
          background: #ffffff;
          box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .button__wrapper {
          width: 100%;
          margin-top: 24px;
        }

        .background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: -1;
        }

        .instructions {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 8px 0;
        }

        .copy__link__wrapper {
          width: 100%;
          margin-top: 8px;
        }

        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: transparent;
          border: 1px solid #e5e6e6;
          transition: all ease-in-out 0.15s;
          text-align: center;
          cursor: text;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .copy__link__button {
          width: 100%;
          padding: 20px 24px 18px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          line-height: 11px;
          margin-top: 8px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          color: white;
          background: ${store.state.app.branding.primaryColour};
          box-shadow: inset 0 1px 1px rgba(245, 244, 247, 0.25);
        }

        .qr__loading {
          width: 128px;
          height: 128px;
          padding: 12px;
          border: 1px solid #0b0b0b;
          border-radius: 5px;
          margin-top: 16px;
        }

        .circle {
          fill: none;
          stroke: #0b0b0b;
          stroke-width: 3;
          stroke-opacity: 0.3;
        }

        .path {
          fill: none;
          stroke: #0b0b0b;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <style jsx global="true">{`
        .orientation-message__qr-code {
          margin-top: 16px;
          padding: 12px;
          border: 1px solid #0b0b0b;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default AttentionPrompt;
