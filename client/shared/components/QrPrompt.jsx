import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QrCode from 'qrcode.react';

import { baseUrl } from '../../env.config';

const QrPrompt = ({ title, text }) => {
  const [url, setUrl] = useState('');
  useEffect(() => {
    axios
      .post(baseUrl('api/open/create/link'), {
        options: {
          showLinkAfterDone: true,
          tinyUrl: true,
        },
      })
      .then((res) => {
        setUrl(res.data);
      });
  }, []);

  return (
    <div className="dpf qr-prompt">
      <div className="cnw aic qr-prompt-content">
        <div className="headline">{title}</div>
        <p className="text">{text}</p>
        <div className="dpf jcc aic qr-code-wrapper">
          {url && url.length !== 0 ? (
            <QrCode
              size={114}
              level="L"
              value={url}
              renderAs="svg"
              className="dpf qr-code"
              fgColor="#0b0b0b"
            />
          ) : (
            <div className="dpf jcc aic qr-code-dummy">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="114px"
                height="114px"
                viewBox="0 0 114 114"
                className="dpf qr-dummy"
              >
                <path
                  fill="#E5E6E6"
                  d="M4.6,45.6h13.7v4.6H9.1v4.6v4.6H4.6v4.6v4.6V73v4.6H0V73v-4.6v-4.6v-4.6v-4.6v-4.6h4.6V45.6z M104.9,73h-4.6
           v4.6h4.6V73z M22.8,59.3v4.6h4.6v-4.6H22.8z M91.2,36.5h-4.6V41v4.6h4.6V41V36.5z M104.9,18.2v-4.6V9.1H91.2v4.6v4.6v4.6h13.7V18.2z
            M77.5,31.9v-4.6H73v4.6H77.5z M22.8,41v-4.6H0V41v4.6h4.6V41h13.7v4.6h9.1V41H22.8z M77.5,0H73v4.6h4.6V0z M41,4.6h-4.6v4.6H41V4.6
           z M0,82.1h31.9v4.6v4.6v4.6v4.6v4.6v4.6v4.6H0v-4.6v-4.6v-4.6v-4.6v-4.6v-4.6V82.1z M4.6,86.6v4.6v4.6v4.6v4.6v4.6h22.8v-4.6v-4.6
           v-4.6v-4.6v-4.6H4.6z M9.1,13.7v4.6v4.6h13.7v-4.6v-4.6V9.1H9.1V13.7z M50.2,4.6V0h-4.6v4.6v4.6h4.6V4.6z M114,0v4.6v4.6v4.6v4.6
           v4.6v4.6v4.6H82.1v-4.6v-4.6v-4.6v-4.6V9.1V4.6V0H114z M109.4,4.6H86.6v4.6v4.6v4.6v4.6v4.6h22.8v-4.6v-4.6v-4.6V9.1V4.6z
            M22.8,100.3v-4.6v-4.6H9.1v4.6v4.6v4.6h13.7V100.3z M31.9,31.9H0v-4.6v-4.6v-4.6v-4.6V9.1V4.6V0h31.9v4.6v4.6v4.6v4.6v4.6v4.6V31.9
           z M27.4,27.4v-4.6v-4.6v-4.6V9.1V4.6H4.6v4.6v4.6v4.6v4.6v4.6H27.4z M86.6,82.1h-4.6v4.6h4.6V82.1z M31.9,54.7h-4.6v4.6h4.6V54.7z
            M100.3,45.6h-9.1v4.6h9.1V45.6z M54.7,31.9h4.6v-4.6h4.6v-4.6H50.2v4.6h4.6V31.9z M45.6,41v-4.6h4.6V41h4.6v-4.6v-4.6h-4.6v-4.6
           h-4.6v4.6H41v4.6H27.4V41H41H45.6z M27.4,45.6v4.6h4.6v-4.6H27.4z M36.5,59.3v4.6v4.6H41v-4.6v-4.6v-4.6v-4.6h-9.1v4.6h4.6V59.3z
            M68.4,18.2H73v4.6h4.6v-4.6v-4.6H73V9.1V4.6h-9.1V0h-9.1v4.6h4.6v4.6h4.6v4.6h-4.6V9.1h-4.6v4.6v4.6h9.1v4.6h4.6V18.2z M45.6,27.4
           v-4.6v-4.6h4.6v-4.6H36.5v4.6H41v4.6h-4.6v4.6v4.6H41v-4.6H45.6z M100.3,36.5h-4.6V41h4.6V36.5z M109.4,41v-4.6h-4.6V41v4.6v4.6h4.6
           v4.6h-9.1v4.6h4.6v4.6v4.6h4.6V73h4.6v-4.6v-4.6h-4.6v-4.6h4.6v-4.6v-4.6v-4.6h-4.6V41z M95.8,59.3h4.6v4.6v4.6h-4.6V73v4.6h4.6v4.6
           h-4.6v4.6h4.6v4.6h-4.6v4.6h4.6v-4.6h4.6v-4.6h-4.6v-4.6H114v4.6h-4.6v4.6h4.6v4.6v4.6v4.6v4.6v4.6H77.5v-4.6H63.8v-4.6h-9.1v4.6
           h4.6v4.6h-9.1v-4.6v-4.6h-4.6v4.6v4.6h-9.1v-4.6v-4.6v-4.6v-4.6v-4.6H41v-4.6h-4.6v-4.6v-4.6H22.8V73h-4.6v4.6H9.1V73v-4.6v-4.6h4.6
           v-4.6v-4.6h4.6v4.6v4.6v4.6h9.1V73h4.6v-4.6h4.6V73H41v4.6h4.6V73h4.6h4.6v4.6h-4.6v4.6v4.6v4.6v4.6H41v4.6h18.2v-4.6h-4.6v-4.6
           v-4.6h4.6v4.6h4.6v-4.6h4.6v4.6H73v-4.6v-4.6v-4.6h-9.1v4.6h-9.1v-4.6h4.6V73H73h9.1v-4.6H73v-4.6v-4.6V45.6V41h-4.6h-4.6h-4.6v-4.6
           h9.1v-4.6H73v4.6h9.1V41h-4.6v4.6v4.6h13.7v4.6h4.6V59.3h-4.6v4.6h4.6V59.3z M73,104.9v-4.6v-4.6h-9.1v4.6h4.6v4.6H73z M109.4,100.3
           h-4.6v4.6h-4.6v4.6h9.1v-4.6V100.3z M91.2,100.3v-4.6h-4.6v4.6h-9.1v4.6h18.2v-4.6H91.2z M91.2,77.5H77.5v4.6v4.6v4.6h13.7v-4.6
           v-4.6V77.5z M86.6,63.8v-4.6h-9.1v4.6H86.6z M63.8,27.4v4.6h4.6v-4.6H63.8z M31.9,63.8h-4.6v4.6h4.6V63.8z M68.4,27.4H73v-4.6h-4.6
           V27.4z"
                />
              </svg>
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="17px"
                height="17px"
                viewBox="0 0 17 17"
                className="loader"
              >
                <g id="circle">
                  <circle
                    id="loader-circle"
                    className="loader-circle"
                    cx="8.5"
                    cy="8.5"
                    r="7"
                  />
                  <path
                    id="loader-path"
                    className="loader-path"
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
          )}
        </div>
      </div>
      <style jsx>{`
        .qr-prompt {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 6;
        }
        .qr-prompt-content {
          padding: 24px;
          background: var(--white);
          border-radius: 10px;
          box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
        }

        .headline {
          font-size: var(--fs-lg);
          font-weight: 500;
          text-align: center;
        }

        .text {
          text-align: center;
          color: var(--dark-gray);
          margin: 8px 0 0;
          line-height: 24px;
        }

        .qr-wrapper {
          margin: 24px 0 8px;
        }

        .qr-code-wrapper {
          border: 2px solid #e5e6e6;
          padding: 18px;
          margin: 8px;
          border-radius: 10px;
          width: 154px;
          height: 154px;
          background: white;
          position: relative;
        }

        .qr-code-dummy {
          position: relative;
        }

        .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .loader-circle {
          fill: none;
          stroke: #0b0b0b;
          stroke-width: 3;
          stroke-opacity: 0.3;
        }

        .loader-path {
          fill: none;
          stroke: #0b0b0b;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}</style>
    </div>
  );
};

export default QrPrompt;
