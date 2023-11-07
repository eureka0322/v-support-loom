import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import loadToken from '../../utils/loadToken';
import { decode } from 'jsonwebtoken';
import { useQueryString } from '../../../shared/hooks/useQueryString';
import { baseUrl } from '../../../env.config';
import { useAccountStore } from '../../store';
import toast from 'react-hot-toast';

import Cookies from 'cookies-js';


const CrispEmailForm = () => {
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const store = useAccountStore();
  const [isCrispLogin, setIsCrispLogin] = useState(null);

  const query = useQueryString();
  const accessToken = query.get('token');
  const crisp_email = query.get('crisp_email');
  const { clientId } = decode(accessToken);

  console.log('clientId = ', clientId)

  const token = Cookies.get('videosupport-io-token');

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;
    const is_crisp_form = true;
    const crisp_client_id = clientId;

    axios
      .post(baseUrl('account/crisp-email-login'), {
        email,
        password,
        crisp_client_id,
        crisp_email,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {

        if(res.data == 'no_pass') {

          setIsCrispLogin(false);
          toast.error("Please use the same email as your crisp account");

        } else if(res.data === false) {

          setIsCrispLogin(false);
          toast.error("Couldn't login. Check your e-mail and password");

        } else {

          setIsCrispLogin(true);
          setTimeout(function(){ window.location.reload();}, 2000);

        }
      })
      .catch((e) => {
        console.log('crisp Login failed = ', e);
        toast.error("Couldn't login. Check your e-mail and password");
      });
  };

  var register_link = baseUrl('/');

  return (
    <div className="main_div">
      {!isCrispLogin && (
        <form className="dpf cnw form" onSubmit={handleOnSubmit}>

          <div className="dpf rnw block">
              <p className="text">
                Don't have an account?
                  <a href={register_link} target="_blank">Register here</a>
              </p>
          </div>

          <div className="dpf cnw input__group">
            <label htmlFor="email" className="input__label">
              Email
            </label>
            <div className={`dpf cnw input__content`}>
              <input
                ref={emailInputRef}
                type="email"
                className="input__text"
                id="email"
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div className="dpf cnw input__group">
            <label htmlFor="password" className="input__label">
              Password
            </label>
            <div className={`dpf cnw input__content`}>
              <input
                ref={passwordInputRef}
                type="password"
                className="input__text"
                id="password"
                placeholder="Your password"
                required
              />
            </div>
          </div>
          <button
            className={`dpf aic jcc button button__email__edit`}
            role="submit"
          >
            Login
          </button>
        </form>
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
              background: #009900;
              cursor: not-allowed;
            }

            .block {
              margin-top: 16px;
            }

            .text {
              color: #0b0b0b;
              font-size: 14px;
              margin-bottom:12px;
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

        `}</style>
    </div>

  );
};

export default CrispEmailForm;
