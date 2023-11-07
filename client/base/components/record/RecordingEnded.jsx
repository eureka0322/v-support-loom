import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import ActionButton from '../../../shared/components/button/ActionButton';
import ExternalButton from '../../../shared/components/button/ExternalButton';

const RecordingEnded = ({ headline, description, vsUrl, videoUrl }) => {
  const handleCopyClick = (e) => {
    if (vsUrl.length !== 0) {
      navigator.clipboard
        .writeText(vsUrl)
        .then(() => {
          toast.success('Url copied', { position: 'bottom-right' });
        })
        .catch((err) => {
          console.error('[copy]', err);
          toast.error('Url copied failed', { position: 'bottom-right' });
        });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      //setPrompt(true);
    }, 3000);
  }, []);

  return (
    <div className="recording-ended-wrapper">
      {headline && description && (
        <header className="dpf cnw aic header__content">
          <h1 className="headline__header">{headline}</h1>
          <p className="description__header">{description}</p>
        </header>
      )}
      <div className="dpf cnw aic wrapper">
        <p className="text text--uppercase">share video</p>
        <div className="dpf cnw jcc aic video">
          <a
            href={vsUrl}
            className="dpf rnw aic link link--external"
            target={'_blank'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0b0b0b"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ic-external"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span className="link-text">link</span>
          </a>
          <video
            controls
            playsInline
            muted
            autoPlay
            loop
            src={videoUrl}
            className="vid"
          />
        </div>
        <div className="dpf cnw aic input__group">
          <input
            type="text"
            name="url"
            id="url"
            className="input__text"
            value={vsUrl}
            disabled
          />
          <ActionButton
            onClick={handleCopyClick}
            type="lg"
            label="Copy &amp; share url"
            style="primary"
            stretch={true}
          />
        </div>
      </div>
      <div className="dpf cnw aic divider">
        <div className="line"></div>
      </div>
      <div className="dpf cnw aic button__group">
        <ExternalButton
          to={'/record'}
          type="lg"
          label="Record new video"
          style="secondary"
          stretch={true}
        />
      </div>
      <style jsx>{`
        .recording-ended-wrapper {
          width: 100%;
          max-width: 288px;
          margin: 0 auto;
        }
        .headline__header {
          font-size: 38px;
          font-weight: 700;
          line-height: 40px;
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

        .steps-content {
          width: 100%;
          margin-top: 16px;
        }

        .wrapper {
          width: 100%;
          margin: 24px 0;
        }

        .text--uppercase {
          color: #0b0b0b;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          line-height: 10px;
          letter-spacing: 1px;
        }

        .video {
          position: relative;
          cursor: pointer;
          width: 100%;
          height: 0;
          padding-bottom: 56.5%;
          background: white;
          overflow: hidden;
          margin-top: 16px;
          margin-bottom: 16px;
          border-radius: 5px;
        }

        .link {
          position: absolute;
          top: 4px;
          right: 4px;
          z-index: 1;
          background: white;
          border-radius: 2px;
          padding: 8px 7px 5px;
        }

        .link:active {
          color: #0b0b0b;
        }

        .link:hover {
          text-decoration: underline;
        }

        .ic-external {
          position: relative;
          top: -2px;
        }

        .link-text {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #0b0b0b;
          margin-left: 6px;
        }

        .vid {
          position: absolute;
          bottom: 0;
          width: 100%;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .text--background {
          padding: 4px 8px;
          background: white;
          position: relative;
          z-index: 1;
        }

        .input__group {
          width: 100%;
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

        .button__group {
          width: 100%;
        }

        .button--secondary {
          margin-top: 0;
          background: white;
          color: #8614f8;
          border: 1px solid #e5e6e6;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.05),
            inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
        }

        .divider {
          width: 100%;
          max-width: 288px;
          margin: 0 auto 24px;
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

        @media only screen and (max-width: 860px) {
          .recording-ended-wrapper {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default RecordingEnded;
