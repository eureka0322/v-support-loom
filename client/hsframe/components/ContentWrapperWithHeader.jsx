import React from 'react';

const ContentWrapperWithHeader = ({ subtitle, subdescription, children }) => {
  return (
    <div className="dpf cnw aic content__wrapper">
      <header className="dpf cnw aic header">
        {subtitle && <h1 className="headline">{subtitle}</h1>}
        {subdescription && <p className="description text">{subdescription}</p>}
      </header>
      {children}

      <style jsx>{`
        .content__wrapper {
          width: 100%;
          padding: 24px 0;
        }
        .content__wrapper + .content__wrapper {
          margin-top: -16px;
        }
        .header {
          width: 100%;
        }
        .headline {
          font-size: 18px;
          line-height: 24px;
          text-align: center;
          color: #0b0b0b;
          font-weight: 500;
        }
        .description {
          width: 100%;
          max-width: 85%;
          margin: 4px auto 0px;
        }
        .text {
          font-size: 16px;
          line-height: 28px;
          color: #a1a1a1;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ContentWrapperWithHeader;
