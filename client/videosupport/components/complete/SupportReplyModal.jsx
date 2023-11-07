import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { baseUrl } from '../../../env.config';
import { useStore } from '../../store';

const SupportReplyModal = () => {
  const store = useStore();
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
      const recordingUrl = baseUrl(
        `recording/${store.state.db.previousRecordedRefId}?type=customer`,
      );
      setTinyUrl(recordingUrl);
    }
    createUrl();
  }, []);

  return (
    <div className={`dpf cnw aic modal`}>
      <p className="description text">
        {Object.values(store.state.language.translations).length !== 0
          ? store.state.language.translations.complete_modal.support_reply
              .description
          : 'Copy & share the the recording with your customer:'}
      </p>
      <div className="dpf rnw jcsb copy__link__wrapper">
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
            : 'Copy'}
        </button>
      </div>
      <style jsx>{`
        .modal {
          width: 100%;
          margin-top: 16px;
        }

        .description {
          width: 100%;
          max-width: 85%;
        }
        .text {
          font-size: 16px;
          line-height: 26px;
          color: #a1a1a1;
          text-align: center;
        }

        .copy__link__wrapper {
          width: 100%;
          margin-top: 8px;
        }

        .input__text {
          width: 100%;
          max-width: 70%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: transparent;
          border: 1px solid #e5e6e6;
          transition: all ease-in-out 0.15s;
          text-align: center;
          cursor: text;
          text-overflow: ellipsis;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .copy__link__button {
          width: 100%;
          max-width: 28%;
          padding: 20px 24px 18px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          line-height: 11px;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          color: white;
          background: ${store.state.app.branding.primaryColour};
          box-shadow: inset 0 1px 1px rgba(245, 244, 247, 0.25);
        }
      `}</style>
    </div>
  );
};

export default SupportReplyModal;
