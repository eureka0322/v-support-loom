import React, { useState, useEffect } from 'react';
import { useAccountStore } from '../../../store';
import apiCreateVideoScreen from '../../../../shared/utils/apiCreateVideoScreen';
import toast from 'react-hot-toast';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import Cookies from 'cookies-js';

const ApiContent = () => {
  const store = useAccountStore();
  const [videoLink, setVideoLink] = useState('Loading...');
  const [linksLoaded, setLinksLoaded] = useState(false);
  const query = useQueryString();

  const copyVideoToClipboard = () => {
    navigator.clipboard
      .writeText(videoLink)
      .then(() => {
        toast.success('Link copied');
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (store.state.client.id) {
      const token =
        query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');
      apiCreateVideoScreen(
        token,
        setVideoLink,
        undefined,
        undefined,
        { tinyUrl: true },
        []
      ).then((_) => {
        setLinksLoaded(true);
      });
    }
    return () => {};
  }, [store.state.client.id]);

  return (
    <div className="dpf cnw block">
      <header className="header">
        <h2 className="headline">Generate a link to send your customers</h2>
        <p className="text">
          With this link your customers can easily record videos without any
          installs or technical knowledge
        </p>
      </header>
      <form className="dpf aic form">
        <div className="dpf cnw input__group">
          <div className="dpf cnw input__content">
            <label htmlFor="videolink" className="input__label">
              Videosupport:
            </label>
            <input
              type="text"
              className="input__text"
              id="videolink"
              value={videoLink}
              readOnly
            ></input>
            <input
              type="button"
              className="dpif aic jcc button"
              value="Copy"
              onClick={copyVideoToClipboard}
              disabled={!linksLoaded}
            ></input>
          </div>
        </div>
      </form>
      <style jsx>{`
        .block {
          padding-bottom: 64px;
        }
        .header {
          margin-bottom: 16px;
        }

        .header__screen {
          margin-top: 48px;
        }

        .headline {
          font-size: 22px;
          font-weight: 500;
        }

        .form {
          width: 100%;

          position: relative;
        }

        .input__group {
          width: 100%;
        }

        .input__content + .input__content {
          margin-top: 32px;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
          color: #0b0b0b;
        }

        .description {
          margin: 4px 0 8px;
        }
        .text {
          color: #a1a1a1;
          font-size: 14px;
          line-height: 22px;
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
          resize: none;
        }

        .input__text:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .input__text::placeholder {
          font-size: 16px;
          line-height: 26px;
          color: #c2c2c2;
        }

        .input__text:-webkit-autofill {
          box-shadow: 0 0 0 30px white inset;
          border: 1px solid #e5e6e6;
          -webkit-text-fill-color: #0b0b0b;
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .logo__wrapper {
          border-radius: 5px;
          background: #0b0b0b;
          padding: 8px;
          margin: 0 0 8px 0;
        }

        .button {
          align-self: flex-start;
          padding: 16px 24px 14px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: white;
          background: #8614f8;
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
          cursor: pointer;
          user-select: none;
          margin: 8px 0 0;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
          vertical-align: middle;
        }

        .button:hover {
          color: white;
          background: #6606c6;
        }

        .button:disabled {
          background: #e5e6e6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ApiContent;
