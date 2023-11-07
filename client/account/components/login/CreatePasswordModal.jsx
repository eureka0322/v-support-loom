import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../../env.config';
import { passwordStrength } from 'check-password-strength';
import axios from 'axios';
import toast from 'react-hot-toast';

const CreatePasswordModal = ({ token }) => {
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const [passStr, setPassStr] = useState(null);
  const [doesntMatch, setDoesntMatch] = useState(true);
  const [doesntMatchMsg, setDoesntMatchMsg] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [tooWeak, setTooWeak] = useState(true);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Button is disabled if passwords don't match, so no need to check
    axios
      .post(
        baseUrl('account/set-password'),
        {
          password: passwordRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setPasswordChanged(true);
      })
      .catch((e) => {
        if (e.response.data && e.response.data.message)
          toast.error(`Error setting password: ${e.response.data.message}`, {
            duration: 10000,
          });
      });
  };

  const evaluatePassword = (e) => {
    if (e.target.value === '') {
      setPassStr(null);
    } else {
      const strength = passwordStrength(e.target.value).value;
      setPassStr(passwordStrength(e.target.value).value);
      if (passwordConfirmRef.current.value) checkPasswordMatches(e);
      if (strength !== 'Too weak') setTooWeak(false);
    }
  };

  const checkPasswordMatches = (e) => {
    const state =
      passwordRef.current.value !== passwordConfirmRef.current.value;
    setDoesntMatch(state);
    setDoesntMatchMsg(state);
  };

  return (
    <section className="dpf cnw aic create-password">
      <div className="dpf cnw aic login">
        <header className="header">
          <h1 className="headline">Create a password</h1>
        </header>
        <form className="dpf cnw form" onSubmit={handleFormSubmit}>
          <div className="dpf cnw input__group">
            <label htmlFor="password" className="input__label">
              Choose a password
            </label>
            <div className={`dpf cnw input__content`}>
              <input
                ref={passwordRef}
                type="password"
                className="input__text"
                id="password"
                onChange={evaluatePassword}
                placeholder="Your password"
                required
                disabled={passwordChanged}
              />
            </div>
          </div>
          <div className="dpf cnw input__group">
            <label htmlFor="password-repeat" className="input__label">
              Repeat password
            </label>
            <div className={`dpf cnw input__content`}>
              <input
                ref={passwordConfirmRef}
                type="password"
                className="input__text"
                id="password-repeat"
                placeholder="Repeat your password"
                required
                onChange={checkPasswordMatches}
                disabled={passwordChanged}
              />
            </div>
          </div>
          <button
            className={`dpf aic jcc button button__email__edit`}
            role="submit"
            disabled={doesntMatch || passwordChanged || tooWeak}
          >
            Submit
          </button>
        </form>
        {doesntMatchMsg && (
          <div className="block">
            <p className="text text--warning">Passwords don't match</p>
          </div>
        )}
        {passStr && (
          <div className="block">
            <p className="text bold">Password strength: {passStr} </p>
            {passStr === 'Too weak' && (
              <p className="text">
                Please choose a stronger password before continuing.
              </p>
            )}
          </div>
        )}
        {passwordChanged && (
          <div className="block">
            <p className="text">Password changed successfully</p>
          </div>
        )}
        <div className="dpf rnw block">
          <p className="text">
            Back to login?{' '}
            <button className="block-link" onClick={() => navigate('/login')}>
              Click here
            </button>
          </p>
        </div>
      </div>
      <style jsx>{`
        .create-password {
          width: 100%;
          grid-column: 9 / span 10;
          margin-top: 48px;
        }
        .login {
          padding: 48px 40px;
          background: white;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.2);
          border-radius: 5px;
          border: 1px solid var(--light-gray);
          width: 100%;
        }
        .header {
          margin-bottom: 32px;
        }
        .headline {
          font-size: 24px;
          font-weight: 500;
          color: #0b0b0b;
          text-align: center;
          line-height: 20px;
        }

        .block {
          margin-top: 16px;
        }

        .text {
          color: #0b0b0b;
          font-size: 14px;
        }
        .block-link {
          text-decoration: underline;
          color: #8614f8;
          cursor: pointer;
        }
        .block-link:hover {
          text-decoration: none;
          color: #8614f8;
        }

        .link__login {
          width: 100%;
          padding: 22px 24px 20px;
          font-size: 16px;
          line-height: 16px;
          font-weight: 500;
          border-radius: 5px;

          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.1);
        }

        .link__login--primary {
          color: white;
          background: #8614f8;
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
        }

        .link__login--secondary {
          color: #8614f8;
          background: white;
          border: 1px solid #e5e6e6;
        }

        .link__login:hover {
          color: white;
          background: #6606c6;
        }

        .link__login--email {
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          cursor: pointer;
        }

        .link__login + .link__login {
          margin-top: 16px;
        }

        .logo__google {
          position: relative;
          top: -2px;
          margin-right: 8px;
        }

        .label {
          font-weight: 500;
        }

        .terms {
          width: 100%;
          max-width: 85%;
          margin: 0 auto;
          color: var(--dark-gray);
          text-align: center;
          line-height: 24px;
          margin-top: 16px;
        }

        .link {
          color: inherit;
          text-decoration: underline;
        }

        .link:hover {
          text-decoration: none;
        }

        .form {
          width: 100%;
        }

        .input__group {
          width: 100%;
        }

        .input__group + .input__group {
          margin-top: 16px;
        }

        .input__label {
          font-size: 16px;
          cursor: pointer;
          margin-bottom: 4px;
          color: #0b0b0b;
        }
        .input__text {
          width: 100%;
          padding: 11px 16px 8px;
          border-radius: 5px;
          width: 100%;
          font-size: 16px;
          line-height: 26px;
          color: #0b0b0b
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
          -webkit-text-fill-color: #0b0b0b
        }

        .input__text:-webkit-autofill:focus {
          border: 1px solid #a1a1a1;
        }

        .button {
          width: 100%;
          padding: 22px 24px 20px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: 500;
          border-radius: 5px;
          color: var(--white);
          background: var(--primary);
          border: 1px solid #E5E6E6;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.1);
          margin: 16px 0 0;
        }

        .block {
          margin-top: 16px;
        }

        .text {
          color: #0b0b0b;
          text-align: center;
          line-height: 22px;
        }

        .text--warning {
          color: #E2001A;
        }

        @media only screen and (max-width: 890px) {
          .create-password {
            grid-column: 6 / span 14;
          }
        }
        @media only screen and (max-width: 768px) {
          .create-password {
            grid-column: 2 / span 22;
          }
        }
      `}</style>
    </section>
  );
};

export default CreatePasswordModal;
