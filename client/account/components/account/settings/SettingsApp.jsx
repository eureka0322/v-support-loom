import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../../../../env.config';
import { useAccountStore } from '../../../store';
import { useQueryString } from '../../../../shared/hooks/useQueryString';
import { Cookies } from 'cookies-js';
import toast from 'react-hot-toast';
import PluginConfig from './PluginConfig';

const SettingsApp = () => {

  const brandingPrimaryColourRef = useRef(null);
  const brandingSecondaryColourRef = useRef(null);

  const store = useAccountStore();
  const referrerUrlRef = useRef(null);
  const [isUpdated, setUpdated] = useState(false);
  const [plugins, setPlugins] = useState(null);
  const [pluginDescription, setPluginDescription] = useState(null);
  const [pluginChosenValues, setPluginChosenValues] = useState(null);
  const query = useQueryString();

  const emailRef = useRef(null);


  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setUpdated(false);
    }, 2000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [isUpdated]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const referrerUrl = referrerUrlRef.current.value;

    const token =
      query.get('access_token') ||
      store.state.bearer ||
      Cookies.get('videosupport-io-token');

    axios
      .post(
        baseUrl('db/settings/app/referrer/update'),
        {
          clientId: store.state.client.id,
          referrerUrl: referrerUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((_) => {
        setUpdated(true);
        store.setClientSettings({
          referrerUrl: referrerUrl,
        });
      })
      .catch((err) => {
        console.error(`[Error updating settings] ${err}`);
      });
  };

  const handleEmailForm = (e) => {
    e.preventDefault();


  };

  const handleAccountForm = (e) => {
    e.preventDefault();

    const newEmail = emailRef.current.value;
    // if email is updated
    if (newEmail !== store.state.user.email && newEmail !== '') {
      // check if email is valid
      if (!newEmail.includes('@')) {
        toast.error('Please enter a valid email address');
        return;
      }
      // check if email is different from current email
      if (newEmail === store.state.user.email) {
        toast.error('Please enter a different email address');
        return;
      }
      // check if email has a valid domain
      const domain = newEmail.split('@')[1];
      if (!domain.includes('.')) {
        toast.error('Please enter a valid email address');
        return;
      }
      // check if email is already in use
      const token = query.get('access_token') ||
        store.state.bearer ||
        Cookies.get('videosupport-io-token');

      axios
        .post(
          baseUrl('db/settings/user/email/update'),
          {
            clientId: store.state.client.id,
            email: store.state.user.email,
            newEmail: newEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((_) => {
          // setUpdated(true);
          // store.setUser({
          //   email: newEmail,
          // });
          toast.success('Email updated successfully');
          // in 3 seconds, delect cookies and redirect to login page
          setTimeout(() => {
            Cookies.expire('videosupport-io-token');
            Cookies.expire('videosupport-io-refresh-token');
            window.location.href = '/account/login';
          }, 3000);
        })
        .catch((err) => {
          console.error(`[Error updating settings] ${err}`);
        });
    } else {
      const newPassword = brandingPrimaryColourRef.current.value;
      const confirmPassword = brandingSecondaryColourRef.current.value;

      if (newPassword.length < 6) {
        toast.error('Password length should be at least 6 characters.');

      } else if (newPassword != confirmPassword) {
        toast.error('Password and confirm password are not matched');

      } else {

        const token =
          query.get('access_token') ||
          store.state.bearer ||
          Cookies.get('videosupport-io-token');

        axios
          .post(
            'account/update-password',
            {
              newPassword,
              confirmPassword
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            console.log('res = ', res)
            var data = res.data;

            if (data == 'length_err') {

              toast.error('Password length should be at least 6 characters.');

            } else if (data == 'password_not_matched') {

              toast.error('Password and confirm password are not matched');

            } else if (data === true) {

              toast.success(`Password updated successfully`);

            } else {

              toast.error(
                'Error updating password. Contact us at hello@videosupport.io for support'
              );

            }
          })
          .catch((e) => {
            console.log('password catch = ', e)
            toast.error(
              'Error updating password. Contact us at hello@videosupport.io for support'
            );
          });
      }
    }
  };

  return (
    <div>
      <div className="dpf cnw settings settings__form">
        <header className="header">
          <h2 className="headline">App</h2>
        </header>
        <form className="dpf cnw aic form" onSubmit={handleOnSubmit}>
          <div className="dpf cnw input__group">
            <div className={`dpf cnw input__content`}>
              <label htmlFor="referrerUrl" className="input__label">
                Referrer URL
              </label>
              <p className="description text">
                The website you'd like to referrer to after the recording is
                submitted.
              </p>
              <input
                ref={referrerUrlRef}
                type="text"
                className="input__text"
                id="referrerUrl"
                placeholder="Your website"
                defaultValue={store.state.client.settings.app.referrerUrl}
                required
              />
            </div>
          </div>
          <button className={`dpif aic jcc button`} role="submit">
            Save
          </button>
          {isUpdated && 'Updated'}
        </form>

        <div className="dpf cnw input__group">

          <div className={`dpf cnw input__content`}>

            <br /><br />
            <header className="header">
              <h2 className="headline">Update Account</h2>
            </header>

            <form className="dpf cnw aic form" onSubmit={handleAccountForm}>
              <div className="dpf cnw input__group">
                <label htmlFor="newEmail" className="input__label">
                  New Email:
                </label>
                <input
                  ref={emailRef}
                  type="text"
                  className="input__text"
                  id="newEmail"
                  autoComplete="on"
                />
                </div>

<div>
                  <b>OR</b>
                </div>
                <div className="dpf cnw input__group">

                <div className={`dpf cnw input__content`}>
                  <label htmlFor="newPassword" className="input__label">
                    New Password:
                  </label>
                  <input
                    ref={brandingPrimaryColourRef}
                    type="password"
                    className="input__text"
                    id="newPassword"
                    autoComplete="off"
                  />

                </div>
                <div className={`dpf cnw input__content`}>
                  <label htmlFor="confirmPassword" className="input__label">
                    Confirm Password:
                  </label>
                  <input
                    ref={brandingSecondaryColourRef}
                    type="password"
                    className="input__text"
                    id="confirmPassword"
                    autoComplete="off"
                  />

                </div>
              </div>
              <button className={`dpif aic jcc button`} role="submit">
                Submit
              </button>
            </form>
          </div>
        </div>

      </div >
      <PluginConfig />
      <style jsx>{`
        .header {
          margin-bottom: 16px;
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

        .input__group + .input__group {
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
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          background: transparent;
          border: 1px solid #e5e6e6;
          transition: all ease-in-out 0.15s;
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

        .dropdown__wrapper {
          position: relative;
          margin-top: 8px;
        }

        .dropdown__wrapper::after {
          content: '';
          position: absolute;
          top: calc(50% - 6px);
          right: 24px;
          display: inline-block;
          transform: rotate(45deg);
          border-style: solid;
          border-width: 6px 6px 0 0;
          border-color: transparent #8614f8 transparent transparent;
        }

        .dropdown {
          padding: 11px 32px 8px 16px;
          border-radius: 5px;
          width: 100%;
          height: 47px;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b;
          border: 1px solid #e5e6e6;
          font-family: inherit;
          appearance: none;
          cursor: pointer;
          text-overflow: ellipsis;
        }

        .dropdown:focus {
          outline: none;
          border: 1px solid #a1a1a1;
        }

        .block {
          margin-top: 24px;
          width: 100%;
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
          background: #009900;
          cursor: not-allowed;
        }
      `}</style>
    </div >
  );
};

export default SettingsApp;
