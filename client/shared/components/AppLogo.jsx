import React from 'react';

import { baseUrl } from '../../env.config.js';

import LogoMark from './LogoMark';

const AppLogo = () => {
  return (
    <a href={baseUrl('/account/overview')} className="dpf rw aic app-logo">
      <div className="dpf jcc aic app-logomark">
        <div className="app-icon">
          <LogoMark />
        </div>
      </div>
      <span className="text">videosupport</span>
      <style jsx>{`
        .app-logo {
          color: #0b0b0b;
          padding: 0 16px;
        }
        .app-logo:hover {
          color: #8614f8;
        }
        .app-logomark {
          background-image: linear-gradient(180deg, #8614f8 0%, #760be0 100%);
          box-shadow: inset 0 1px 1px 0 rgba(245, 245, 247, 0.25);
          border-radius: 12px;
          width: 50px;
          height: 50px;
          overflow: hidden;
        }
        .app-icon {
          position: relative;
          top: 1px;
          left: 2px;
          transform: scale(0.65);
        }
        .text {
          font-size: 18px;
          line-height: 18px;
          font-weight: 500;
          margin-left: 12px;
          position: relative;
          top: 1px;
        }

        @media only screen and (max-width: 1440px) {
          .app-logo {
            flex-flow: column nowrap;
            align-items: center;
          }
          .text {
            margin-top: 8px;
            margin-left: 0;
          }
        }

        @media only screen and (max-width: 1050px) {
          .text {
            display: none;
          }
        }
      `}</style>
    </a>
  );
};

export default AppLogo;
