import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import ContentWrapperWithHeader from './ContentWrapperWithHeader';
import FrameButton from './FrameButton';

const RequestVideo = ({ subtitle, subdescription, videoLink, sendToChat }) => {
  const selectRef = useRef(null);

  const selectText = () => {
    if (selectRef.current) {
      selectRef.current.select();
    }
  };

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.addEventListener('copy', (e) => {
        toast.success('Link copied');
      });
    }
    return () => {};
  }, []);

  return (
    <section className="dpf cnw aic request-video">
      <ContentWrapperWithHeader
        subtitle={subtitle}
        subdescription={subdescription}
      >
        {sendToChat && sendToChat.active && (
          <FrameButton
            label={'Request video'}
            onClick={sendToChat.action}
            disabled={!sendToChat.active && videoLink === null}
          />
        )}
      </ContentWrapperWithHeader>
      {sendToChat && !sendToChat.active && (
        <ContentWrapperWithHeader>
          <div className="dpf cnw aic input__group">
            <label
              className="description text text--label"
              htmlFor="videosupport-url"
            >
              copy me anywhere you like:
            </label>
            <input
              ref={selectRef}
              name="videosupport-url"
              id="videosupport-url"
              className="input__text"
              defaultValue={videoLink}
              placeholder="Loading..."
              onFocus={selectText}
            />
          </div>
        </ContentWrapperWithHeader>
      )}
      <style jsx>{`
        .request-video {
          width: 100%;
        }
        .switch {
          border-radius: 26px;
          border: 1px solid #e5e6e6;
          color: white;
          width: 100%;
          margin-top: 16px;
          border: solid 1px #e5e6e6;
        }
        .description {
          width: 100%;
          margin: 8px auto 0;
        }
        .description--small {
          width: 100%;
          max-width: 75%;
          margin: 8px auto 0;
        }
        .text {
          font-size: 16px;
          line-height: 12px;
          color: #A1A1A1;
          text-align: center;
        }
        .text--small {
          font-size: 12px;
          line-height: 22px;
        }
        .text.text--label {
          text-transform: uppercase;
          font-weight: bold;
          letter-spacing: 1px;
          font-size: 12px;
          line-height: 8px;
          margin-bottom: 8px;
          color: #0b0b0b;
          cursor: pointer;
        }
        .copy-video {
          padding: 24px 0;
        }
        .input__group {
          width: 100%;
          margin-top: -24px;
        }
        .input__text {
          width: 100%;
          border-radius: 5px;
          font-size: 16px;
          line-height: 32px;
          color: #0b0b0b;
          background: #fff;
          padding: 10px 12px 8px;
          text-overflow: ellipsis;
          border: solid 1px #e5e6e6;
        }
        .input__text:focus {
          outline: none;
          border: 1px solid #8614f8;
        }
        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
        }
        .videotype__wrapper {
          width: 100%;
        }
        .input__text:-webkit-autofill {
          box-shadow: 0 0 0 30px white inset';
          border: #e5e6e6;
          -webkit-text-fill-color: #0b0b0b;
        }
        .input__text:-webkit-autofill:focus {
          border: 1px solid #8614f8;
        }
      `}</style>
    </section>
  );
};

export default RequestVideo;
