import React from 'react';

import { baseUrl } from '../../env.config';
import { theme } from '../../theme.config';

import Navigation from '../components/navigation/Navigation';
import Footer from '../components/Footer';

const ComingSoon = () => {
  return (
    <div className="videosupport-io">
      <Navigation />
      <div className="dpf cnw aic jcc videosupport-io__container">
        <header className="dpf cnw aic header">
          <img
            width="480"
            height="473.95"
            src={
              'https://c.tenor.com/VMC8fNKdQrcAAAAd/happy-birthday-bon-anniversaire.gif'
            }
            alt="celebrate"
            className="gif"
          />
          <h1 className="headline">Coming soon</h1>
          <div className="dpf rw jcc aic button__wrapper">
            <a href={baseUrl(`/account/login`)} className="dpf link">
              Login
            </a>
            <span className="spacer">or</span>
            <a
              href="https://videosupport.io"
              className="dpf link link--secondary"
            >
              videosupport.io
            </a>
          </div>
        </header>
      </div>
      <Footer />
      <style jsx>
        {`
          .videosupport-io__container {
            min-height: calc(
              100vh - 225px
            ); /* 84 (nav) + 73 (footer)  + 68px (margintop on footer) */
            padding: 0 16px;
          }

          .header {
            margin-top: 32px;
            width: 100%;
            max-width: 565px;
          }

          .gif {
            width: 50%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            margin-bottom: 24px;
          }

          .headline {
            font-size: 46px;
            font-weight: 700;
            line-height: 60px;
            letter-spacing: -1px;
            color: #0b0b0b;
            text-align: center;
          }

          .button__wrapper {
            margin-top: 24px;
          }

          .link {
            font-size: 16px;
            padding: 16px 40px 14px;
            border-radius: 30px;
            font-weight: 500;
            color: ${theme.button_primary_modal_text};
            background: ${theme.button_primary_modal_background};
            white-space: nowrap;
            cursor: pointer;
            border: 1px solid transparent;
          }

          .link--secondary {
            background: white;
            border: 1px solid #e5e6e6;
            color: #8614f8;
          }

          .link:hover {
            background: white;
            color: ${theme.primary_colour};
            border: 1px solid #dddddd;
          }

          .link--secondary:hover {
            border: 1px solid transparent;
            color: ${theme.button_primary_modal_text};
            background: ${theme.button_primary_modal_background};
          }

          .text {
            font-size: 18px;
            line-height: 28px;
            text-align: center;
            color: #a1a1a1;
          }

          .spacer {
            margin: 24px 16px;
          }

          @media only screen and (max-width: 768px) {
            .headline {
              font-size: 38px;
              line-height: 42px;
            }

            .description {
              margin-top: 8px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ComingSoon;
