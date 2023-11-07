import React, { useState, useEffect } from 'react';

import EmailForm from './EmailForm';
import RegisterForm from './RegisterForm';

const LoginModal = () => {
  const [isRegisterFormVisible, setRegisterFormvisible] = useState(false);
  useEffect(() => {
    if (window.location.hash === '#register') {
      setRegisterFormvisible(true);
    }
  }, []);
  return (
    <section className="dpf cnw aic login__section">
      <div className="dpf cnw aic login">
        <header className="header">
          {isRegisterFormVisible ? (
            <h1 className="headline">Register to videosupport</h1>
          ) : (
            <h1 className="headline">Login to videosupport</h1>
          )}
        </header>
        <a
          href="/auth/google"
          className="dpf jcc aic link__login link__login--primary"
        >
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="17.6px"
            height="18px"
            className="logo__google"
          >
            <path
              id="Path_1_"
              fill="white"
              d="M17.6,9.2c0-0.6-0.1-1.3-0.2-1.8H9v3.5h4.8C13.6,12,13,12.9,12,13.6v2.3H15
     C16.7,14.3,17.6,11.9,17.6,9.2z"
            />
            <path
              fill="white"
              d="M9,18c2.4,0,4.5-0.8,6-2.2L12,13.6c-0.8,0.5-1.8,0.9-3,0.9c-2.3,0-4.3-1.6-5-3.7H1V13C2.4,16,5.5,18,9,18z"
            />
            <path
              fill="white"
              d="M4,10.7C3.8,10.2,3.7,9.6,3.7,9S3.8,7.8,4,7.3V5H1C0.3,6.2,0,7.5,0,9s0.3,2.8,1,4L4,10.7z"
            />
            <path
              fill="white"
              d="M9,3.6c1.3,0,2.5,0.5,3.4,1.3L15,2.3C13.5,0.9,11.4,0,9,0C5.5,0,2.4,2,1,5l3,2.3C4.7,5.2,6.7,3.6,9,3.6z"
            />
          </svg>
          <span className="label">Continue with Google</span>
        </a>
        {!isRegisterFormVisible ? <EmailForm /> : <RegisterForm />}
        {!isRegisterFormVisible ? (
          <div className="dpf rnw block">
            <p className="text">
              Don't have an account?{' '}
              <button
                className="block-link"
                onClick={() => setRegisterFormvisible(true)}
              >
                Register here
              </button>
            </p>
          </div>
        ) : (
          <div className="dpf rnw block">
            <p className="text">
              Back to login?{' '}
              <button
                className="block-link"
                onClick={() => setRegisterFormvisible(false)}
              >
                Click here
              </button>
            </p>
          </div>
        )}
      </div>
      <div className="terms">
        By continuing you agree to our{' '}
        <a
          href="https://www.videosupport.io/terms-of-service"
          target="_blank"
          className="link"
          rel="noreferrer"
        >
          Terms & Conditions
        </a>
        .
      </div>

      <style jsx>{`
        .login__section {
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

        @media only screen and (max-width: 890px) {
          .login__section {
            grid-column: 6 / span 14;
          }
        }
        @media only screen and (max-width: 768px) {
          .login__section {
            grid-column: 2 / span 22;
          }
        }
      `}</style>
    </section>
  );
};

export default LoginModal;
