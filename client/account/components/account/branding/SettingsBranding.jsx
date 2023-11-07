import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { baseUrl } from '../../../../env.config';
import { useAccountStore } from '../../../store/index';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import Cookies from 'cookies-js';

const SettignsBranding = () => {
  const store = useAccountStore();
  const brandingPrimaryColourRef = useRef(null);
  const brandingSecondaryColourRef = useRef(null);
  const brandingLogoRef = useRef(null);
  const [isUpdated, setUpdated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isScreenUpdated, setSreenUpdated] = useState(false);
  const query = useQueryString();

  // TODO(Joao): _check_v2
  // why?
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setUpdated(false);
    }, 2000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [isUpdated]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setSreenUpdated(false);
    }, 2000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [isScreenUpdated]);

  const handleUploadLogo = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);

      const token =
        query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');

      axios({
        method: 'POST',
        url: baseUrl('db/upload/logo'),
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(({ data }) => {
          if (data.status === 'error') {
            reject(data);
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleUploadOrVideo = (file) => {
    const url = URL.createObjectURL(file);
    store.setClientBrandingLogo(url);

    const uploadLogo = handleUploadLogo(file);
    setIsUploading(true);

    toast.promise(
      uploadLogo,
      {
        loading: 'Processing...',
        success: 'Upload finished',
        error: 'Upload failed',
      },
      {
        loading: {
          duration: 999999999,
        },
        success: {
          duration: 2000,
        },
        error: {
          duration: 3000,
        },
      }
    );

    uploadLogo
      .then((data) => {
        if (data.status === 'ok') {
          store.setClientBrandingLogo(data.url);
          setIsUploading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsUploading(false);
      });
  };

  const readFile = (file) => {
    if (file.type && file.type.indexOf('image') === -1) {
      toast.error('File not supported');
      return;
    }

    const MAX_MB = 2 * 1024 * 1024; // 2 MB

    if (file.size > MAX_MB) {
      toast.error('File too large');
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.addEventListener('error', () => {
      toast.error('Upload failed');
    });

    reader.addEventListener('load', () => {
      handleUploadOrVideo(file, { type: 'upload' });
    });
  };

  const handleFileChange = ({ target }) => {
    const upload = target.files[0];
    readFile(upload);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const primaryColour = brandingPrimaryColourRef.current.value;
    const secondaryColour = brandingSecondaryColourRef.current.value;
    const uploadedLogo = store.state.client.settings.app.branding.logo;
    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    const response = await axios({
      url: baseUrl('db/branding/update'),
      method: 'POST',
      data: {
        primaryColour: primaryColour,
        secondaryColour: secondaryColour,
        logo: uploadedLogo,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      console.error('[db/submit/settings]', err);
    });

    if (
      Object.keys(response.data).length !== 0 &&
      response.data.status === 'ok'
    ) {
      setUpdated(true);
      store.setClientBranding(primaryColour, secondaryColour, uploadedLogo);
    }
  };

  return (
    <div className="dpf cnw block">
      <header className="header">
        <h2 className="headline">Add custom colours</h2>
      </header>
      <form className="dpf aic form" onSubmit={handleOnSubmit}>
        <div className="dpf cnw input__group">
          <div className={`dpf cnw input__content`}>
            <label htmlFor="primaryColour" className="input__label">
              Primary brand colour
            </label>
            <input
              ref={brandingPrimaryColourRef}
              type="text"
              className="input__text"
              id="primaryColour"
              placeholder="#FFFFFF"
              defaultValue={
                store.state.client.settings.app.branding.primary_colour
              }
              required
            />
          </div>
          <div className={`dpf cnw input__content`}>
            <label htmlFor="secondaryColour" className="input__label">
              Secondary brand colour
            </label>
            <input
              ref={brandingSecondaryColourRef}
              type="text"
              className="input__text"
              id="secondaryColour"
              placeholder="#000000"
              defaultValue={
                store.state.client.settings.app.branding.secondary_colour
              }
              required
            />
          </div>
          <div className={`dpf cnw input__content`}>
            <label htmlFor="brandingLogo" className="input__label">
              Logo
            </label>
            <p className="description text">
              We recommend a logo in landscape orientation (123 x 21). Max 2MB.
            </p>
            {store.state.client &&
              store.state.client.settings.app.branding.logo && (
                <div className="logo__wrapper">
                  <img
                    src={store.state.client.settings.app.branding.logo}
                    className="client__logo"
                    alt="client logo"
                  />
                </div>
              )}
            <input
              ref={brandingLogoRef}
              type="file"
              id="brandingLogo"
              name="file-upload"
              accept="image/*"
              className="input__file"
              onChange={handleFileChange}
            />
          </div>
          <button
            className={`dpif aic jcc button`}
            role="submit"
            disabled={!!isUploading}
          >
            Save
          </button>
          {isUpdated && 'Updated'}
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

export default SettignsBranding;
