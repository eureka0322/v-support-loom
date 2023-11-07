import React from 'react';
import QrCode from 'qrcode.react';
import { toast } from 'react-hot-toast';

import ActionButton from '../../../shared/components/button/ActionButton';
import ExternalButton from '../../../shared/components/button/ExternalButton';

const GenerateQr = ({ headline, description, url, images, isMobileDevice }) => {
  const handleCopyClick = () => {
    if (url.length !== 0) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          toast.success('Url copied', { position: 'bottom-right' });
        })
        .catch((err) => {
          console.error('[copy]', err);
          toast.error('Url copied failed', { position: 'bottom-right' });
        });
    }
  };

  return (
    <React.Fragment>
      {headline && description && (
        <header className="dpf cnw aic header__content">
          <h1 className="headline__header">{headline}</h1>
          <p className="description__header">{description}</p>
          <div className="dpf rnw aic jcc images">
            {images &&
              images.length !== 0 &&
              images.map((image) => {
                return (
                  <img
                    key={image.id}
                    src={image.image}
                    alt="image"
                    className={`dpf image ${image.type}`}
                  />
                );
              })}
          </div>
        </header>
      )}
      <div
        className={`dpf cnw aic qr-wrapper ${
          isMobileDevice ? 'qr-wrapper--mobile' : ''
        }`}
      >
        <p className="text text--uppercase">scan qr</p>
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
        <p className="text text--uppercase">to record</p>
      </div>
      <ExternalButton
        to={url}
        type="lg"
        label="Start Recording"
        style="primary"
        stretch={true}
        disabled={url.length === 0}
      />
      <div
        className={`dpf cnw aic divider ${
          isMobileDevice ? 'divider--mobile' : ''
        }`}
      >
        <p className="text text--uppercase text--background">or</p>
        <div className="line"></div>
      </div>
      <div
        className={`dpf cnw aic input__group ${
          isMobileDevice ? 'input__group--mobile' : ''
        }`}
      >
        <p className="text text--uppercase">share url</p>
        <input
          type="text"
          name="url"
          id="url"
          className="input__text"
          value={url}
          placeholder="Loading..."
          disabled
        />
        <ActionButton
          label="Copy &amp; share url"
          onClick={handleCopyClick}
          disabled={url.length === 0}
          type="lg"
          style="primary"
          stretch={true}
        />
      </div>
      <style jsx>{`
        .content {
          width: 100%;
          max-width: 502px;
          margin: 0 auto;
        }

        .headline__header {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
        }

        .description__header {
          width: 100%;
          margin: 8px auto 0;
          color: #a1a1a1;
          text-align: center;
          line-height: 24px;
        }

        .text {
          font-size: 18px;
          line-height: 36px;
          color: #0b0b0b;
          text-align: center;
        }

        .qr-wrapper {
          margin: 24px 0 8px;
        }

        .text--uppercase {
          color: #0b0b0b;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          line-height: 10px;
          letter-spacing: 1px;
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

        .qr-wrapper--mobile {
          display: none;
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

        .divider {
          width: 100%;
          max-width: 288px;
          margin: 16px auto;
          position: relative;
        }

        .line {
          position: absolute;
          top: calc(50% - 1px);
          left: 0;
          height: 1px;
          background: #e5e6e6;
          width: 100%;
          z-index: 0;
        }

        .text--background {
          padding: 4px 8px;
          background: white;
          position: relative;
          z-index: 1;
        }

        .input__group {
          width: 100%;
          max-width: 288px;
          margin: 0 auto;
        }

        .input__text {
          width: 100%;
          padding: 14px 16px 10px;
          border-radius: 5px;
          font-size: 16px;
          line-height: 21px;
          color: #0b0b0b;
          background: white;
          border: 1px solid #e5e6e6;
          transition: border ease-out 0.15s;
          cursor: not-allowed;
          text-align: center;
          text-overflow: ellipsis;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }

        .button {
          width: 100%;
          font-size: 14px;
          line-height: 10px;
          font-weight: 500;
          background: #8614f8;
          border-radius: 5px;
          color: white;
          transition: background 0.15s;
          border: 1px solid transparent;
          position: relative;
          cursor: pointer;
          padding: 19px 24px 16px 24px;
          text-align: center;
          margin-top: 8px;
        }
        .button:hover {
          color: #8614f8;
          background: white;
          border: 1px solid #8614f8;
        }

        .button--rec {
          max-width: 288px;
          display: none;
        }

        .button--rec--mobile {
          display: flex;
          margin-top: 16px;
        }

        .button--rec--disabled,
        .button:disabled {
          background: #5e05b7;
          cursor: not-allowed;
        }

        .images {
          display: none;
          overflow: hidden;
          margin-top: 24px;
          margin-bottom: 8px;
        }

        .image {
          background: white;
          border: 2px solid #e5e6e6;
          border-radius: 2px;
          width: 72px;
          height: 72px;
        }

        .image.human {
          border: 2px solid #8614f8;
        }

        .image + .image {
          margin-left: 8px;
        }

        @media only screen and (max-width: 860px) {
          .images {
            display: flex;
            width: 100%;
          }
        }

        @media only screen and (max-width: 520px) {
          .input__group,
          .button--rec {
            max-width: 100%;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default GenerateQr;
