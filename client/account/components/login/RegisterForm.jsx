import React, { useRef, useState } from 'react';
import axios from 'axios';

import { baseUrl } from '../../../env.config';

const RegisterForm = () => {
  const emailInputRef = useRef(null);
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [error, setError] = useState(null);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;

    axios
      .post(baseUrl('account/register'), {
        email: email,
      })
      .then((res) => {
        setError(null);
        setCheckedEmail(true);
      })
      .catch((e) => {
        if (e.response.status === 401) {
          setError(
            'User not authorized: you are not the admin of the account to which you are associated. '
          );
        } else if (e.response.status === 400) {
          setError('Invalid e-mail. Type a valid one and try again');
        } else {
          setError('Unknown error. Contact us at hello@videosupport.io');
        }
      });
  };

  return (
    <form className="dpf cnw form" onSubmit={handleOnSubmit}>
      <div className="dpf cnw input__group">
        <label htmlFor="email" className="input__label">
          Register with email
        </label>
        <div className={`dpf cnw input__content`}>
          <input
            ref={emailInputRef}
            type="email"
            className="input__text"
            id="email"
            placeholder="Your email"
            required
            disabled={checkedEmail}
          />
        </div>
      </div>
      <button
        className={`dpf aic jcc button button__email__edit`}
        role="submit"
        disabled={checkedEmail}
      >
        Register
      </button>
      {checkedEmail && (
        <div className="block">
          <p className="text">
            Thank you for registering. <br /> Check your e-mail inbox to
            continue.
          </p>
        </div>
      )}
      {error && (
        <div className="block">
          <p className="text text--warning">{error}</p>
        </div>
      )}
      <style jsx>{`
        .form {
          width: 100%;
          margin-top: 64px;

          position: relative;
        }

        .form::before {
          content: "";
          position: absolute;
          top: -32px;
          height: 1px;
          background: #E5E6E6;
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
          color: #8614f8;
          background: white;
          border: 1px solid #E5E6E6;
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          transition: background ease-in-out 0.15s;
          box-shadow: 0 1px 1px 0 rgba(11, 11, 11, 0.1);
        }

        .button__email__edit {
          width: 100%;
          margin: 16px 0 0;
          line-height: 14px;
        }
        .button__email__edit:hover {
          background: #e5e6e6;
        }

        .button:disabled {
          background: #e5e6e6;
          cursor: not-allowed;
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
      `}</style>
    </form>
  );
};

export default RegisterForm;
