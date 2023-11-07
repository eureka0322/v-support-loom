import React from 'react';

import Logo from '../../../shared/components/Logo';

const PoweredBy = ({ display = 'vertical', version = 'light', logo }) => {
  if (display === 'horizontal') {
    return (
      <a
        href="https://videosupport.io"
        target="_blank"
        className="dpf rnw jcc aic powered-by-videosupport"
      >
        <p className="text text--horizontal">Powered By</p>
        <Logo version={version} />

        <style jsx>{`
          .powered-by-videosupport {
            width: 100%;
          }

          .text {
            color: #9f9f9f;
            text-align: center;
            font-size: 12px;
          }

          .text--horizontal {
            margin-right: 4px;
          }
        `}</style>
      </a>
    );
  } else if (display === 'vertical' && logo) {
    return (
      <a
        target="_blank"
        href="https://videosupport.io"
        className="dpf cnw jcc aic powered-by-videosupport"
      >
        <p className="text text--vertical">Powered By</p>
        <img src={logo} alt="client logo" className="client__logo" />

        <style jsx>{`
          .powered-by-videosupport {
            width: 100%;
          }

          .text {
            color: #9f9f9f;
            width: 160px;
            text-align: center;
            font-size: 12px;
          }

          .client__logo {
            width: 100%;
            max-width: 123px;
            height: 100%;
            max-height: 21px;
          }

          .text--vertical {
            margin-bottom: 4px;
          }
        `}</style>
      </a>
    );
  } else {
    return (
      <a
        target="_blank"
        href="https://videosupport.io"
        className="dpf cnw jcc aic powered-by-videosupport"
      >
        <p className="text text--vertical">Powered By</p>
        <Logo version={version} />

        <style jsx>{`
          .powered-by-videosupport {
            width: 100%;
          }

          .text {
            color: #9f9f9f;
            width: 160px;
            text-align: center;
            font-size: 12px;
          }

          .text--vertical {
            margin-bottom: 4px;
          }
        `}</style>
      </a>
    );
  }
};

export default PoweredBy;
