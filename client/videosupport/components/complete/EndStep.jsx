import React from 'react';
import { useStore } from '../../store/index';
import HeadlineWithDescription from '../misc/HeadlineWithDescription';
import SupportReplyModal from './SupportReplyModal';

import FormButton from './FormButton';

const EndStep = ({ headline, descriptions, recLink }) => {
  const store = useStore();
  const handleCopyClick = (e) => {
    e.preventDefault();
    if (recLink) {
      navigator.clipboard
        .writeText(recLink)
        .then(() => {
          toast.success('Url copied');
        })
        .catch((err) => {
          console.error('[copy]', err);
          toast.error('Url copied failed');
        });
    }
  };
  return (
    <div className="step__end">
      <HeadlineWithDescription
        headline={headline}
        descriptions={descriptions}
      />
      {store.state.videosupport.options &&
        store.state.videosupport.options.isSupportReply &&
        store.state.videosupport.options.showLinkAfterRecording && (
          <SupportReplyModal />
        )}
      {recLink && (
        <div className="dpf cnw aic input__group">
          <input
            type="text"
            name="url"
            id="url"
            className="input__text"
            value={recLink}
            disabled
          />
          <button type="submit" className="button" onClick={handleCopyClick}>
            Copy &amp; share url
          </button>
        </div>
      )}
      <div className="button__wrapper">
        <FormButton
          style="primary"
          text={
            Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.complete_modal
                  .primary_button_copy
              : 'Record a new video'
          }
          link={`/record`}
        />
        <FormButton
          style="secondary"
          text={
            Object.values(store.state.language.translations).length !== 0
              ? store.state.language.translations.complete_modal
                  .secondary_button_copy
              : "I'm done"
          }
          link={
            store.state.app.branding.referrerUrl || store.state.app.referrerUrl
          }
        />
      </div>
      <style jsx>{`
        .step__end {
          width: 100%;
          max-width: ${store.state.device.platform &&
          store.state.device.platform.type === 'desktop'
            ? '425px'
            : '100%'};
          margin: 0 auto;
        }
        .email__content {
          width: 100%;
          margin-top: 8px;
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
        .text--underline {
          text-decoration: underline;
        }
        .email__input__wrapper {
          width: 100%;
          margin-top: 4px;
        }
        .confirmed__email {
          width: 100%;
          padding: 10px 16px 7px;
          border-radius: 5px;
          color: #009900;
          background: #ebffeb;
          border: 1px solid #009900;
        }
        .button__edit {
          width: 100%;
          margin-top: 8px;
          padding: 10px 16px 7px;
          border-radius: 5px;
          border: 1px solid #dddddd;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
        }
        .button__edit:active {
          border: 1px solid #0b0b0b;
        }
        .button__secondary__icon {
          fill: none;
          stroke: #dddddd;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-miterlimit: 10;
          margin-right: 8px;
        }
        .button__wrapper {
          width: 100%;
          margin-top: 24px;
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
        }
      `}</style>
    </div>
  );
};

export default EndStep;
